export class Resource {
    middleware = {};
    name = "";
    paths = [];
    paths_parsed = [];
    request;
    response;
    server;
    constructor(request, response, server, paths, middleware) {
        this.request = request;
        this.response = response;
        this.server = server;
        this.paths = paths;
        this.middleware = middleware;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLE9BQU8sUUFBUTtJQUlaLFVBQVUsR0FBZ0QsRUFBRSxDQUFDO0lBTzdELElBQUksR0FBVyxFQUFFLENBQUM7SUFRbEIsS0FBSyxHQUFhLEVBQUUsQ0FBQztJQVdyQixZQUFZLEdBQXFDLEVBQUUsQ0FBQztJQUtqRCxPQUFPLENBQXFCO0lBSzVCLFFBQVEsQ0FBc0I7SUFLOUIsTUFBTSxDQUFvQjtJQWVwQyxZQUNFLE9BQTJCLEVBQzNCLFFBQTZCLEVBQzdCLE1BQXlCLEVBQ3pCLEtBQWUsRUFDZixVQUF1RDtRQUV2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0NBQ0YifQ==