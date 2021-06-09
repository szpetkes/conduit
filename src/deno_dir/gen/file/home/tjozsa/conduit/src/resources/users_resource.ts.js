import { bcrypt } from "../deps.ts";
import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import SessionModel from "../models/session_model.ts";
import ValidationService from "../services/validation_service.ts";
class RegisterResource extends BaseResource {
    static paths = [
        "/users",
    ];
    async POST() {
        const username = ValidationService.decodeInput(this.request.getBodyParam("username") || "");
        const email = ValidationService.decodeInput(this.request.getBodyParam("email") || "");
        const rawPassword = ValidationService.decodeInput(this.request.getBodyParam("password") || "");
        console.log("Creating the following user:");
        console.log(username, email, rawPassword);
        if (!username) {
            return this.errorResponse(422, "Username field required.");
        }
        if (!email) {
            return this.errorResponse(422, "Email field required.");
        }
        if (!rawPassword) {
            return this.errorResponse(422, "Password field required.");
        }
        if (!ValidationService.isEmail(email)) {
            return this.errorResponse(422, "Email must be a valid email.");
        }
        if (!(await ValidationService.isEmailUnique(email))) {
            return this.errorResponse(422, "Email already taken.");
        }
        if (!ValidationService.isPasswordStrong(rawPassword)) {
            return this.errorResponse(422, "Password must be 8 characters long and include 1 number, 1 " +
                "uppercase letter, and 1 lowercase letter.");
        }
        const User = new UserModel(username, await bcrypt.hash(rawPassword), email);
        const user = await User.save();
        if (!user) {
            return this.errorResponse(422, "An error occurred while trying to create your account.");
        }
        const entity = user.toEntity();
        const sessionOneValue = await bcrypt.hash("sessionOne2020Drash");
        const sessionTwoValue = await bcrypt.hash("sessionTwo2020Drash");
        const session = new SessionModel(sessionOneValue, sessionTwoValue, user.id);
        session.save();
        entity.token = `${sessionOneValue}|::|${sessionTwoValue}`;
        this.response.body = {
            user: entity,
        };
        return this.response;
    }
}
export default RegisterResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Vyc19yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHlCQUF5QixDQUFDO0FBQ2hELE9BQU8sWUFBWSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RELE9BQU8saUJBQWlCLE1BQU0sbUNBQW1DLENBQUM7QUFFbEUsTUFBTSxnQkFBaUIsU0FBUSxZQUFZO0lBQ3pDLE1BQU0sQ0FBQyxLQUFLLEdBQUc7UUFDYixRQUFRO0tBQ1QsQ0FBQztJQVdLLEtBQUssQ0FBQyxJQUFJO1FBRWYsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQVksSUFBSSxFQUFFLENBQ3hELENBQUM7UUFDRixNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBWSxJQUFJLEVBQUUsQ0FDckQsQ0FBQztRQUNGLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFZLElBQUksRUFBRSxDQUN4RCxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUcxQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUN6RDtRQUNELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLENBQUMsQ0FBQyxNQUFNLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ25ELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNwRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQ3ZCLEdBQUcsRUFDSCw2REFBNkQ7Z0JBQzNELDJDQUEyQyxDQUM5QyxDQUFDO1NBQ0g7UUFHRCxNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FDeEIsUUFBUSxFQUNSLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFDOUIsS0FBSyxDQUNOLENBQUM7UUFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUvQixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUN2QixHQUFHLEVBQ0gsd0RBQXdELENBQ3pELENBQUM7U0FDSDtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUsvQixNQUFNLGVBQWUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqRSxNQUFNLGVBQWUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqRSxNQUFNLE9BQU8sR0FBRyxJQUFJLFlBQVksQ0FDOUIsZUFBZSxFQUNmLGVBQWUsRUFDZixJQUFJLENBQUMsRUFBRSxDQUNSLENBQUM7UUFDRixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsZUFBZSxPQUFPLGVBQWUsRUFBRSxDQUFDO1FBRzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHO1lBQ25CLElBQUksRUFBRSxNQUFNO1NBQ2IsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDOztBQUdILGVBQWUsZ0JBQWdCLENBQUMifQ==