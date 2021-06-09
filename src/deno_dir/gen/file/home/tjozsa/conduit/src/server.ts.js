import { Drash } from "./deps.ts";
import ArticleCommentsResource from "./resources/article_comments_resource.ts";
import ArticlesResource from "./resources/articles_resource.ts";
import HomeResource from "./resources/home_resource.ts";
import ProfilesResource from "./resources/profiles_resource.ts";
import TagsResource from "./resources/tags_resource.ts";
import UserResource from "./resources/user_resource.ts";
import UsersLoginResource from "./resources/users_login_resource.ts";
import UsersResource from "./resources/users_resource.ts";
export const server = new Drash.Http.Server({
    directory: ".",
    response_output: "application/json",
    resources: [
        ArticleCommentsResource,
        ArticlesResource,
        HomeResource,
        ProfilesResource,
        TagsResource,
        UserResource,
        UsersLoginResource,
        UsersResource,
    ],
    static_paths: ["/public"],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyx1QkFBdUIsTUFBTSwwQ0FBMEMsQ0FBQztBQUMvRSxPQUFPLGdCQUFnQixNQUFNLGtDQUFrQyxDQUFDO0FBQ2hFLE9BQU8sWUFBWSxNQUFNLDhCQUE4QixDQUFDO0FBQ3hELE9BQU8sZ0JBQWdCLE1BQU0sa0NBQWtDLENBQUM7QUFDaEUsT0FBTyxZQUFZLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxZQUFZLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxrQkFBa0IsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLGFBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUUxRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQyxTQUFTLEVBQUUsR0FBRztJQUNkLGVBQWUsRUFBRSxrQkFBa0I7SUFDbkMsU0FBUyxFQUFFO1FBQ1QsdUJBQXVCO1FBQ3ZCLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLFlBQVk7UUFDWixZQUFZO1FBQ1osa0JBQWtCO1FBQ2xCLGFBQWE7S0FDZDtJQUNELFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztDQUMxQixDQUFDLENBQUMifQ==