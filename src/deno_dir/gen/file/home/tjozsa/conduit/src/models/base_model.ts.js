import { PostgresClient } from "../deps.ts";
export default class BaseModel {
    static async getDb() {
        const db = new PostgresClient({
            user: "user",
            password: "userpassword",
            database: "realworld",
            hostname: "realworld_postgres",
            port: 5432,
            tls: {
                enforce: false,
            },
        });
        await db.connect();
        return db;
    }
    static async closeDb(db) {
        await db.end();
    }
    static async Where(table, fields) {
        let query = `SELECT * FROM ${table} WHERE `;
        const clauses = [];
        for (const field in fields) {
            const value = fields[field];
            if (typeof value === "number") {
                clauses.push(`${field} = ${value}`);
            }
            else {
                clauses.push(`${field} = '${value}'`);
            }
        }
        query += clauses.join(" AND ");
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        return dbResult.rows;
    }
    static async WhereIn(table, data) {
        if (data.values.length <= 0) {
            return [];
        }
        const query = `SELECT * FROM ${table} ` +
            ` WHERE ${data.column} ` +
            ` IN (${data.values.join(",")})`;
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        return dbResult.rows;
    }
    static async query(query, ...args) {
        try {
            const db = await BaseModel.getDb();
            const dbResult = args && args.length
                ? await db.queryObject(query, ...args)
                : await db.queryObject(query);
            await BaseModel.closeDb(db);
            return {
                rows: dbResult.rows,
                rowCount: dbResult.rowCount ?? 0,
            };
        }
        catch (err) {
            console.error(err);
            return {
                rows: [],
                rowCount: 0,
                error: true,
            };
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2VfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUU1QyxNQUFNLENBQUMsT0FBTyxPQUFnQixTQUFTO0lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztRQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFJLGNBQWMsQ0FBQztZQUM1QixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsSUFBSSxFQUFFLElBQUk7WUFDVixHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7YUFDZjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVPLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQWtCO1FBQzdDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFlUyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FDMUIsS0FBYSxFQUNiLE1BQTBDO1FBRTFDLElBQUksS0FBSyxHQUFHLGlCQUFpQixLQUFLLFNBQVMsQ0FBQztRQUM1QyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxNQUFNLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDckM7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0Y7UUFDRCxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxRQUFRLENBQUMsUUFBUyxHQUFHLENBQUMsRUFBRTtZQUMxQixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFlTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDekIsS0FBYSxFQUNiLElBQW1FO1FBRW5FLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzNCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLEtBQUssR0FBRyxpQkFBaUIsS0FBSyxHQUFHO1lBQ3JDLFVBQVUsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUN4QixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDekIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztJQUN2QixDQUFDO0lBdUJNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUN2QixLQUFhLEVBQ2IsR0FBRyxJQUE0QjtRQUkvQixJQUFJO1lBQ0YsTUFBTSxFQUFFLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUNsQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsT0FBTztnQkFDTCxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxJQUFJLENBQUM7YUFDakMsQ0FBQztTQUNIO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0YifQ==