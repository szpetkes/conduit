import BaseResource from "./base_resource.ts";
import { ArticleModel, } from "../models/article_model.ts";
import { ArticlesFavoritesModel } from "../models/articles_favorites_model.ts";
import UserModel from "../models/user_model.ts";
class ArticlesResource extends BaseResource {
    static paths = [
        "/api/articles",
        "/api/articles/:slug",
        "/api/articles/:slug/favorite",
    ];
    async GET() {
        console.log("Handling ArticlesResource GET.");
        if (this.request.getPathParam("slug")) {
            return await this.getArticle();
        }
        return await this.getArticles();
    }
    async POST() {
        console.log("Handling ArticlesResource POST.");
        if (this.request.url_path.includes("/favorite")) {
            return await this.toggleFavorite();
        }
        return await this.createArticle();
    }
    async PUT() {
        console.log("Handling ArticlesResource PUT");
        return await this.updateArticle();
    }
    async DELETE() {
        console.log("Handling ArticlesResource DELETE");
        return await this.deleteArticle();
    }
    async addAuthorsToEntities(authorIds, entities) {
        const authors = await UserModel.whereIn("id", authorIds);
        entities.map((entity) => {
            authors.forEach((user) => {
                if (user.id === entity.author_id) {
                    entity.author = user.toEntity();
                }
            });
            return entity;
        });
        return entities;
    }
    async addFavoritedToEntities(articleIds, entities) {
        console.log("addFavoritedToEntities");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return entities;
        }
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        entities = entities.map((entity) => {
            favs.forEach((favorite) => {
                if (entity.id === favorite.article_id) {
                    if (currentUser.id === favorite.user_id) {
                        entity.favorited = favorite.value;
                    }
                }
            });
            return entity;
        });
        return entities;
    }
    async addFavoritesCountToEntities(articleIds, entities) {
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        entities.map((entity) => {
            favs.forEach((favorite) => {
                if (favorite.article_id == entity.id) {
                    if (favorite.value === true) {
                        entity.favoritesCount += 1;
                    }
                }
            });
            return entity;
        });
        return entities;
    }
    async updateArticle() {
        const inputArticle = this.request.getBodyParam("article")
            ? this.request.getBodyParam("article")
            : null;
        if (inputArticle === null) {
            return this.errorResponse(400, "Article parameter must be passed in");
        }
        const article = new ArticleModel(inputArticle.author_id, inputArticle.title, inputArticle.description, inputArticle.body, inputArticle.tags, inputArticle.slug, inputArticle.created_at, inputArticle.updated_at, inputArticle.id);
        await article.save();
        if (!article) {
            return this.errorResponse(500, "Article could not be saved.");
        }
        this.response.body = {
            article: article.toEntity(),
        };
        return this.response;
    }
    async deleteArticle() {
        const articleSlug = this.request.getPathParam("slug");
        if (!articleSlug) {
            return this.errorResponse(400, "No article slug was passed in");
        }
        const articleResult = await ArticleModel.where({ slug: articleSlug });
        if (!articleResult.length) {
            return this.errorResponse(500, "Failed to fetch the article by slug: " + articleSlug);
        }
        const article = articleResult[0];
        const deleted = await article.delete();
        if (deleted === false) {
            return this.errorResponse(500, "Failed to delete the article of slug: " + articleSlug);
        }
        this.response.body = {
            success: true,
        };
        return this.response;
    }
    async createArticle() {
        const inputArticle = this.request.getBodyParam("article");
        if (!inputArticle.title) {
            return this.errorResponse(400, "You must set the article title.");
        }
        const article = new ArticleModel(inputArticle.author_id, inputArticle.title, inputArticle.description || "", inputArticle.body || "", inputArticle.tags || "");
        await article.save();
        if (!article) {
            return this.errorResponse(500, "Article could not be saved.");
        }
        this.response.body = {
            article: article.toEntity(),
        };
        return this.response;
    }
    async getArticle() {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const slug = this.request.getPathParam("slug") || "";
        const articleResult = await ArticleModel.where({ slug: slug });
        if (articleResult.length <= 0) {
            return this.errorResponse(404, "Article not found.");
        }
        const article = articleResult[0];
        const userResult = await UserModel.where({ id: article.author_id });
        if (userResult.length <= 0) {
            return this.errorResponse(400, "Unable to determine the article's author.");
        }
        const user = userResult[0];
        const entity = article.toEntity();
        entity.author = user.toEntity();
        const favs = await ArticlesFavoritesModel
            .where({ article_id: article.id });
        if (favs) {
            favs.forEach((favorite) => {
                if (favorite.value === true) {
                    entity.favoritesCount += 1;
                }
            });
            favs.forEach((favorite) => {
                if (entity.id === favorite.article_id) {
                    if (currentUser.id === favorite.user_id) {
                        entity.favorited = favorite.value;
                    }
                }
            });
        }
        this.response.body = {
            article: entity,
        };
        return this.response;
    }
    async getArticles() {
        const articles = await ArticleModel
            .all(await this.getQueryFilters());
        const articleIds = [];
        const authorIds = [];
        let entities = articles.map((article) => {
            if (authorIds.indexOf(article.author_id) === -1) {
                authorIds.push(article.author_id);
            }
            if (articleIds.indexOf(article.id) === -1) {
                articleIds.push(article.id);
            }
            return article.toEntity();
        });
        entities = await this.addAuthorsToEntities(authorIds, entities);
        entities = await this.addFavoritesCountToEntities(articleIds, entities);
        entities = await this.addFavoritedToEntities(articleIds, entities);
        entities = await this.filterEntitiesByFavoritedBy(articleIds, entities);
        this.response.body = {
            articles: entities,
        };
        return this.response;
    }
    async filterEntitiesByFavoritedBy(articleIds, entities) {
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        console.log(0);
        const username = this.request.getUrlQueryParam("favorited_by");
        if (!username) {
            console.log(1);
            return entities;
        }
        console.log(2);
        const results = await UserModel.where({ username: username });
        console.log(3);
        if (results.length <= 0) {
            console.log(4);
            return entities;
        }
        const user = results[0];
        const filtered = [];
        console.log(5);
        entities.forEach((entity) => {
            favs.forEach((favorite) => {
                console.log("a");
                if (entity.id === favorite.article_id) {
                    console.log("b");
                    if (user.id === favorite.user_id) {
                        console.log("c");
                        if (favorite.value === true) {
                            console.log("d");
                            entity.favorited = true;
                            filtered.push(entity);
                        }
                    }
                }
            });
        });
        return filtered;
    }
    async getQueryFilters() {
        const author = this.request.getUrlQueryParam("author");
        const tag = this.request.getUrlQueryParam("tag");
        const offset = this.request.getUrlQueryParam("offset");
        const filters = {};
        if (author) {
            const authorUser = await UserModel.where({ username: author });
            if (authorUser.length > 0) {
                filters.author = authorUser[0];
            }
        }
        if (tag) {
            filters.tag = tag;
        }
        if (offset) {
            console.log("offset:", offset);
            filters.offset = Number(offset);
        }
        console.log("filters: " + filters);
        return filters;
    }
    async toggleFavorite() {
        console.log("Handling action: toggleFavorite.");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const slug = this.request.getPathParam("slug") || "";
        const result = await ArticleModel.where({ slug: slug });
        if (result.length <= 0) {
            return this.errorResponse(404, `Article with slug "${slug}" not found.`);
        }
        const article = result[0];
        let favorite;
        const action = this.request.getBodyParam("action");
        switch (action) {
            case "set":
                favorite = await ArticlesFavoritesModel.where({
                    article_id: article.id,
                    user_id: currentUser.id,
                });
                if (favorite.length > 0) {
                    favorite[0].value = true;
                    await favorite[0].save();
                }
                else {
                    favorite = new ArticlesFavoritesModel(article.id, currentUser.id, true);
                    await favorite.save();
                }
                break;
            case "unset":
                favorite = await ArticlesFavoritesModel.where({
                    article_id: article.id,
                    user_id: currentUser.id,
                });
                if (!favorite) {
                    return this.errorResponse(404, "Can't unset favorite on article that doesn't have any favorites.");
                }
                favorite[0].value = false;
                await favorite[0].save();
                break;
        }
        return this.getArticle();
    }
}
export default ArticlesResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZXNfcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcnRpY2xlc19yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBRUwsWUFBWSxHQUViLE1BQU0sNEJBQTRCLENBQUM7QUFDcEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxTQUFTLE1BQU0seUJBQXlCLENBQUM7QUFHaEQsTUFBTSxnQkFBaUIsU0FBUSxZQUFZO0lBQ3pDLE1BQU0sQ0FBQyxLQUFLLEdBQUc7UUFDYixlQUFlO1FBQ2YscUJBQXFCO1FBQ3JCLDhCQUE4QjtLQUMvQixDQUFDO0lBTUssS0FBSyxDQUFDLEdBQUc7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFFOUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQyxPQUFPLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFL0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDL0MsT0FBTyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUNwQztRQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLEtBQUssQ0FBQyxHQUFHO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBRTdDLE9BQU8sTUFBTSxJQUFJLENBQUMs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