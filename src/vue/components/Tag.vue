<template>
  <router-link :to="{ path: tagLink }" :class="className" v-text="name"></router-link>
</template>

<script>
export default {
  name: "Tag",
  props: {
    name: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      required: false
    },
    className: {
      type: String,
      default: "tag-pill tag-default"
    }
  }, 
  computed: {
    tagLink: function() {
      return  "/tag/" + this.name
    }
  }
};
</script>
