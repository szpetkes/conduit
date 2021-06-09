import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
class ProfilesResource extends BaseResource {
    static paths = [
        "/profiles/:username",
    ];
    async GET() {
        console.log("Handling ProfilesResource GET.");
        const username = this.request.getPathParam("username") || "";
        console.log(`Handling the following user's profile: ${username}.`);
        if (!username) {
            this.response.status_code = 422;
            this.response.body = {
                errors: {
                    username: ["Username path param is required."],
                },
            };
        }
        this.response.body = {
            profile: null,
        };
        const result = await UserModel.where({ username: username });
        if (result.length <= 0) {
            return this.errorResponse(404, "Profile not found.");
        }
        const entity = result[0].toEntity();
        this.response.body = {
            profile: entity,
        };
        return this.response;
    }
}
export default ProfilesResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZXNfcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxlc19yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLFNBQVMsTUFBTSx5QkFBeUIsQ0FBQztBQUVoRCxNQUFNLGdCQUFpQixTQUFRLFlBQVk7SUFDekMsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLHFCQUFxQjtLQUN0QixDQUFDO0lBRUssS0FBSyxDQUFDLEdBQUc7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRztnQkFDbkIsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxDQUFDLGtDQUFrQyxDQUFDO2lCQUMvQzthQUNGLENBQUM7U0FFSDtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHO1lBQ25CLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzdELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3REO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHO1lBQ25CLE9BQU8sRUFBRSxNQUFNO1NBQ2hCLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7QUFHSCxlQUFlLGdCQUFnQixDQUFDIn0=