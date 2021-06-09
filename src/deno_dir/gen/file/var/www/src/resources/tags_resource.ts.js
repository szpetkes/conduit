import BaseResource from "./base_resource.ts";
import { ArticleModel, } from "../models/article_model.ts";
class TagsResource extends BaseResource {
    static paths = [
        "/tags",
        "/tags/:id",
    ];
    async GET() {
        var allTags = new Set();
        const tags = await ArticleModel.allTags();
        tags.forEach((tagList) => {
            tagList.split(',').forEach((tag) => {
                allTags.add(tag);
            });
        });
        this.response.body = Array.from(allTags);
        return this.response;
    }
}
export default TagsResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnc19yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZ3NfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sb0JBQW9CLENBQUM7QUFFOUMsT0FBTyxFQUVMLFlBQVksR0FFYixNQUFNLDRCQUE0QixDQUFDO0FBRXBDLE1BQU0sWUFBYSxTQUFRLFlBQVk7SUFDckMsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLE9BQU87UUFDUCxXQUFXO0tBQ1osQ0FBQztJQUVLLEtBQUssQ0FBQyxHQUFHO1FBQ2QsSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN4QixNQUFNLElBQUksR0FBRyxNQUFNLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBZSxFQUFFLEVBQUU7WUFFL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtnQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7QUFJSCxlQUFlLFlBQVksQ0FBQyJ9