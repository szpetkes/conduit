import BaseResource from "./base_resource.ts";

import {
  ArticleEntity,
  ArticleModel,
  Filters as ArticleFilters,
} from "../models/article_model.ts";

class TagsResource extends BaseResource {
  static paths = [
    "/api/tags",
    "/api/tags/:id",
  ];

  public async GET() {
    var allTags = new Set();
    const tags = await ArticleModel.allTags();
    tags.forEach((tagList: String) => {

      tagList.split(',').forEach((tag: String) => {
        allTags.add(tag)
      });
    });
    this.response.body = Array.from(allTags);

    return this.response;    
  }
}


export default TagsResource;
