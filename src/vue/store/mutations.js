export default {
  setArticle(state, article) {
    state.article = article;
  },

  setArticles(state, articles) {
    state.articles = articles;
  },

  setArticlesCount(state, articles_count) {
    state.articles_count = articles_count;
  },

  setComment(state, comment) {
    state.comment = comment;
  },

  setComments(state, comments) {
    state.comments = comments;
  },

  setError(state, errors) {
    state.errors = errors;
  },

  setIsAuthenticated(state, value) {
    state.is_authenticated = value;
    console.log("setIsAuthenticated");
  },

  setProfile(state, profile) {
    state.profile = profile;
  },

  setTags(state, tags) {
    state.tags = tags;
    console.log("setting tags")
  },

  setUser(state, user) {
    state.user = user;
  },
};
