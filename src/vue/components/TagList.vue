<template>
  <div class="tag-list">
    <Tag v-text="tag" v-for="(tag, index) in tags" :name="tag" :key="index">
    </Tag>
  </div>
</template>

<script>
  /**
   * example usage:
       <input id="tag-input"
         @keypress.enter.prevent="addTag(tag_input)" // update tag state here
       />
       <div class="tag-list">
         <span
           class="tag-default tag-pill"
           v-for="(tag, index) of tags"
           :key="tag + index"
         >
           <i class="ion-close-round" @click="removeTag(tag)"> </i>
           {{ tag }}
         </span>
       </div>
       ...
       computed: {
         ...mapGetters([
           "tags"
         ])
       }
   */
  export default {
  name: "TagList",
  props: {
    tags: Array
  }
};
</script>
