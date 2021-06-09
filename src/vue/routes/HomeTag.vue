<template>
  <div class="home-tag"><ArticleList :tag="tag" /></div>
</template>
<script>
import ArticleList from "@/components/ArticleList.vue";
export default {
  name: "home-tag",
  components: {
    ArticleList
  },
  computed: {
    tag() {
      return this.$route.params.tag;
    }
  }
};
</script>