import { decoder, getCookies, MultipartReader, ServerRequest, } from "../../deps.ts";
import { Drash } from "../../mod.ts";
export class Request extends ServerRequest {
    parsed_body = {
        content_type: "",
        data: undefined,
    };
    path_params = {};
    url_query_params = {};
    url_path;
    resource = null;
    original_request;
    constructor(originalRequest, options) {
        super();
        this.headers = originalRequest.headers;
        this.method = originalRequest.method;
        this.original_request = originalRequest;
        this.url = originalRequest.url;
        this.url_path = this.getUrlPath(originalRequest);
        this.url_query_params = this.getUrlQueryParams();
    }
    accepts(type) {
        return new Drash.Services.HttpService().accepts(this, type);
    }
    getAllBodyParams() {
        return this.parsed_body;
    }
    getAllHeaderParams() {
        let headers = {};
        for (const pair of this.headers.entries()) {
            headers[pair[0]] = pair[1];
        }
        return headers;
    }
    getAllPathParams() {
        return this.path_params;
    }
    getAllUrlQueryParams() {
        return this.url_query_params;
    }
    getBodyFile(input) {
        if (typeof this.parsed_body.data.file === "function") {
            const file = this.parsed_body.data.file(input);
            if (Array.isArray(file)) {
                return file[0];
            }
            return file;
        }
        return undefined;
    }
    getBodyParam(input) {
        let param;
        if (typeof this.parsed_body.data.value === "function") {
            param = this.parsed_body.data.value(input);
        }
        else {
            param = this.parsed_body.data[input];
        }
        if (param || typeof param === "boolean") {
            return param;
        }
        return null;
    }
    getCookie(name) {
        const cookies = getCookies(this.original_request);
        return cookies[name];
    }
    getHeaderParam(input) {
        return this.headers.get(input);
    }
    getPathParam(input) {
        let param = this.path_params[input];
        if (param) {
            return param;
        }
        return null;
    }
    getUrlPath(serverRequest) {
        let path = serverRequest.url;
        if (path == "/") {
            return path;
        }
        if (path.indexOf("?") == -1) {
            return path;
        }
        try {
            path = path.split("?")[0];
        }
        catch (error) {
        }
        return path;
    }
    getUrlQueryParam(input) {
        const param = this.url_query_params[input];
        if (param) {
            return param;
        }
        return null;
    }
    getUrlQueryParams() {
        let queryParams = {};
        try {
            let queryParamsString = this.getUrlQueryString();
            if (!queryParamsString) {
                queryParamsString = "";
            }
            queryParams = Drash.Services.StringService.parseQueryParamsString(queryParamsString);
        }
        catch (error) {
        }
        return queryParams;
    }
    getUrlQueryString() {
        let queryString = null;
        if (this.url.indexOf("?") == -1) {
            return queryString;
        }
        try {
            queryString = this.url.split("?")[1];
        }
        catch (error) {
        }
        return queryString;
    }
    async hasBody() {
        let contentLength = this.headers.get("content-length");
        if (!contentLength) {
            contentLength = this.headers.get("Content-Length");
        }
        if (!contentLength) {
            return false;
        }
        return parseInt(contentLength) > 0;
    }
    async parseBody(options) {
        if ((await this.hasBody()) === false) {
            return {
                content_type: "",
                data: undefined,
            };
        }
        const contentType = this.headers.get("Content-Type");
        if (!contentType) {
            try {
                const ret = {
                    data: await this.parseBodyAsFormUrlEncoded(),
                    content_type: "application/x-www-form-urlencoded",
                };
                this.parsed_body = ret;
                return this.parsed_body;
            }
            catch (error) {
                throw new Error(`Error reading request body. No Content-Type header was specified. ` +
                    `Therefore, the body was parsed as application/x-www-form-urlencoded ` +
                    `by default and failed.`);
            }
        }
        if (contentType && contentType.includes("multipart/form-data")) {
            let boundary = null;
            try {
                const match = contentType.match(/boundary=([^\s]+)/);
                if (match) {
                    boundary = match[1];
                }
                if (!boundary) {
                    return {
                        content_type: "",
                        data: undefined,
                    };
                }
            }
            catch (error) {
                throw new Error(`Error trying to find boundary.\n` + error.stack);
            }
            try {
                let maxMemory = 10;
                if (options &&
                    options.memory_allocation &&
                    options.memory_allocation.multipart_form_data &&
                    options.memory_allocation.multipart_form_data > 10) {
                    maxMemory = options.memory_allocation.multipart_form_data;
                }
                const ret = {
                    data: await this.parseBodyAsMultipartFormData(this.original_request.body, boundary, maxMemory),
                    content_type: "multipart/form-data",
                };
                this.parsed_body = ret;
                return this.parsed_body;
            }
            catch (error) {
                throw new Error(`Error reading request body as multipart/form-data.`);
            }
        }
        if (contentType && contentType.includes("application/json")) {
            try {
                const ret = {
                    data: await this.parseBodyAsJson(),
                    content_type: "application/json",
                };
                this.parsed_body = ret;
                return this.parsed_body;
            }
            catch (error) {
                throw new Error(`Error reading request body as application/json.`);
            }
        }
        if (contentType &&
            contentType.includes("application/x-www-form-urlencoded")) {
            try {
                const ret = {
                    data: await this.parseBodyAsFormUrlEncoded(),
                    content_type: "application/x-www-form-urlencoded",
                };
                this.parsed_body = ret;
                return this.parsed_body;
            }
            catch (error) {
                throw new Error(`Error reading request body as application/x-www-form-urlencoded.`);
            }
        }
        return {
            content_type: "",
            data: undefined,
        };
    }
    async parseBodyAsFormUrlEncoded() {
        let body = decoder.decode(await Deno.readAll(this.original_request.body));
        if (body.indexOf("?") !== -1) {
            body = body.split("?")[1];
        }
        body = body.replace(/\"/g, "");
        return Drash.Services.StringService.parseQueryParamsString(body);
    }
    async parseBodyAsJson() {
        const data = decoder.decode(await Deno.readAll(this.original_request.body));
        return JSON.parse(data);
    }
    async parseBodyAsMultipartFormData(body, boundary, maxMemory) {
        if (!maxMemory) {
            maxMemory = 1024 * 1024 * 128;
        }
        else {
            maxMemory *= 1024 * 1024;
        }
        const mr = new MultipartReader(body, boundary);
        const ret = await mr.readForm(maxMemory);
        return ret;
    }
    async respond(output) {
        this.original_request.respond(output);
    }
    setHeaders(headers) {
        if (headers) {
            for (let key in headers) {
                this.headers.set(key, headers[key]);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLE9BQU8sRUFFUCxVQUFVLEVBRVYsZUFBZSxFQUNmLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBU3JDLE1BQU0sT0FBTyxPQUFRLFNBQVEsYUFBYTtJQUNqQyxXQUFXLEdBQXVDO1FBQ3ZELFlBQVksRUFBRSxFQUFFO1FBQ2hCLElBQUksRUFBRSxTQUFTO0tBQ2hCLENBQUM7SUFDSyxXQUFXLEdBQThCLEVBQUUsQ0FBQztJQUM1QyxnQkFBZ0IsR0FBOEIsRUFBRSxDQUFDO0lBQ2pELFFBQVEsQ0FBUztJQUNqQixRQUFRLEdBQStCLElBQUksQ0FBQztJQUN6QyxnQkFBZ0IsQ0FBZ0I7SUFrQjFDLFlBQVksZUFBOEIsRUFBRSxPQUFrQjtRQUM1RCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBYU0sT0FBTyxDQUFDLElBQXVCO1FBQ3BDLE9BQU8sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQU9NLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQU9NLGtCQUFrQjtRQUN2QixJQUFJLE9BQU8sR0FBOEIsRUFBRSxDQUFDO1FBQzVDLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQVFNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQVFNLG9CQUFvQjtRQUN6QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBVU0sV0FBVyxDQUFDLEtBQWE7UUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBSWhELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEI7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQU9NLFlBQVksQ0FDakIsS0FBYTtRQUViLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSyxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFFdEQsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QzthQUFNO1lBSUwsS0FBSyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBaUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwRTtRQUNELElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBVU0sU0FBUyxDQUFDLElBQVk7UUFDM0IsTUFBTSxPQUFPLEdBQThCLFVBQVUsQ0FDbkQsSUFBSSxDQUFDLGdCQUFnQixDQUN0QixDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQU9NLGNBQWMsQ0FBQyxLQUFhO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQU9NLFlBQVksQ0FBQyxLQUFhO1FBRS9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBT00sVUFBVSxDQUFDLGFBQTRCO1FBQzVDLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7UUFFN0IsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSTtZQUNGLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO1FBQUMsT0FBTyxLQUFLLEVBQUU7U0FFZjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU9NLGdCQUFnQixDQUFDLEtBQWE7UUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVdPLGlCQUFpQjtRQUN2QixJQUFJLFdBQVcsR0FBOEIsRUFBRSxDQUFDO1FBRWhELElBQUk7WUFDRixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDdEIsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO2FBQ3hCO1lBQ0QsV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUMvRCxpQkFBaUIsQ0FDbEIsQ0FBQztTQUNIO1FBQUMsT0FBTyxLQUFLLEVBQUU7U0FFZjtRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFRTSxpQkFBaUI7UUFDdEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFFRCxJQUFJO1lBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBQUMsT0FBTyxLQUFLLEVBQUU7U0FFZjtRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFRTSxLQUFLLENBQUMsT0FBTztRQUNsQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDcEQ7UUFFRCxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQVVNLEtBQUssQ0FBQyxTQUFTLENBQ3BCLE9BQWtCO1FBRWxCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUNwQyxPQUFPO2dCQUNMLFlBQVksRUFBRSxFQUFFO2dCQUNoQixJQUFJLEVBQUUsU0FBUzthQUNoQixDQUFDO1NBQ0g7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUdyRCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLElBQUk7Z0JBQ0YsTUFBTSxHQUFHLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFO29CQUM1QyxZQUFZLEVBQUUsbUNBQW1DO2lCQUNsRCxDQUFDO2dCQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDekI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUNiLG9FQUFvRTtvQkFDbEUsc0VBQXNFO29CQUN0RSx3QkFBd0IsQ0FDM0IsQ0FBQzthQUNIO1NBQ0Y7UUFPRCxJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDOUQsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztZQUNuQyxJQUFJO2dCQUNGLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDckQsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDckI7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDYixPQUFPO3dCQUNMLFlBQVksRUFBRSxFQUFFO3dCQUNoQixJQUFJLEVBQUUsU0FBUztxQkFDaEIsQ0FBQztpQkFDSDthQUNGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDYixrQ0FBa0MsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUNqRCxDQUFDO2FBQ0g7WUFDRCxJQUFJO2dCQUNGLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztnQkFDM0IsSUFDRSxPQUFPO29CQUNQLE9BQU8sQ0FBQyxpQkFBaUI7b0JBQ3pCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUI7b0JBQzdDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLEVBQ2xEO29CQUNBLFNBQVMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUM7aUJBQzNEO2dCQUNELE1BQU0sR0FBRyxHQUFHO29CQUNWLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyw0QkFBNEIsQ0FDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFDMUIsUUFBUSxFQUNSLFNBQVMsQ0FDVjtvQkFDRCxZQUFZLEVBQUUscUJBQXFCO2lCQUNwQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDekI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUNiLG9EQUFvRCxDQUNyRCxDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUMzRCxJQUFJO2dCQUNGLE1BQU0sR0FBRyxHQUFHO29CQUNWLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ2xDLFlBQVksRUFBRSxrQkFBa0I7aUJBQ2pDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN6QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQ2IsaURBQWlELENBQ2xELENBQUM7YUFDSDtTQUNGO1FBRUQsSUFDRSxXQUFXO1lBQ1gsV0FBVyxDQUFDLFFBQVEsQ0FBQyxtQ0FBbUMsQ0FBQyxFQUN6RDtZQUNBLElBQUk7Z0JBQ0YsTUFBTSxHQUFHLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFO29CQUM1QyxZQUFZLEVBQUUsbUNBQW1DO2lCQUNsRCxDQUFDO2dCQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDekI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUNiLGtFQUFrRSxDQUNuRSxDQUFDO2FBQ0g7U0FDRjtRQUVELE9BQU87WUFDTCxZQUFZLEVBQUUsRUFBRTtZQUNoQixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDO0lBQ0osQ0FBQztJQVFNLEtBQUssQ0FBQyx5QkFBeUI7UUFHcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FDdkIsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FDL0MsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM1QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjtRQUNELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFPTSxLQUFLLENBQUMsZUFBZTtRQUMxQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUN6QixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUMvQyxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFZTSxLQUFLLENBQUMsNEJBQTRCLENBQ3ZDLElBQVksRUFDWixRQUFnQixFQUNoQixTQUFpQjtRQUlqQixJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQy9CO2FBQU07WUFDTCxTQUFTLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztTQUMxQjtRQUNELE1BQU0sRUFBRSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBUU0sS0FBSyxDQUFDLE9BQU8sQ0FDbEIsTUFBdUM7UUFFdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBT00sVUFBVSxDQUFDLE9BQWtDO1FBQ2xELElBQUksT0FBTyxFQUFFO1lBQ1gsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNyQztTQUNGO0lBQ0gsQ0FBQztDQUNGIn0=