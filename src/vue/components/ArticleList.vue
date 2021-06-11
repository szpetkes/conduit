<template>
  <div>
    <div v-if="is_loading" class="article-preview">Loading articles...</div>
    <div v-else>
      <div v-if="articles.length === 0" class="article-preview">
        No articles are here... yet.
      </div>
      <ArticlePreview
        v-for="(article, index) in articles"
        :article="article"
        :key="article.title + index"
      />
      <Pagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArticlePreview from "./ArticlePreview.vue";
import Pagination from "./Pagination.vue";
export default {
  name: "ArticleList",
  components: {
    ArticlePreview,
    Pagination
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "all"
    },
    author: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    },
    favorited: {
      type: String,
      required: false
    },
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    ...mapGetters([
      "articles",
      "articles_count",
      "is_loading",
      "pages",
    ]),
    params() {
      const { type } = this;
      const filters = {
        offset: (this.currentPage - 1) * this.itemsPerPage,
        limit: this.itemsPerPage
      };
      if (this.author) {
        filters.author = this.author;
      }
      if (this.tag) {
        filters.tag = this.tag;
      }
      if (this.favorited) {
        filters.favorited = this.favorited;
      }
      return {
        type,
        filters
      };
    },
    // pages() {
    //   if (this.isLoading || this.articles.length <= this.itemsPerPage) {
    //     return [];
    //   }
    //   return [
    //     ...Array(Math.ceil(this.articles.length / this.itemsPerPage)).keys()
    //   ].map(e => e + 1);
    // },
  },
  watch: {
    currentPage(newValue) {
      this.params.offset = (newValue - 1) * this.itemsPerPage;
      this.fetchArticles(this.params);
    },
    type() {
      this.resetPagination();
      this.fetchArticles(this.params);
    },
    author() {
      this.resetPagination();
      this.fetchArticles(this.params);
    },
    tag() {
      this.resetPagination();
      this.fetchArticles(this.params);
    },
    favorited() {
      this.resetPagination();
      this.fetchArticles(this.params);
    }
  },
  mounted() {
    this.fetchArticles(this.params);
  },
  methods: {
    fetchArticles() {
      this.$store.dispatch("fetchArticles", this.params);
    },
    resetPagination() {
      this.params.offset = 0;
      this.currentPage = 1;
    }
  }
};
</script>
