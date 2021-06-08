import UserModel from "../models/user_model.ts";
import SessionModel from "../models/session_model.ts";
export default class UserService {
    static async getLoggedInUser(cookieValue) {
        const sessionCookie = cookieValue;
        if (!sessionCookie) {
            return false;
        }
        const sessionOne = sessionCookie.split("|::|")[0];
        const sessionTwo = sessionCookie.split("|::|")[1];
        const session = await SessionModel.getUserSession(sessionOne, sessionTwo);
        if (!session) {
            return false;
        }
        const userId = session.user_id;
        const user = await UserModel.where({ id: userId });
        if (!user.length) {
            return false;
        }
        return user[0];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlcl9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxNQUFNLHlCQUF5QixDQUFDO0FBQ2hELE9BQU8sWUFBWSxNQUFNLDRCQUE0QixDQUFDO0FBRXRELE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBVztJQWM5QixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FDMUIsV0FBbUI7UUFFbkIsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixNQUFNLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQztDQUNGIn0=