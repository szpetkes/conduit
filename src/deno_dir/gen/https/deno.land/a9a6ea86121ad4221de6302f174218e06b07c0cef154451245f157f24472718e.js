import { Drash } from "../../mod.ts";
export class HttpService {
    accepts(request, type) {
        let acceptHeader = request.headers.get("Accept");
        if (!acceptHeader) {
            acceptHeader = request.headers.get("accept");
        }
        if (!acceptHeader) {
            return false;
        }
        if (typeof type === "string") {
            return acceptHeader.indexOf(type) >= 0 ? type : false;
        }
        const matches = type.filter((t) => acceptHeader.indexOf(t) >= 0);
        return matches.length ? matches[0] : false;
    }
    getMimeType(filePath, fileIsUrl = false) {
        let mimeType = null;
        if (fileIsUrl) {
            filePath = filePath ? filePath.split("?")[0] : undefined;
        }
        if (filePath) {
            let fileParts = filePath.split(".");
            filePath = fileParts.pop();
            const database = Drash.Dictionaries.MimeDb;
            for (let key in database) {
                if (!mimeType) {
                    const extensions = database[key].extensions;
                    if (extensions) {
                        extensions.forEach((extension) => {
                            if (filePath == extension) {
                                mimeType = key;
                            }
                        });
                    }
                }
            }
        }
        return mimeType;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaHR0cF9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFNckMsTUFBTSxPQUFPLFdBQVc7SUErQmYsT0FBTyxDQUNaLE9BQTJCLEVBQzNCLElBQXVCO1FBRXZCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWpELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBR0QsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDdkQ7UUFHRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDN0MsQ0FBQztJQWNNLFdBQVcsQ0FDaEIsUUFBNEIsRUFDNUIsWUFBcUIsS0FBSztRQUUxQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBSSxTQUFTLEVBQUU7WUFDYixRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FDMUQ7UUFFRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUUzQixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUUzQyxLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDYixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO29CQUM1QyxJQUFJLFVBQVUsRUFBRTt3QkFDZCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBaUIsRUFBRSxFQUFFOzRCQUN2QyxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUU7Z0NBQ3pCLFFBQVEsR0FBRyxHQUFHLENBQUM7NkJBQ2hCO3dCQUNILENBQUMsQ0FBQyxDQUFDO3FCQUNKO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRiJ9