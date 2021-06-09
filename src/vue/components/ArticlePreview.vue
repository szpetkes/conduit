<template>
  <div class="article-preview">
    <ArticleMeta :article="article" />
    
    <router-link :to="articleLink" class="preview-link">
      <h1 v-text="article.title" />
      <p v-text="article.description" />
      <div class="tag-list">
        <Tag v-for="(tag, index) in article.tags" :name="tag" :key="index">
        </Tag>
      </div>
      <span>Read more...</span>
    </router-link>
  </div>
</template>

<script>
import ArticleMeta from "./ArticleMeta.vue";
import Tag from "./Tag.vue";

export default {
  name: "ArticlePreview",
  components: {
    ArticleMeta,
    Tag
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleLink() {
      return {
        name: "article",
        params: {
          slug: this.article.slug
        }
      };
    }
  }
};
</script>
