<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="ratingList">
      <h2>Rate This Lesson</h2>
      <div v-for="category in categories" id="ratingBlock">
        <RatingComponent :score="rating[category]" :category="category" />
        <CreateRatingForm :contentId="lesson._id" :category="category" v-if="letInput" />
      </div>
    </div>
  </div>
</template>

<script>

import RatingComponent from "./RatingComponent";
import CreateRatingForm from "./CreateRatingForm";

const CATEGORIES = ['Clarity', 'Accuracy', 'Engaging'];

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
      rating: {},
      categories: CATEGORIES
    }
  },
  async created() {
    for (let j = 0; j < 3; j++) {
      const category = CATEGORIES[j];
      const response = await fetch(`api/rating/${this.lesson._id}?category=${category}`);
      const res = await response.json();

      this.rating[category] = res['score'];
    }

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
