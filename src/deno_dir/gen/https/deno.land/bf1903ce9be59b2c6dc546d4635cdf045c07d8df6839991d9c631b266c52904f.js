import { Jae } from "./jae.ts";
export function Tengine(options) {
    let templateEngine;
    function tengine(request, response) {
        response.headers.set("Content-Type", "text/html");
        if (options.views_path) {
            if (!templateEngine) {
                templateEngine = new Jae(options.views_path);
            }
            options.render = (...args) => {
                return templateEngine.render(args[0], args[1]);
            };
        }
        if (response.render) {
            response.render = options.render;
            return;
        }
    }
    return tengine;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFRL0IsTUFBTSxVQUFVLE9BQU8sQ0FDckIsT0FBaUI7SUFFakIsSUFBSSxjQUFtQixDQUFDO0lBUXhCLFNBQVMsT0FBTyxDQUNkLE9BQTJCLEVBQzNCLFFBQTZCO1FBRzdCLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVsRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM5QztZQUNELE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQWUsRUFBVSxFQUFFO2dCQUM5QyxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQzFCLElBQUksQ0FBQyxDQUFDLENBQVcsRUFDakIsSUFBSSxDQUFDLENBQUMsQ0FBWSxDQUNuQixDQUFDO1lBQ0osQ0FBQyxDQUFDO1NBQ0g7UUFFRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDbkIsUUFBUSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2pDLE9BQU87U0FDUjtJQUNILENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIn0=