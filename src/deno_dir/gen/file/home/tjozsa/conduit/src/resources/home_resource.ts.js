var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Drash } from "../deps.ts";
import BaseResource from "./base_resource.ts";
import { tengine } from "../middlewares/tengine.ts";
class HomeResource extends BaseResource {
    static paths = [
        "/",
    ];
    GET() {
        this.response.headers.set("Content-Type", "text/html");
        this.response.body = this.response.render("/index.html", { title: "Conduit" });
        return this.response;
    }
}
__decorate([
    Drash.Http.Middleware({
        before_request: [tengine],
        after_request: [],
    })
], HomeResource.prototype, "GET", null);
export default HomeResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZV9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvbWVfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFcEQsTUFBTSxZQUFhLFNBQVEsWUFBWTtJQUNyQyxNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ2IsR0FBRztLQUNKLENBQUM7SUFNSyxHQUFHO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDdkMsYUFBYSxFQUNiLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUNyQixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7O0FBUEQ7SUFKQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNyQixjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDekIsYUFBYSxFQUFFLEVBQUU7S0FDbEIsQ0FBQzt1Q0FRRDtBQUdILGVBQWUsWUFBWSxDQUFDIn0=