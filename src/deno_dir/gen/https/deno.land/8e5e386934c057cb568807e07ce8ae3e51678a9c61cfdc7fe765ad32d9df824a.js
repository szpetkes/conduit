export function Middleware(middlewares) {
    return function (...args) {
        switch (args.length) {
            case 1:
                return ClassMiddleware(middlewares).apply(this, args);
            case 2:
                break;
            case 3:
                if (typeof args[2] == "number") {
                    break;
                }
                return MethodMiddleware(middlewares).apply(this, args);
            default:
                throw new Error("Not a valid decorator");
        }
    };
}
function MethodMiddleware(middlewares) {
    return function (target, propertyKey, descriptor) {
        const originalFunction = descriptor.value;
        descriptor.value = async function (...args) {
            const { request, response } = Object.getOwnPropertyDescriptors(this);
            if (middlewares.before_request != null) {
                for (const middleware of middlewares.before_request) {
                    await middleware(request.value, response.value);
                }
            }
            const result = originalFunction.apply(this, args);
            if (middlewares.after_request != null) {
                for (const middleware of middlewares.after_request) {
                    await middleware(request.value, result);
                }
            }
            return result;
        };
        return descriptor;
    };
}
function ClassMiddleware(middlewares) {
    return function (constr) {
        const classFunctions = Object.getOwnPropertyDescriptors(constr.prototype);
        for (const key in classFunctions) {
            if (key == "constructor") {
                continue;
            }
            const originalFunction = classFunctions[key].value;
            classFunctions[key].value = async function (...args) {
                const { request, response } = Object.getOwnPropertyDescriptors(this);
                if (middlewares.before_request != null) {
                    for (const middleware of middlewares.before_request) {
                        await middleware(request.value, response.value);
                    }
                }
                const result = originalFunction.apply(this, args);
                if (middlewares.after_request != null) {
                    for (const middleware of middlewares.after_request) {
                        await middleware(request.value, result);
                    }
                }
                return result;
            };
            Object.defineProperty(constr.prototype, key, classFunctions[key]);
        }
        return constr;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0NBLE1BQU0sVUFBVSxVQUFVLENBQUMsV0FBMkI7SUFDcEQsT0FBTyxVQUFVLEdBQUcsSUFBZTtRQUNqQyxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbkIsS0FBSyxDQUFDO2dCQUdKLE9BQU8sZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDO2dCQUVKLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUU7b0JBRTlCLE1BQU07aUJBQ1A7Z0JBRUQsT0FBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pEO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFPRCxTQUFTLGdCQUFnQixDQUN2QixXQUEyQjtJQU0zQixPQUFPLFVBQ0wsTUFBMkIsRUFDM0IsV0FBbUIsRUFDbkIsVUFBOEI7UUFFOUIsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQzFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxXQUFXLEdBQUcsSUFBZTtZQUNuRCxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVyRSxJQUFJLFdBQVcsQ0FBQyxjQUFjLElBQUksSUFBSSxFQUFFO2dCQUN0QyxLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsQ0FBQyxjQUFjLEVBQUU7b0JBQ25ELE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqRDthQUNGO1lBR0QsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUdsRCxJQUFJLFdBQVcsQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO2dCQUNyQyxLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsQ0FBQyxhQUFhLEVBQUU7b0JBQ2xELE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ3pDO2FBQ0Y7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFRixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDLENBQUM7QUFDSixDQUFDO0FBT0QsU0FBUyxlQUFlLENBQUMsV0FBMkI7SUFDbEQsT0FBTyxVQUFzRCxNQUFTO1FBQ3BFLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUUsS0FBSyxNQUFNLEdBQUcsSUFBSSxjQUFjLEVBQUU7WUFDaEMsSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFO2dCQUN4QixTQUFTO2FBQ1Y7WUFFRCxNQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDbkQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLFdBQVcsR0FBRyxJQUFlO2dCQUM1RCxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFckUsSUFBSSxXQUFXLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRTtvQkFDdEMsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLENBQUMsY0FBYyxFQUFFO3dCQUNuRCxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDakQ7aUJBQ0Y7Z0JBR0QsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFHbEQsSUFBSSxXQUFXLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtvQkFDckMsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLENBQUMsYUFBYSxFQUFFO3dCQUNsRCxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUN6QztpQkFDRjtnQkFDRCxPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyJ9