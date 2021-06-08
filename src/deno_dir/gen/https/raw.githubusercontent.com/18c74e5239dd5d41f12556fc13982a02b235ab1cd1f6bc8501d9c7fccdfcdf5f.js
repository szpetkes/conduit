export class IndexService {
    index = new Map();
    lookup_table;
    cache = new Map();
    constructor(lookupTable) {
        this.lookup_table = lookupTable;
    }
    addItem(searchTerms, item) {
        const id = this.lookup_table.size;
        this.lookup_table.set(id, item);
        searchTerms.forEach((searchTerm) => {
            let ids = this.index.get(searchTerm) || [];
            ids.push(id);
            this.index.set(searchTerm, ids);
        });
    }
    getIndex() {
        return this.index;
    }
    getLookupTable() {
        return this.lookup_table;
    }
    search(searchInput) {
        if (this.cache.has(searchInput)) {
            return this.cache.get(searchInput);
        }
        const results = new Map();
        this.index.forEach((ids, key) => {
            if (key.includes(searchInput)) {
                ids.forEach((id) => {
                    results.set(id, {
                        id: id,
                        item: this.lookup_table.get(id),
                        search_term: key,
                        search_input: searchInput,
                    });
                });
            }
        });
        this.cache.set(searchInput, results);
        return results;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4X3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0JBLE1BQU0sT0FBTyxZQUFZO0lBS2IsS0FBSyxHQUEwQixJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUszRCxZQUFZLENBQXVCO0lBTW5DLEtBQUssR0FBNEMsSUFBSSxHQUFHLEVBRy9ELENBQUM7SUFNSixZQUNFLFdBQWlDO1FBRWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFZTSxPQUFPLENBQUMsV0FBcUIsRUFBRSxJQUFhO1FBRWpELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBR2xDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUdoQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBa0IsRUFBRSxFQUFFO1lBQ3pDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQU9NLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQU9NLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFTTSxNQUFNLENBQUMsV0FBbUI7UUFDL0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBK0IsQ0FBQztTQUNsRTtRQUNELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBYSxFQUFFLEdBQVcsRUFBRSxFQUFFO1lBQ2hELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDN0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQVUsRUFBRSxFQUFFO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTt3QkFDZCxFQUFFLEVBQUUsRUFBRTt3QkFDTixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO3dCQUMvQixXQUFXLEVBQUUsR0FBRzt3QkFDaEIsWUFBWSxFQUFFLFdBQVc7cUJBQzFCLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFckMsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGIn0=