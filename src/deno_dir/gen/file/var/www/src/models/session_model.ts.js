import BaseModel from "./base_model.ts";
function createSessionModel(session) {
    return new SessionModel(session.session_one, session.session_two, session.user_id, session.id);
}
export class SessionModel extends BaseModel {
    id;
    user_id;
    session_one;
    session_two;
    constructor(sessionOne, sessionTwo, userId, id = -1) {
        super();
        this.session_one = sessionOne;
        this.session_two = sessionTwo;
        this.user_id = userId;
        this.id = id;
    }
    static async getUserSession(sessionOne, sessionTwo) {
        const query = "SELECT * FROM sessions " +
            `WHERE session_one = $1 AND session_two = $2 ` +
            "LIMIT 1;";
        const dbResult = await BaseModel.query(query, sessionOne, sessionTwo);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const session = dbResult.rows[0];
        if (session) {
            const sessionEntity = {
                "session_one": typeof session.session_one === "string"
                    ? session.session_one
                    : "",
                "session_two": typeof session.session_two === "string"
                    ? session.session_two
                    : "",
                id: typeof session.id === "number" ? session.id : 0,
                "user_id": typeof session.user_id === "number" ? session.user_id : 0,
            };
            return createSessionModel(sessionEntity);
        }
        return null;
    }
    async save() {
        if (this.id != -1) {
            throw new Error("Session record already exists.");
        }
        const query = "INSERT INTO sessions" +
            " (user_id, session_one, session_two)" +
            " VALUES ($1, $2, $3);";
        const dbResult = await BaseModel.query(query, this.user_id, this.session_one, this.session_two);
        if (dbResult.rowCount < 1) {
            return null;
        }
        return await SessionModel.getUserSession(this.session_one, this.session_two);
    }
}
export default SessionModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbl9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlc3Npb25fbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFvQnhDLFNBQVMsa0JBQWtCLENBQUMsT0FBMkI7SUFDckQsT0FBTyxJQUFJLFlBQVksQ0FDckIsT0FBTyxDQUFDLFdBQVcsRUFDbkIsT0FBTyxDQUFDLFdBQVcsRUFDbkIsT0FBTyxDQUFDLE9BQU8sRUFDZixPQUFPLENBQUMsRUFBRSxDQUNYLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxPQUFPLFlBQWEsU0FBUSxTQUFTO0lBVWxDLEVBQUUsQ0FBUztJQU9YLE9BQU8sQ0FBUztJQU9oQixXQUFXLENBQVM7SUFPcEIsV0FBVyxDQUFTO0lBYzNCLFlBQ0UsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsTUFBYyxFQUNkLEtBQWEsQ0FBQyxDQUFDO1FBRWYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFnQkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQ3pCLFVBQWtCLEVBQ2xCLFVBQWtCO1FBRWxCLE1BQU0sS0FBSyxHQUFHLHlCQUF5QjtZQUNyQyw4Q0FBOEM7WUFDOUMsVUFBVSxDQUFDO1FBQ2IsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEUsSUFBSSxRQUFRLENBQUMsUUFBUyxHQUFHLENBQUMsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLE9BQU8sRUFBRTtZQUdYLE1BQU0sYUFBYSxHQUF1QjtnQkFDeEMsYUFBYSxFQUFFLE9BQU8sT0FBTyxDQUFDLFdBQVcsS0FBSyxRQUFRO29CQUNwRCxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVc7b0JBQ3JCLENBQUMsQ0FBQyxFQUFFO2dCQUNOLGFBQWEsRUFBRSxPQUFPLE9BQU8sQ0FBQyxXQUFXLEtBQUssUUFBUTtvQkFDcEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXO29CQUNyQixDQUFDLENBQUMsRUFBRTtnQkFDTixFQUFFLEVBQUUsT0FBTyxPQUFPLENBQUMsRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsU0FBUyxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckUsQ0FBQztZQUNGLE9BQU8sa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFXTSxLQUFLLENBQUMsSUFBSTtRQUNmLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDbkQ7UUFFRCxNQUFNLEtBQUssR0FBRyxzQkFBc0I7WUFDbEMsc0NBQXNDO1lBQ3RDLHVCQUF1QixDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FDcEMsS0FBSyxFQUNMLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFdBQVcsRUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FDakIsQ0FBQztRQUNGLElBQUksUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUlELE9BQU8sTUFBTSxZQUFZLENBQUMsY0FBYyxDQUN0QyxJQUFJLENBQUMsV0FBVyxFQUNoQixJQUFJLENBQUMsV0FBVyxDQUNqQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsZUFBZSxZQUFZLENBQUMifQ==