import { bcrypt } from "../deps.ts";
import UserModel from "../models/user_model.ts";
export default class ValidationService {
    static decodeInput(input) {
        if ((typeof input) !== "string") {
            return input;
        }
        return decodeURIComponent(input);
    }
    static isEmail(email) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        return emailRegex.test(email);
    }
    static async isEmailUnique(email) {
        const user = await UserModel.where({ email: email });
        if (user.length) {
            return false;
        }
        return true;
    }
    static async isPasswordCorrect(passwordOne, passwordTwo) {
        return await bcrypt.compare(passwordOne, passwordTwo);
    }
    static isPasswordStrong(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbl9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdGlvbl9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxTQUFTLE1BQU0seUJBQXlCLENBQUM7QUFFaEQsTUFBTSxDQUFDLE9BQU8sT0FBTyxpQkFBaUI7SUFZcEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFhO1FBQzlCLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUMvQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBY0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFhO1FBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUMzQix3SEFBd0gsQ0FDekgsQ0FBQztRQUNGLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBWUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBYTtRQUN0QyxNQUFNLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBYUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FDNUIsV0FBbUIsRUFDbkIsV0FBbUI7UUFFbkIsT0FBTyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFtQkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQWdCO1FBQ3RDLE9BQU8sc0NBQXNDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDRiJ9