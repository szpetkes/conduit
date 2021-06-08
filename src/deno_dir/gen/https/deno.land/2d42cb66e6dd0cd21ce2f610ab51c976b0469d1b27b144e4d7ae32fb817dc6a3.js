import { BufReader, ServerRequest } from "../../deps.ts";
export const MockServerRequestFn = function (url = "/", method = "get", options) {
    const request = new ServerRequest();
    request.url = url;
    request.method = method;
    request.headers = new Headers();
    if (options) {
        if (options.headers) {
            for (const key in options.headers) {
                request.headers.set(key, options.headers[key]);
            }
        }
        if (options.body) {
            request.headers.set("Content-Length", options.body.length.toString());
            request.r = new BufReader(options.body);
        }
    }
    return request;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3JlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXJfcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQW9DekQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsVUFDakMsR0FBRyxHQUFHLEdBQUcsRUFDVCxNQUFNLEdBQUcsS0FBSyxFQUNkLE9BQWtDO0lBRWxDLE1BQU0sT0FBTyxHQUFzQixJQUFJLGFBQWEsRUFBRSxDQUFDO0lBQ3ZELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUNoQyxJQUFJLE9BQU8sRUFBRTtRQUNYLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNuQixLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEQ7U0FDRjtRQUNELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNoQixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0tBQ0Y7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUMifQ==