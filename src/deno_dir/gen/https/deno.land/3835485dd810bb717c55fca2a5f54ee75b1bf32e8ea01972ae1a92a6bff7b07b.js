import { deleteCookie, encoder, setCookie, Status, STATUS_TEXT, } from "../../deps.ts";
export class Response {
    body = "";
    headers;
    request;
    status_code = Status.OK;
    options;
    constructor(request, options = {}) {
        this.options = options;
        this.request = request;
        this.headers = new Headers();
        this.headers.set("Content-Type", this.getContentType());
    }
    render(...args) {
        return false;
    }
    setCookie(cookie) {
        let response = {
            status: this.status_code,
            body: "",
            headers: this.headers,
        };
        setCookie(response, cookie);
    }
    delCookie(cookieName) {
        let response = {
            status: this.status_code,
            body: "",
            headers: this.headers,
        };
        deleteCookie(response, cookieName);
    }
    generateResponse() {
        let contentType = this.headers.get("Content-Type");
        switch (contentType) {
            case "application/json":
                return this.body ? JSON.stringify(this.body) : "";
            case "application/xml":
            case "text/html":
            case "text/xml":
            case "text/plain":
            default:
                if (this.body === null) {
                    return "null";
                }
                if (this.body === undefined) {
                    return "undefined";
                }
                if (typeof this.body === "boolean") {
                    return this.body.toString();
                }
                if (typeof this.body !== "string") {
                    return "null";
                }
                return this.body;
        }
    }
    getStatusMessage() {
        let message = STATUS_TEXT.get(this.status_code);
        return message ? message : null;
    }
    getStatusMessageFull() {
        let message = STATUS_TEXT.get(this.status_code);
        return message ? `${this.status_code} (${message})` : null;
    }
    redirect(httpStatusCode, location) {
        this.status_code = httpStatusCode;
        this.headers.set("Location", location);
        let output = {
            status: this.status_code,
            headers: this.headers,
            body: "",
        };
        this.request.respond(output);
        output.status_code = this.status_code;
        return output;
    }
    async send() {
        let body = this.generateResponse();
        let output = {
            status: this.status_code,
            headers: this.headers,
            body: encoder.encode(body),
        };
        this.request.respond(output);
        output.status_code = this.status_code;
        return output;
    }
    sendStatic() {
        let output = {
            status: this.status_code,
            headers: this.headers,
            body: this.body,
        };
        this.request.respond(output);
        output.status_code = this.status_code;
        return output;
    }
    getContentType() {
        if (this.options.default_content_type) {
            return this.options.default_content_type;
        }
        return this.getContentTypeFromRequestAcceptHeader();
    }
    getContentTypeFromRequestAcceptHeader() {
        const accept = this.request.headers.get("Accept") ||
            this.request.headers.get("accept");
        if (accept) {
            try {
                let contentTypes = accept.split(";")[0].trim();
                if (contentTypes && contentTypes === "*/*") {
                    return "application/json";
                }
                if (contentTypes.includes(",")) {
                    let firstType = contentTypes.split(",")[0].trim();
                    if (firstType == "*/*") {
                        return "application/json";
                    }
                    return firstType;
                }
            }
            catch (error) {
            }
        }
        return "application/json";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBRUwsWUFBWSxFQUNaLE9BQU8sRUFDUCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFdBQVcsR0FDWixNQUFNLGVBQWUsQ0FBQztBQVN2QixNQUFNLE9BQU8sUUFBUTtJQUlaLElBQUksR0FBaUQsRUFBRSxDQUFDO0lBS3hELE9BQU8sQ0FBVTtJQUtqQixPQUFPLENBQXFCO0lBTzVCLFdBQVcsR0FBVyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBSzdCLE9BQU8sQ0FBVztJQWE1QixZQUFZLE9BQTJCLEVBQUUsVUFBb0IsRUFBRTtRQUM3RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFZTSxNQUFNLENBQ1gsR0FBRyxJQUFlO1FBRWxCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQVFNLFNBQVMsQ0FBQyxNQUFjO1FBQzdCLElBQUksUUFBUSxHQUFHO1lBQ2IsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBS3hCLElBQUksRUFBRSxFQUFFO1lBQ1IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFDRixTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFPTSxTQUFTLENBQUMsVUFBa0I7UUFDakMsSUFBSSxRQUFRLEdBQUc7WUFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFLeEIsSUFBSSxFQUFFLEVBQUU7WUFDUixPQUFPLEVBQUUsSUFB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