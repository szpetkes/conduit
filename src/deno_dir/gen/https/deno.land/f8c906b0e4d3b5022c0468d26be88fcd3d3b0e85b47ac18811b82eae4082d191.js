export class MockBuilder {
    properties = [];
    functions = [];
    constructor_fn;
    constructor_args = [];
    constructor(constructorFn) {
        this.constructor_fn = constructorFn;
    }
    create() {
        const mock = {
            calls: {},
            is_mock: true,
        };
        const original = new this.constructor_fn(...this.constructor_args);
        this.getAllProperties(original).forEach((property) => {
            const desc = Object.getOwnPropertyDescriptor(original, property);
            mock[property] = desc.value;
        });
        this.getAllFunctions(original).forEach((method) => {
            const nativeMethods = [
                "__defineGetter__",
                "__defineSetter__",
                "__lookupGetter__",
                "__lookupSetter__",
                "constructor",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toString",
                "valueOf",
            ];
            if (nativeMethods.indexOf(method) == -1) {
                if (!mock.calls[method]) {
                    mock.calls[method] = 0;
                }
                mock[method] = function () {
                    mock.calls[method]++;
                    return original[method]();
                };
            }
            else {
                mock[method] = original[method];
            }
        });
        return mock;
    }
    withConstructorArgs(...args) {
        this.constructor_args = args;
        return this;
    }
    getAllProperties(obj) {
        let functions = [];
        let clone = obj;
        do {
            functions = functions.concat(Object.getOwnPropertyNames(clone));
        } while ((clone = Object.getPrototypeOf(clone)));
        return functions.sort().filter(function (e, i, arr) {
            if (e != arr[i + 1] && typeof obj[e] != "function") {
                return true;
            }
        });
    }
    getAllFunctions(obj) {
        let functions = [];
        let clone = obj;
        do {
            functions = functions.concat(Object.getOwnPropertyNames(clone));
        } while ((clone = Object.getPrototypeOf(clone)));
        return functions.sort().filter(function (e, i, arr) {
            if (e != arr[i + 1] && typeof obj[e] == "function") {
                return true;
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9ja19idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxXQUFXO0lBSVosVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUsxQixTQUFTLEdBQWEsRUFBRSxDQUFDO0lBS3pCLGNBQWMsQ0FBaUI7SUFLL0IsZ0JBQWdCLEdBQWMsRUFBRSxDQUFDO0lBVzNDLFlBQVksYUFBNkI7UUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDdEMsQ0FBQztJQVdNLE1BQU07UUFFWCxNQUFNLElBQUksR0FBZ0I7WUFDeEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUduRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1lBQzNELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFHSCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBQ3hELE1BQU0sYUFBYSxHQUFHO2dCQUNwQixrQkFBa0I7Z0JBQ2xCLGtCQUFrQjtnQkFDbEIsa0JBQWtCO2dCQUNsQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2IsZ0JBQWdCO2dCQUNoQixlQUFlO2dCQUNmLHNCQUFzQjtnQkFDdEIsZ0JBQWdCO2dCQUNoQixVQUFVO2dCQUNWLFNBQVM7YUFDVixDQUFDO1lBRUYsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hCO2dCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7b0JBQ3JCLE9BQVEsUUFBUSxDQUFDLE1BQWlCLENBRXJCLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDO2FBQ0g7aUJBQU07Z0JBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFpQixDQUFDLENBQUM7YUFDNUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVdNLG1CQUFtQixDQUFDLEdBQUcsSUFBZTtRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQWNTLGdCQUFnQixDQUFDLEdBQU07UUFDL0IsSUFBSSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQzdCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNoQixHQUFHO1lBQ0QsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDakUsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFFakQsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUM1QixVQUFVLENBQVMsRUFBRSxDQUFTLEVBQUUsR0FBYztZQUM1QyxJQUNFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQVksQ0FBQyxJQUFJLFVBQVUsRUFDekQ7Z0JBQ0EsT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNILENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQVVTLGVBQWUsQ0FBQyxHQUFNO1FBQzlCLElBQUksU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUM3QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDaEIsR0FBRztZQUNELFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2pFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBRWpELE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FDNUIsVUFBVSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEdBQWM7WUFDNUMsSUFDRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFZLENBQUMsSUFBSSxVQUFVLEVBQ3pEO2dCQUNBLE9BQU8sSUFBSSxDQUFDO2FBQ2I7UUFDSCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9