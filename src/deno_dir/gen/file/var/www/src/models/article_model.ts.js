import BaseModel from "./base_model.ts";
export function createArticleModelObject(article) {
    return new ArticleModel(article.author_id, article.title, article.description, article.body, article.tags, article.slug, article.created_at, article.updated_at, article.id);
}
export class ArticleModel extends BaseModel {
    author_id;
    body;
    tags;
    created_at;
    description;
    favorited = false;
    favoritesCount = 0;
    id;
    slug;
    title;
    updated_at;
    constructor(authorId, title, description, body, tags = "", slug = "", createdAt = Date.now(), updatedAt = Date.now(), id = -1) {
        super();
        this.id = id;
        this.author_id = authorId;
        this.title = title;
        this.description = description;
        this.body = body;
        this.tags = tags;
        this.slug = this.id == -1 ? this.createSlug(title) : slug;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
    async delete() {
        const query = `DELETE FROM articles WHERE id = $1`;
        const dbResult = await BaseModel.query(query, this.id);
        if (dbResult.rowCount < 1) {
            return false;
        }
        return true;
    }
    async save() {
        if (this.id != -1) {
            return this.update();
        }
        const query = "INSERT INTO articles " +
            " (author_id, title, description, body, slug, created_at, updated_at, tags)" +
            " VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), $8);";
        const dbResult = await BaseModel.query(query, this.author_id, this.title, this.description, this.body, this.createSlug(this.title), Date.now() / 1000.00, Date.now() / 1000.00, this.tags);
        if (dbResult.rowCount < 1) {
            return [];
        }
        const savedResult = await ArticleModel.where({ slug: this.slug });
        if (savedResult.length === 0) {
            return [];
        }
        return savedResult[0];
    }
    async update() {
        const query = "UPDATE articles SET " +
            "title = $1, description = $2, body = $3, updated_at = to_timestamp($4), tags = $5 " +
            `WHERE id = '${this.id}';`;
        const dbResult = await BaseModel.query(query, this.title, this.description, this.body, Date.now(), this.tags);
        if (dbResult.rowCount < 1) {
            return [];
        }
        const updatedResult = await ArticleModel.where({ id: this.id });
        if (updatedResult.length === 0) {
            return [];
        }
        return updatedResult[0];
    }
    static async all(filters) {
        console.log(filters);
        let query = "SELECT * FROM articles ";
        if (filters.author) {
            query += ` WHERE author_id = '${filters.author.id}' `;
        }
        if (filters.tag) {
            query += ` WHERE tags LIKE '%${filters.tag}%' `;
            console.log(query);
        }
        if (filters.offset) {
            query += ` OFFSET ${filters.offset} `;
        }
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        if (dbResult.rows.length === 0) {
            return [];
        }
        const articles = [];
        dbResult.rows.forEach((result) => {
            const entity = {
                id: typeof result.id === "number" ? result.id : 0,
                body: typeof result.body === "string" ? result.body : "",
                "author_id": typeof result.author_id === "number"
                    ? result.author_id
                    : 0,
                "created_at": typeof result.created_at === "number"
                    ? result.created_at
                    : 0,
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    static async allTags() {
        let query = "SELECT tags FROM articles ";
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        if (dbResult.rows.length === 0) {
            return [];
        }
        const articles = Array();
        dbResult.rows.forEach((result) => {
            articles.push(result.tags);
        });
        return articles;
    }
    static async where(fields) {
        const results = await BaseModel.Where("articles", fields);
        if (results.length <= 0) {
            return [];
        }
        const articles = [];
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
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("articles", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        const articles = [];
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
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    toEntity() {
        return {
            id: this.id,
            author_id: this.author_id,
            title: this.title,
            description: this.description,
            favorited: this.favorited,
            favoritesCount: this.favoritesCount,
            body: this.body,
            tags: this.tags,
            slug: this.slug,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
    createSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s/g, "-");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZV9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFydGljbGVfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFtQ3hDLE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxPQUFzQjtJQUM3RCxPQUFPLElBQUksWUFBWSxDQUNyQixPQUFPLENBQUMsU0FBUyxFQUNqQixPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxXQUFXLEVBQ25CLE9BQU8sQ0FBQyxJQUFJLEVBQ1osT0FBTyxDQUFDLElBQUksRUFDWixPQUFPLENBQUMsSUFBSSxFQUNaLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxFQUFFLENBQ1gsQ0FBQztBQUNKLENBQUM7QUFJRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFNBQVM7SUFVbEMsU0FBUyxDQUFTO0lBT2xCLElBQUksQ0FBUztJQVViLElBQUksQ0FBUztJQU9iLFVBQVUsQ0FBUztJQU9uQixXQUFXLENBQVM7SUFPcEIsU0FBUyxHQUFHLEtBQUssQ0FBQztJQU9sQixjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBT25CLEVBQUUsQ0FBUztJQU9YLElBQUksQ0FBUztJQU9iLEtBQUssQ0FBUztJQU9kLFVBQVUsQ0FBUztJQWlCMUIsWUFDRSxRQUFnQixFQUNoQixLQUFhLEVBQ2IsV0FBbUIsRUFDbkIsSUFBWSxFQUNaLE9BQWUsRUFBRSxFQUNqQixPQUFlLEVBQUUsRUFDakIsWUFBb0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUM5QixZQUFvQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQzlCLEtBQWEsQ0FBQyxDQUFDO1FBRWYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFL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