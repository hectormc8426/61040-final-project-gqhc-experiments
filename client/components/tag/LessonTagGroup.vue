<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="tagList">

      <TagComponent v-for="tag in tags" :key="tag.tagname" id="tagBlock" :tagname="tag.tagname" />

    </div>
  </div>
</template>

<script>

import TagComponent from "./TagComponent";


export default {
  name: "LessonTagGroup.vue",
  components: { TagComponent },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      tags: []
    }
  },
  async created() {
    const response = await fetch(`api/tag/${this.lesson._id}`);
    const res = await response.json();

    this.tags = res.tags;
    this.loading = false;
  },
  methods: {
  }
}
</script>

<style scoped>
#tagList {
  display: flex;
  flex-direction: row;
  padding: var(--text-padding);
  gap: 32px;
}

/*#tagBlock {*/
/*  display: inline-block;*/
/*  margin: 8px 15px;*/
/*}*/
</style>
