import BaseModel from "./base_model.ts";
export function createArticleCommentsModelObject(article) {
    return new ArticleCommentsModel(article.article_id, article.body, article.author_image, article.author_id, article.author_username, article.created_at, article.updated_at, article.id);
}
export class ArticleCommentsModel extends BaseModel {
    article_id;
    created_at;
    body;
    id;
    author_id;
    author_username;
    author_image;
    updated_at;
    slug;
    constructor(articleId, body, authorImage, authorId, authorUsername, createdAt = Date.now(), updatedAt = Date.now(), id = -1, slug = "") {
        super();
        this.id = id;
        this.article_id = articleId;
        this.body = body;
        this.author_id = authorId;
        this.author_image = authorImage;
        this.author_username = authorUsername;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
        this.slug = this.id == -1
            ? this.createSlug(this.author_id + this.body + this.author_username)
            : slug;
    }
    async delete() {
        const query = `DELETE FROM article_comments WHERE id = $1`;
        const dbResult = await BaseModel.query(query, this.id);
        if (dbResult.error || dbResult.rowCount === 0) {
            return false;
        }
        return true;
    }
    async save() {
        const query = "INSERT INTO article_comments (article_id, author_image, author_id, author_username, body, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7));";
        await BaseModel.query(query, this.article_id, this.author_image, this.author_id, this.author_username, this.body, Date.now() / 1000.00, Date.now() / 1000.00);
        const tmp = await ArticleCommentsModel.where({ author_id: this.author_id, body: this.body });
        return tmp[0];
    }
    static async all(filters) {
        let query = "SELECT * FROM article_comments ";
        if (filters.article) {
            query += ` WHERE article_id = '${filters.article.id}' `;
        }
        if (filters.offset) {
            query += ` OFFSET ${filters.offset} `;
        }
        const dbResult = await BaseModel.query(query);
        return ArticleCommentsModel.constructArticleComments(dbResult.rows);
    }
    static async where(fields) {
        const results = await BaseModel.Where("article_comments", fields);
        if (results.length <= 0) {
            return [];
        }
        return ArticleCommentsModel.constructArticleComments(results);
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("article_comments", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        return ArticleCommentsModel.constructArticleComments(results);
    }
    toEntity() {
        return {
            id: this.id,
            author_id: this.author_id,
            author_image: this.author_image,
            author_username: this.author_username,
            article_id: this.article_id,
            body: this.body,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
    createSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s/g, "-");
    }
    static constructArticleComments(results) {
        const articleComments = [];
        results.forEach((result) => {
            const entity = {
                id: typeof result.id === "number" ? result.id : 0,
                body: typeof result.body === "string" ? result.body : "",
                "author_id": typeof result.author_id === "number"
                    ? result.author_id
                    : 0,
                "created_at": typeof result.created_at === "number"
                    ? result.created_at
                    : 0,
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                "article_id": typeof result.article_id === "number"
                    ? result.article_id
                    : 0,
                "author_username": typeof result.author_username === "string"
                    ? result.author_username
                    : "",
                "author_image": typeof result.author_image === "string"
                    ? result.author_image
                    : "",
            };
            articleComments.push(createArticleCommentsModelObject(entity));
        });
        return articleComments;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZV9jb21tZW50c19tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFydGljbGVfY29tbWVudHNfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFpQ3hDLE1BQU0sVUFBVSxnQ0FBZ0MsQ0FDOUMsT0FBNkI7SUFFN0IsT0FBTyxJQUFJLG9CQUFvQixDQUM3QixPQUFPLENBQUMsVUFBVSxFQUNsQixPQUFPLENBQUMsSUFBSSxFQUNaLE9BQU8sQ0FBQyxZQUFZLEVBQ3BCLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLE9BQU8sQ0FBQyxlQUFlLEVBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxFQUFFLENBQ1gsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsU0FBUztJQVUxQyxVQUFVLENBQVM7SUFPbkIsVUFBVSxDQUFTO0lBT25CLElBQUksQ0FBUztJQU9iLEVBQUUsQ0FBUztJQU9YLFNBQVMsQ0FBUztJQU9sQixlQUFlLENBQVM7SUFFeEIsWUFBWSxDQUFTO0lBT3JCLFVBQVUsQ0FBUztJQUVuQixJQUFJLENBQVM7SUFlcEIsWUFDRSxTQUFpQixFQUNqQixJQUFZLEVBQ1osV0FBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsWUFBb0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUM5QixZQUFvQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQzlCLEtBQWEsQ0FBQyxDQUFDLEVBQ2YsT0FBZSxFQUFFO1FBRWpCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxDQUFDO0lBV00sS0FBSyxDQUFDLE1BQU07UUFDakIsTUFBTSxLQUFLLEdBQUcsNENBQTRDLENBQUM7UUFDM0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFO1lBQzdDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFPTSxLQUFLLENBQUMsSUFBSTtRQU1mLE1BQU0sS0FBSyxHQUNULG9MQUFvTCxDQUFDO1FBQ3ZMLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FDbkIsS0FBSyxFQUNMLElBQUksQ0FBQyxVQUFVLEVBQ2YsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsZUFBZSxFQUNwQixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLEVBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQ3JCLENBQUM7UUFHRixNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFvQixDQUFDLEtBQUssQ0FDMUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUMvQyxDQUFDO1FBQ0YsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQXlDRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFnQjtRQUMvQixJQUFJLEtBQUssR0FBRyxpQ0FBaUMsQ0FBQztRQUM5QyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsS0FBSyxJQUFJLHdCQUF3QixPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2xCLEtBQUssSUFBSSxXQUFXLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztTQUN2QztRQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxPQUFPLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBVUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQ2hCLE1BQTBDO1FBRTFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxPQUFPLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFXRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDbEIsTUFBYyxFQUNkLE1BQThCO1FBRTlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtZQUMxRCxNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sb0JBQW9CLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQVNNLFFBQVE7UUFDYixPQUFPO1lBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDckMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDNUIsQ0FBQztJQUNKLENBQUM7SUFhUyxVQUFVLENBQUMsS0FBYTtRQUNoQyxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUU7YUFDdkIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQzthQUM3QixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFUyxNQUFNLENBQUMsd0JBQXdCLENBQ3ZDLE9BQWtDO1FBRWxDLE1BQU0sZUFBZSxHQUFnQyxFQUFFLENBQUM7UUFDeEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3pCLE1BQU0sTUFBTSxHQUF5QjtnQkFDbkMsRUFBRSxFQUFFLE9BQU8sTUFBTSxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELElBQUksRUFBRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN4RCxXQUFXLEVBQUUsT0FBTyxNQUFNLENBQUMsU0FBUyxLQUFLLFFBQVE7b0JBQy9DLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsWUFBWSxFQUFFLE9BQU8sTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRO29CQUNqRCxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVU7b0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUNMLFlBQVksRUFBRSxPQUFPLE1BQU0sQ0FBQyxVQUFVLEtBQUssUUFBUTtvQkFDakQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVO29CQUNuQixDQUFDLENBQUMsQ0FBQztnQkFDTCxZQUFZLEVBQUUsT0FBTyxNQUFNLENBQUMsVUFBVSxLQUFLLFFBQVE7b0JBQ2pELENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVTtvQkFDbkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsaUJBQWlCLEVBQUUsT0FBTyxNQUFNLENBQUMsZUFBZSxLQUFLLFFBQVE7b0JBQzNELENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZTtvQkFDeEIsQ0FBQyxDQUFDLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLE9BQU8sTUFBTSxDQUFDLFlBQVksS0FBSyxRQUFRO29CQUNyRCxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVk7b0JBQ3JCLENBQUMsQ0FBQyxFQUFFO2FBQ1AsQ0FBQztZQUNGLGVBQWUsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7Q0FDRiJ9