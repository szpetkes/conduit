export class StringService {
    static parseQueryParamsString(queryParamsString, keyFormat = "normal", keyCase = "normal") {
        let queryParams = {};
        if (!queryParamsString) {
            return queryParams;
        }
        if (queryParamsString.indexOf("#") != -1) {
            queryParamsString = queryParamsString.split("#")[0];
        }
        let queryParamsExploded = queryParamsString.split("&");
        queryParamsExploded.forEach((kvpString) => {
            let kvpStringSplit = kvpString.split("=");
            let key;
            if (keyFormat == "normal") {
                key = kvpStringSplit[0];
                if (keyCase == "normal") {
                    queryParams[key] = kvpStringSplit[1];
                }
                if (keyCase == "lowercase") {
                    queryParams[key.toLowerCase()] = kvpStringSplit[1];
                }
            }
            if (keyFormat == "underscore") {
                key = kvpStringSplit[0].replace(/-/g, "_");
                if (keyCase == "normal") {
                    queryParams[key] = kvpStringSplit[1];
                }
                if (keyCase == "lowercase") {
                    queryParams[key.toLowerCase()] = kvpStringSplit[1];
                }
            }
        });
        return queryParams;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nX3NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJpbmdfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLE9BQU8sYUFBYTtJQXlCeEIsTUFBTSxDQUFDLHNCQUFzQixDQUMzQixpQkFBeUIsRUFDekIsWUFBb0IsUUFBUSxFQUM1QixVQUFrQixRQUFRO1FBRTFCLElBQUksV0FBVyxHQUE4QixFQUFFLENBQUM7UUFFaEQsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3RCLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDeEMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkQsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxjQUFjLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLEdBQVcsQ0FBQztZQUNoQixJQUFJLFNBQVMsSUFBSSxRQUFRLEVBQUU7Z0JBQ3pCLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtvQkFDdkIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7Z0JBQ0QsSUFBSSxPQUFPLElBQUksV0FBVyxFQUFFO29CQUMxQixXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRDthQUNGO1lBQ0QsSUFBSSxTQUFTLElBQUksWUFBWSxFQUFFO2dCQUM3QixHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtvQkFDdkIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7Z0JBQ0QsSUFBSSxPQUFPLElBQUksV0FBVyxFQUFFO29CQUMxQixXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRDthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0NBQ0YifQ==