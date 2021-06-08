import { Drash } from "../../mod.ts";
import { IndexService, serve, serveTLS, } from "../../deps.ts";
export class Server {
    static REGEX_URI_MATCHES = new RegExp(/(:[^(/]+|{[^0-9][^}]*})/, "g");
    static REGEX_URI_REPLACEMENT = "([^/]+)";
    deno_server = null;
    hostname = "localhost";
    port = 1447;
    configs;
    middleware = {
        runtime: new Map(),
    };
    services = {
        http_service: new Drash.Services.HttpService(),
        resource_index_service: new IndexService(new Map()),
    };
    static_paths = [];
    virtual_paths = new Map();
    constructor(configs) {
        this.configs = this.buildConfigs(configs);
        this.addMiddleware();
        this.addResources();
        this.addStaticPaths();
    }
    async handleHttpRequest(serverRequest) {
        const request = await this.buildRequest(serverRequest);
        let response = this.buildResponse(request);
        try {
            await this.executeMiddlewareBeforeRequest(request);
            if (request.url == "/favicon.ico") {
                return await this.handleHttpRequestForFavicon(request);
            }
            if (this.requestTargetsStaticPath(request)) {
                return await this.handleHttpRequestForStaticPathAsset(request);
            }
            if (this.requestTargetsVirtualPath(request)) {
                return await this.handleHttpRequestForVirtualPathAsset(request);
            }
            return await this.handleHttpRequestForResource(request, response);
        }
        catch (error) {
            return await this.handleHttpRequestError(request, new Drash.Exceptions.HttpException(error.code ?? 400, error.message));
        }
    }
    async handleHttpRequestError(request, error, resource = null, response = null) {
        this.log(`Error occurred while handling request: ${request.method} ${request.url}`);
        this.log(error.message);
        if (error.stack) {
            this.log("Stack trace below:");
            this.log(error.stack);
        }
        this.log("Generating generic error response object.");
        if (resource) {
            if (!response) {
                const resourceObj = resource;
                const method = request.method.toUpperCase();
                if (typeof resourceObj[method] !== "function") {
                    error = new Drash.Exceptions.HttpException(405);
                }
            }
        }
        response = this.buildResponse(request);
        response.status_code = error.code ? error.code : 500;
        response.body = error.message ? error.message : response.getStatusMessage();
        this.log(`Sending response. Content-Type: ${response.headers.get("Content-Type")}. Status: ${response.getStatusMessageFull()}.`);
        try {
            await this.executeMiddlewareAfterRequest(request, response);
        }
        catch (error) {
        }
        return response.send();
    }
    async handleHttpRequestForFavicon(request) {
        const response = this.buildResponse(request);
        response.body = "";
        response.headers = new Headers();
        response.status_code = 200;
        response.headers.set("Content-Type", "image/x-icon");
        try {
            response.body = await Deno.readFile(`${await Deno.realPath(".")}/favicon.ico`);
        }
        catch (error) {
        }
        return response.send();
    }
    async handleHttpRequestForResource(request, response) {
        this.log(`Request received: ${request.method.toUpperCase()} ${request.url}`);
        const resource = this.buildResource(request, response);
        await this.executeMiddlewareAfterResource(request, response);
        if (typeof resource[request.method.toUpperCase()] !== "function") {
            throw new Drash.Exceptions.HttpException(405);
        }
        this.log("Calling " + request.method.toUpperCase() + "().");
        response = await resource[request.method.toUpperCase()]();
        this.isValidResponse(request, response, resource);
        await this.executeMiddlewareAfterRequest(request, response);
        this.log("Sending response. " + response.status_code + ".");
        return response.send();
    }
    async handleHttpRequestForStaticPathAsset(request) {
        const response = this.buildResponse(request);
        try {
            response.headers.set("Content-Type", this.services.http_service.getMimeType(request.url, true) ||
                "text/plain");
            if (!this.configs.pretty_links || request.url.split(".")[1]) {
                try {
                    response.body = await Deno.readFile(`${this.configs.directory}/${request.url}`);
                    await this.executeMiddlewareAfterRequest(request, response);
                }
                catch (error) {
                    await this.executeMiddlewareAfterRequest(request, response);
                }
                if (response.body) {
                    return response.sendStatic();
                }
                throw new Error();
            }
            response.headers.set("Content-Type", "text/html");
            const path = `${this.configs.directory}${request.url}`;
            let contents = await Deno.readFile(`${path}/index.html`);
            if (!contents) {
                contents = await Deno.readFile(path);
            }
            response.body = contents;
            await this.executeMiddlewareAfterRequest(request, response);
            return response.sendStatic();
        }
        catch (error) {
            return await this.handleHttpRequestError(request, new Drash.Exceptions.HttpException(error.code ?? 404, error.message));
        }
    }
    async handleHttpRequestForVirtualPathAsset(request) {
        const response = this.buildResponse(request);
        try {
            response.headers.set("Content-Type", this.services.http_service.getMimeType(request.url, true) ||
                "text/plain");
            const virtualPath = request.url.split("/")[1];
            const physicalPath = this.virtual_paths.get("/" + virtualPath);
            const fullPath = `${await Deno.realPath(".")}/${physicalPath}${request.url.replace("/" + virtualPath, "")}`;
            response.body = await Deno.readFile(fullPath);
            await this.executeMiddlewareAfterRequest(request, response);
            return response.sendStatic();
        }
        catch (error) {
            return await this.handleHttpRequestError(request, new Drash.Exceptions.HttpException(error.code ?? 404, error.message));
        }
    }
    async run(options) {
        if (!options.hostname) {
            options.hostname = this.hostname;
        }
        if (!options.port) {
            options.port = this.port;
        }
        this.hostname = options.hostname;
        this.port = options.port;
        this.deno_server = serve(options);
        await this.listen();
        return this.deno_server;
    }
    async runTLS(options) {
        if (!options.hostname) {
            options.hostname = this.hostname;
        }
        if (!options.port) {
            options.port = this.port;
        }
        this.hostname = options.hostname;
        this.port = options.port;
        this.deno_server = serveTLS(options);
        await this.listen();
        return this.deno_server;
    }
    close() {
        this.deno_server.close();
        this.deno_server = null;
    }
    async addMiddleware() {
        if (!this.configs.middleware) {
            return;
        }
        const middlewares = this.configs.middleware;
        if (middlewares.before_request != null) {
            this.middleware.before_request = [];
            for (const middleware of middlewares.before_request) {
                this.middleware.before_request.push(middleware);
            }
        }
        if (middlewares.after_request != null) {
            this.middleware.after_request = [];
            for (const middleware of middlewares.after_request) {
                this.middleware.after_request.push(middleware);
            }
        }
        if (middlewares.after_resource != null) {
            this.middleware.after_resource = [];
            for (const middleware of middlewares.after_resource) {
                this.middleware.after_resource.push(middleware);
            }
        }
        if (middlewares.compile_time) {
            for (const middleware of middlewares.compile_time) {
                await middleware.compile();
                this.middleware.runtime.set(this.middleware.runtime.size, middleware.run);
            }
        }
    }
    addResource(resourceClass) {
        const resourceParsedPaths = [];
        for (let path of resourceClass.paths) {
            if (path.charAt(path.length - 1) == "/") {
                path = path.substring(-1, path.length - 1);
            }
            if (typeof path != "string") {
                throw new Drash.Exceptions.InvalidPathException(`Path '${path}' needs to be a string.`);
            }
            let paths;
            if (path.includes("*") == true) {
                paths = this.getResourcePathsUsingWildcard(path);
            }
            else if (path.includes("?") === true) {
                paths = this.getResourcePathsUsingOptionalParams(path);
            }
            else {
                paths = this.getResourcePaths(path);
            }
            resourceParsedPaths.push(paths);
            this.services.resource_index_service.addItem([paths.regex_path], resourceClass);
        }
        resourceClass.paths_parsed = resourceParsedPaths;
    }
    addResources() {
        if (!this.configs.resources) {
            return;
        }
        this.configs.resources.forEach((resourceClass) => {
            this.addResource(resourceClass);
        });
    }
    addStaticPath(path, virtualPath) {
        if (virtualPath) {
            this.virtual_paths.set(virtualPath, path);
            return;
        }
        this.static_paths.push(path);
    }
    addStaticPaths() {
        const paths = this.configs.static_paths;
        if (paths) {
            if (!this.configs.directory) {
                throw new Drash.Exceptions.ConfigsException(`Static paths are being used, but a directory config was not specified`);
            }
        }
        if (Array.isArray(paths)) {
            paths.forEach((path) => {
                if (typeof path != "string") {
                    throw new Drash.Exceptions.ConfigsException(`Static path must be a string`);
                }
                this.addStaticPath(path);
            });
            return;
        }
        for (const virtualPath in paths) {
            if (typeof virtualPath != "string") {
                throw new Drash.Exceptions.ConfigsException(`Virtual path must be a string`);
            }
            const physicalPath = paths[virtualPath];
            if (typeof physicalPath != "string") {
                throw new Drash.Exceptions.ConfigsException(`Virtual path must be a string`);
            }
            this.addStaticPath(physicalPath, virtualPath);
        }
    }
    buildConfigs(configs) {
        if (!configs.memory_allocation) {
            configs.memory_allocation = {};
        }
        return configs;
    }
    async buildRequest(serverRequest) {
        const options = {
            memory_allocation: {
                multipart_form_data: 10,
            },
        };
        const config = this.configs.memory_allocation;
        if (config && config.multipart_form_data) {
            options.memory_allocation.multipart_form_data =
                config.multipart_form_data;
        }
        const request = new Drash.Http.Request(serverRequest, options);
        await request.parseBody();
        return request;
    }
    buildResource(request, response) {
        let resourceClass = this.findResource(request);
        const resource = new resourceClass(request, response, this, resourceClass.paths, resourceClass.middleware);
        return resource;
    }
    buildResponse(request) {
        return new Drash.Http.Response(request, {
            default_content_type: this.configs.response_output,
        });
    }
    async executeMiddlewareAfterRequest(request, response = null) {
        if (this.middleware.runtime) {
            if (response) {
                await this.executeMiddlewareRuntime(request, response);
            }
        }
        if (this.middleware.after_request != null) {
            for (const middleware of this.middleware.after_request) {
                await middleware(request, response);
            }
        }
    }
    async executeMiddlewareAfterResource(request, response) {
        if (this.middleware.after_resource != null) {
            for (const middleware of this.middleware.after_resource) {
                await middleware(request, response);
            }
        }
    }
    async executeMiddlewareBeforeRequest(request) {
        if (this.middleware.before_request != null) {
            for (const middleware of this.middleware.before_request) {
                await middleware(request);
            }
        }
    }
    executeMiddlewareRuntime(request, response) {
        let processed = false;
        this.middleware.runtime.forEach(async (run) => {
            if (!processed) {
                await run(request, response);
                processed = true;
            }
        });
    }
    findResource(request) {
        let resource = undefined;
        const uri = request.url_path.split("/");
        uri.shift();
        const uriWithoutParams = "^/" + uri[0];
        let results = this.services.resource_index_service.search(uriWithoutParams);
        if (results.size === 0) {
            results = this.services.resource_index_service.search("^/");
            if (!results) {
                throw new Drash.Exceptions.HttpException(404);
            }
        }
        let matchedResource = false;
        results.forEach((result) => {
            if (matchedResource) {
                return;
            }
            const matchArray = request.url_path.match(result.search_term);
            if (matchArray) {
                matchedResource = true;
                resource = result.item;
                request.path_params = this.getRequestPathParams(resource, matchArray);
            }
        });
        if (!resource) {
            throw new Drash.Exceptions.HttpException(404);
        }
        return resource;
    }
    getRequestPathParams(resource, matchArray) {
        const pathParamsInKvpForm = {};
        if (!matchArray || (matchArray.length == 1)) {
            return pathParamsInKvpForm;
        }
        const params = matchArray.slice();
        params.shift();
        if (resource && resource.paths_parsed) {
            resource.paths_parsed.forEach((pathObj) => {
                pathObj.params.forEach((paramName, index) => {
                    pathParamsInKvpForm[paramName] = params[index];
                });
            });
        }
        return pathParamsInKvpForm;
    }
    getResourcePaths(path) {
        return {
            og_path: path,
            regex_path: `^${path.replace(Server.REGEX_URI_MATCHES, Server.REGEX_URI_REPLACEMENT)}/?$`,
            params: (path.match(Server.REGEX_URI_MATCHES) || []).map((element) => {
                return element.replace(/:|{|}/g, "");
            }),
        };
    }
    getResourcePathsUsingOptionalParams(path) {
        let tmpPath = path;
        const numberOfRequiredParams = path.split("/").filter((param) => {
            return (param.includes(":") || param.includes("{")) &&
                !param.includes("?");
        }).length;
        for (let i = 0; i < numberOfRequiredParams; i++) {
            tmpPath = tmpPath.replace(/(:[^(/]+|{[^0-9][^}]*})/, Server.REGEX_URI_REPLACEMENT);
        }
        const maxOptionalParams = path.split("/").filter((param) => {
            return param.includes("?");
        }).length;
        for (let i = 0; i < maxOptionalParams; i++) {
            if (i === 0) {
                tmpPath = tmpPath.replace(/\/(:[^(/]+|{[^0-9][^}]*}\?)\/?/, "/?([^/]+)?/?");
            }
            else {
                tmpPath = tmpPath.replace(/\/?(:[^(/]+|{[^0-9][^}]*}\?)\/?/, "([^/]+)?/?");
            }
        }
        return {
            og_path: path,
            regex_path: `^${tmpPath}$`,
            params: (path.match(Server.REGEX_URI_MATCHES) || []).map((element) => {
                return element.replace(/:|{|}|\?/g, "");
            }),
        };
    }
    getResourcePathsUsingWildcard(path) {
        return {
            og_path: path,
            regex_path: `^.${path.replace(Server.REGEX_URI_MATCHES, Server.REGEX_URI_REPLACEMENT)}/?$`,
            params: (path.match(Server.REGEX_URI_MATCHES) || []).map((element) => {
                return element.replace(/:|{|}/g, "");
            }),
        };
    }
    isValidResponse(request, response, resource) {
        function responseIsOfTypeResponseOutput(response) {
            if ((typeof response === "object") &&
                (Array.isArray(response) === false) &&
                (response !== null)) {
                return "status" in response &&
                    "headers" in response &&
                    "body" in response &&
                    "send" in response &&
                    "status_code" in response;
            }
            return false;
        }
        const valid = response instanceof Drash.Http.Response ||
            responseIsOfTypeResponseOutput(response) === true;
        if (!valid) {
            throw new Drash.Exceptions.HttpResponseException(418, `The response must be returned inside the ${request.method.toUpperCase()} method of the ${resource.constructor.name} class.`);
        }
        return true;
    }
    async listen() {
        (async () => {
            for await (const request of this.deno_server) {
                try {
                    this.handleHttpRequest(request);
                }
                catch (error) {
                    this.handleHttpRequestError(request, new Drash.Exceptions.HttpException(500));
                }
            }
        })();
    }
    log(message) {
        if (!this.configs.logger) {
            return;
        }
        this.configs.logger.debug("[syslog] " + message);
    }
    requestTargetsStaticPath(request) {
        if (this.static_paths.length <= 0) {
            return false;
        }
        const staticPath = request.url.split("/")[1];
        const requestUrl = `/${staticPath}`;
        if (this.static_paths.indexOf(requestUrl) == -1) {
            return false;
        }
        return true;
    }
    requestTargetsVirtualPath(serverRequest) {
        if (this.virtual_paths.size <= 0) {
            return false;
        }
        const virtualPath = serverRequest.url.split("/")[1];
        const requestUrl = `/${virtualPath}`;
        if (!this.virtual_paths.has(requestUrl)) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDckMsT0FBTyxFQUlMLFlBQVksRUFFWixLQUFLLEVBR0wsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBZXZCLE1BQU0sT0FBTyxNQUFNO0lBQ2pCLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RSxNQUFNLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO0lBVWxDLFdBQVcsR0FBc0IsSUFBSSxDQUFDO0lBS3RDLFFBQVEsR0FBVyxXQUFXLENBQUM7SUFLL0IsSUFBSSxHQUFXLElBQUksQ0FBQztJQUtqQixPQUFPLENBQWlDO0lBWXhDLFVBQVUsR0FBcUI7UUFDdkMsT0FBTyxFQUFFLElBQUksR0FBRyxFQU1iO0tBQ0osQ0FBQztJQUtRLFFBQVEsR0FBYztRQUM5QixZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUM5QyxzQkFBc0IsRUFBRSxJQUFJLFlBQVksQ0FDdEMsSUFBSSxHQUFHLEVBQXFDLENBQzdDO0tBQ0YsQ0FBQztJQVlRLFlBQVksR0FBeUMsRUFBRSxDQUFDO0lBV3hELGFBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFXekUsWUFBWSxPQUF1QztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQWFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FDNUIsYUFBNEI7UUFFNUIsTUFB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