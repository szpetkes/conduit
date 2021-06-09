import BaseModel from "./base_model.ts";
export function createArticlesFavoritesModelObject(inputObj) {
    return new ArticlesFavoritesModel(inputObj.article_id, inputObj.user_id, inputObj.value, inputObj.id);
}
export class ArticlesFavoritesModel extends BaseModel {
    article_id;
    user_id;
    id;
    value;
    query = "";
    constructor(articleId, authorId, value, id = -1) {
        super();
        this.article_id = articleId;
        this.user_id = authorId;
        this.value = value;
        this.id = id;
    }
    async delete() {
        const query = `DELETE FROM articles WHERE id = $1`;
        const dbResult = await BaseModel.query(query, this.id);
        if (!dbResult || (dbResult && dbResult.rowCount < 1)) {
            return false;
        }
        return true;
    }
    async save() {
        if (this.id != -1) {
            return this.update();
        }
        const query = "INSERT INTO articles_favorites " +
            " (article_id, user_id, value)" +
            " VALUES ($1, $2, $3);";
        const dbResult = await BaseModel.query(query, this.article_id, this.user_id, String(this.value));
        if (dbResult.rowCount < 1) {
            return null;
        }
        const savedResult = await ArticlesFavoritesModel.where({ article_id: this.article_id });
        if (savedResult.length === 0) {
            return null;
        }
        return savedResult[0];
    }
    async update() {
        const query = "UPDATE articles_favorites SET value = $1 WHERE id = $2;";
        const dbResult = await BaseModel.query(query, String(this.value), this.id);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const updatedResult = await ArticlesFavoritesModel.where({ article_id: this.article_id });
        if (updatedResult.length >= 1) {
            return updatedResult[0];
        }
        return null;
    }
    static async where(fields) {
        const results = await BaseModel.Where("articles_favorites", fields);
        if (results.length <= 0) {
            return [];
        }
        const articleFavorites = [];
        results.forEach((result) => {
            const entity = {
                "article_id": typeof result.article_id === "number"
                    ? result.article_id
                    : 0,
                id: typeof result.id === "number" ? result.id : 0,
                "user_id": typeof result.user_id === "number" ? result.user_id : 0,
                value: typeof result.value === "boolean" ? result.value : false,
            };
            articleFavorites.push(createArticlesFavoritesModelObject(entity));
        });
        return articleFavorites;
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("articles_favorites", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        const articles = [];
        results.forEach((result) => {
            const entity = {
                "article_id": typeof result.article_id === "number"
                    ? result.article_id
                    : 0,
                "user_id": typeof result.user_id === "number" ? result.user_id : 0,
                value: typeof result.value === "boolean" ? result.value : false,
                id: typeof result.id === "number" ? result.id : 0,
            };
            articles.push(createArticlesFavoritesModelObject(entity));
        });
        return articles;
    }
    toEntity() {
        return {
            id: this.id,
            article_id: this.article_id,
            user_id: this.user_id,
            value: this.value,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZXNfZmF2b3JpdGVzX21vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJ0aWNsZXNfZmF2b3JpdGVzX21vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sU0FBUyxNQUFNLGlCQUFpQixDQUFDO0FBbUJ4QyxNQUFNLFVBQVUsa0NBQWtDLENBQ2hELFFBQWlDO0lBRWpDLE9BQU8sSUFBSSxzQkFBc0IsQ0FDL0IsUUFBUSxDQUFDLFVBQVUsRUFDbkIsUUFBUSxDQUFDLE9BQU8sRUFDaEIsUUFBUSxDQUFDLEtBQUssRUFDZCxRQUFRLENBQUMsRUFBRSxDQUNaLENBQUM7QUFDSixDQUFDO0FBSUQsTUFBTSxPQUFPLHNCQUF1QixTQUFRLFNBQVM7SUFVNUMsVUFBVSxDQUFTO0lBT25CLE9BQU8sQ0FBUztJQU9oQixFQUFFLENBQVM7SUFPWCxLQUFLLENBQVU7SUFLZixLQUFLLEdBQUcsRUFBRSxDQUFDO0lBWWxCLFlBQ0UsU0FBaUIsRUFDakIsUUFBZ0IsRUFDaEIsS0FBYyxFQUNkLEtBQWEsQ0FBQyxDQUFDO1FBRWYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFXTSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztRQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDckQsT0FBTyxL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