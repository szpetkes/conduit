import { Middleware as MiddlewareHandler, } from "./src/http/middleware.ts";
import * as log_levels from "./src/dictionaries/log_levels.ts";
import { mime_db } from "./src/dictionaries/mime_db.ts";
import { ConfigsException as BaseConfigsException } from "./src/exceptions/configs_exception.ts";
import { HttpException as BaseHttpException } from "./src/exceptions/http_exception.ts";
import { InvalidPathException as BaseInvalidPathException } from "./src/exceptions/invalid_path_exception.ts";
import { HttpMiddlewareException as BaseHttpMiddlewareException } from "./src/exceptions/http_middleware_exception.ts";
import { HttpResponseException as BaseHttpResponseException } from "./src/exceptions/http_response_exception.ts";
import { NameCollisionException as BaseNameCollisionException } from "./src/exceptions/name_collision_exception.ts";
import { Request as BaseRequest } from "./src/http/request.ts";
import { Resource as BaseResource } from "./src/http/resource.ts";
import { Response as BaseResponse } from "./src/http/response.ts";
import { Server as BaseServer } from "./src/http/server.ts";
import { Logger as BaseLogger } from "./src/core_loggers/logger.ts";
import { ConsoleLogger as BaseConsoleLogger } from "./src/core_loggers/console_logger.ts";
import { FileLogger as BaseFileLogger } from "./src/core_loggers/file_logger.ts";
import { HttpService as BaseHttpService } from "./src/services/http_service.ts";
import { StringService as BaseStringService } from "./src/services/string_service.ts";
export var Drash;
(function (Drash) {
    Drash.version = "v1.4.4";
    let Dictionaries;
    (function (Dictionaries) {
        Dictionaries.LogLevels = log_levels.LogLevels;
        Dictionaries.MimeDb = mime_db;
    })(Dictionaries = Drash.Dictionaries || (Drash.Dictionaries = {}));
    let Exceptions;
    (function (Exceptions) {
        class ConfigsException extends BaseConfigsException {
        }
        Exceptions.ConfigsException = ConfigsException;
        class HttpException extends BaseHttpException {
        }
        Exceptions.HttpException = HttpException;
        class HttpMiddlewareException extends BaseHttpMiddlewareException {
        }
        Exceptions.HttpMiddlewareException = HttpMiddlewareException;
        class HttpResponseException extends BaseHttpResponseException {
        }
        Exceptions.HttpResponseException = HttpResponseException;
        class InvalidPathException extends BaseInvalidPathException {
        }
        Exceptions.InvalidPathException = InvalidPathException;
        class NameCollisionException extends BaseNameCollisionException {
        }
        Exceptions.NameCollisionException = NameCollisionException;
    })(Exceptions = Drash.Exceptions || (Drash.Exceptions = {}));
    let CoreLoggers;
    (function (CoreLoggers) {
        class ConsoleLogger extends BaseConsoleLogger {
        }
        CoreLoggers.ConsoleLogger = ConsoleLogger;
        class FileLogger extends BaseFileLogger {
        }
        CoreLoggers.FileLogger = FileLogger;
        class Logger extends BaseLogger {
        }
        CoreLoggers.Logger = Logger;
    })(CoreLoggers = Drash.CoreLoggers || (Drash.CoreLoggers = {}));
    let Http;
    (function (Http) {
        Http.Middleware = MiddlewareHandler;
        class Resource extends BaseResource {
        }
        Http.Resource = Resource;
        class Request extends BaseRequest {
        }
        Http.Request = Request;
        class Response extends BaseResponse {
        }
        Http.Response = Response;
        class Server extends BaseServer {
        }
        Http.Server = Server;
    })(Http = Drash.Http || (Drash.Http = {}));
    let Services;
    (function (Services) {
        class HttpService extends BaseHttpService {
        }
        Services.HttpService = HttpService;
        class StringService extends BaseStringService {
        }
        Services.StringService = StringService;
    })(Services = Drash.Services || (Drash.Services = {}));
    Drash.Loggers = {};
    Drash.Members = {};
    function addMember(name, member) {
        if (Drash.Members[name]) {
            throw new Exceptions.NameCollisionException(`Members must be unique: "${name}" was already added.`);
        }
        Drash.Members[name] = member;
    }
    Drash.addMember = addMember;
    function addLogger(name, logger) {
        if (Drash.Loggers[name]) {
            throw new Exceptions.NameCollisionException(`Loggers must be unique: "${name}" was already added.`);
        }
        Drash.Loggers[name] = logger;
    }
    Drash.addLogger = addLogger;
})(Drash || (Drash = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFDTCxVQUFVLElBQUksaUJBQWlCLEdBR2hDLE1BQU0sMEJBQTBCLENBQUM7QUFHbEMsT0FBTyxLQUFLLFVBQVUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHeEQsT0FBTyxFQUFFLGdCQUFnQixJQUFJLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakcsT0FBTyxFQUFFLGFBQWEsSUFBSSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxvQkFBb0IsSUFBSSx3QkFBd0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzlHLE9BQU8sRUFBRSx1QkFBdUIsSUFBSSwyQkFBMkIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxxQkFBcUIsSUFBSSx5QkFBeUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pILE9BQU8sRUFBRSxzQkFBc0IsSUFBSSwwQkFBMEIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBSXBILE9BQU8sRUFBRSxPQUFPLElBQUksV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFFBQVEsSUFBSSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsUUFBUSxJQUFJLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxNQUFNLElBQUksVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFhNUQsT0FBTyxFQUFFLE1BQU0sSUFBSSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsYUFBYSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDMUYsT0FBTyxFQUFF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