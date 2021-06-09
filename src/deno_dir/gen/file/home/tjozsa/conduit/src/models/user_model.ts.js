import BaseModel from "./base_model.ts";
export function createUserModelObject(user) {
    return new UserModel(user.username, user.password, user.email, user.bio, user.image, user.id);
}
export class UserModel extends BaseModel {
    bio;
    email;
    id;
    image;
    password;
    username;
    constructor(username, password, email, bio = "", image = "https://static.productionready.io/images/smiley-cyrus.jpg", id = -1) {
        super();
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.bio = bio;
        this.image = image;
    }
    async delete() {
        const query = `DELETE FROM users WHERE id = $1`;
        const dbResult = await BaseModel.query(query, this.id);
        if (dbResult.rowCount < 1) {
            return false;
        }
        return true;
    }
    async save() {
        if (this.id != -1) {
            return this.update();
        }
        const query = "INSERT INTO users (username, email, password, bio, image) VALUES ($1, $2, $3, $4, $5);";
        const dbResult = await BaseModel.query(query, this.username, this.email, this.password, this.bio, this.image);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const savedResult = await UserModel.where({ email: this.email });
        if (savedResult.length === 0) {
            return null;
        }
        return savedResult[0];
    }
    async update() {
        const query = "UPDATE users SET " +
            "username = $1, password = $2, email = $3, bio = $4, image = $5 " +
            `WHERE id = $6;`;
        const dbResult = await BaseModel.query(query, this.username, this.password, this.email, this.bio, this.image, this.id);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const updatedResult = await UserModel.where({ email: this.email });
        if (updatedResult.length === 0) {
            return null;
        }
        return updatedResult[0];
    }
    static async where(fields) {
        const results = await BaseModel.Where("users", fields);
        if (results.length <= 0) {
            return [];
        }
        return results.map((result) => {
            return createUserModelObject(result);
        });
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("users", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        return results.map((result) => {
            return createUserModelObject(result);
        });
    }
    toEntity() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            bio: this.bio,
            image: this.image,
            token: null,
        };
    }
}
export default UserModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXJfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUEwQnhDLE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxJQU9yQztJQUNDLE9BQU8sSUFBSSxTQUFTLENBQ2xCLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsRUFBRSxDQUNSLENBQUM7QUFDSixDQUFDO0FBSUQsTUFBTSxPQUFPLFNBQVUsU0FBUSxTQUFTO0lBVS9CLEdBQUcsQ0FBUztJQU9aLEtBQUssQ0FBUztJQU9kLEVBQUUsQ0FBUztJQU9YLEtBQUssQ0FBUztJQU9kLFFBQVEsQ0FBUztJQU9qQixRQUFRLENBQVM7SUFjeEIsWUFDRSxRQUFnQixFQUNoQixRQUFnQixFQUNoQixLQUFhLEVBQ2IsTUFBYyxFQUFFLEVBQ2hCLFFBQWdCLDJEQUEyRCxFQUMzRSxLQUFhLENBQUMsQ0FBQztRQUVmLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFXTSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLEtBQUssR0FBRyxpQ0FBaUMsQ0FBQztRQUNoRCxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLFFBQVEsQ0FBQyxRQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFPTSxLQUFLLENBQUMsSUFBSTtRQUVmLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN0QjtRQUVELE1BQU0sS0FBSyxHQUNULHdGQUF3RixDQUFDO1FBQzNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FDcEMsS0FBSyxFQUNMLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLEtBQUssQ0FDWCxDQUFDO1FBQ0YsSUFBSSxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQztTQUNiO1FBR0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFPTSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLEtBQUssR0FBRyxtQkFBbUI7WUFDL0IsaUVBQWlFO1lBQ2pFLGdCQUFnQixDQUFDO1FBQ25CLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FDcEMsS0FBSyxFQUNMLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsRUFBRSxDQUNSLENBQUM7UUFDRixJQUFJLFFBQVEsQ0FBQyxRQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbkUsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQWNELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUNoQixNQUEwQztRQUUxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZELElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUlELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzVCLE9BQU8scUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBV0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ2xCLE1BQWMsRUFDZCxNQUEyQjtRQUUzQixNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQy9DLE1BQU07WUFDTixNQUFNO1NBQ1AsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBSUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDNUIsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFTTSxRQUFRO1FBQ2IsT0FBTztZQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELGVBQWUsU0FBUyxDQUFDIn0=