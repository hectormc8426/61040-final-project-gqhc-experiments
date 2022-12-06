<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="ratingList">
      Tags:
      <div v-for="tag in tags" id="tagBlock">
        <TagComponent :tagname="tag.tagname"/>
      </div>
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

#tagBlock {
  display: inline-block;
  margin: 8px 24px;
}

</style>
