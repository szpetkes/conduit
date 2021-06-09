import BaseResource from "./base_resource.ts";
class TagsResource extends BaseResource {
    static paths = [
        "/tags",
        "/tags/:id",
    ];
    GET() {
        this.response.body = [];
        return this.response;
    }
}
export default TagsResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnc19yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZ3NfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sb0JBQW9CLENBQUM7QUFFOUMsTUFBTSxZQUFhLFNBQVEsWUFBWTtJQUNyQyxNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ2IsT0FBTztRQUNQLFdBQVc7S0FDWixDQUFDO0lBRUssR0FBRztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7QUFHSCxlQUFlLFlBQVksQ0FBQyJ9