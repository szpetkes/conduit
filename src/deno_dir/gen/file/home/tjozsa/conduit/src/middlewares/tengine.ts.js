import { Tengine } from "../deps.ts";
export const tengine = Tengine({
    render: (..._args) => {
        console.log("tengine is being called");
        return false;
    },
    views_path: "./public/views",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVyQyxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEdBQUcsS0FBZ0IsRUFBVyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUN2QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxVQUFVLEVBQUUsZ0JBQWdCO0NBQzdCLENBQUMsQ0FBQyJ9