<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="ratingList">
      <h2>Rate This Lesson</h2>
      <div v-for="category in Object.keys(ratings)" id="ratingBlock">
        <RatingComponent :score="ratings[category]" :category="category" />
        <CreateRatingForm :contentId="lesson._id" :category="category" v-if="letInput" />
      </div>
    </div>
  </div>
</template>

<script>

import RatingComponent from "./RatingComponent";
import CreateRatingForm from "./CreateRatingForm";

export default {
  name: "LessonRatingGroup.vue",
  components: { CreateRatingForm, RatingComponent },
  props: {
    lesson: {
      type: Object,
      required: true
    },
    letInput: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      ratings: {},
    }
  },
  async created() {
    const url = `api/rating/${this.lesson._id}`;
    const response = await fetch(url);
    console.log(response.ok)
    const res = await response.json();
    this.ratings = res.ratings;
    console.log(res.ratings)
    this.loading = false;
  },
  methods: {
  }
}
</script>

<style scoped>
#ratingBlock {
  display: inline-block;
  margin: 8px 24px;
}
</style>
