<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="ratingList">
      <h2>Rate This Lesson</h2>
      <div v-for="category in Object.keys(ratings)" id="ratingBlock">
        <RatingComponent :score="ratings[category]" :category="category" />
        <CreateRatingForm :contentId="lesson._id"
                          :category="category"
                          :score="Number(user_ratings[category])"
                          :change-score-callback="changeUserScore"
                          v-if="letInput" />
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
      user_ratings: {},
    }
  },
  async created() {
    const url = `api/rating/${this.lesson._id}`;
    const response = await fetch(url);
    const res = await response.json();
    this.ratings = res.ratings;

    // get user's rating if user is allowed to input
    if (this.letInput) {
      const url2 = `api/rating/${this.lesson._id}?useUserId=True`
      const response2 = await fetch(url2);
      if (response.ok) {
        const res2 = await response2.json();
        this.user_ratings = res2.ratings;
        for (let category in this.ratings) {
          if (!(category in this.user_ratings)) {this.user_ratings[category] = -1}
        }
      }
    }

    this.loading = false;
  },
  methods: {
    changeUserScore(category, score) {
      console.log(score);
      this.user_ratings[category] = score;
      this.$forceUpdate()
    },
  }
}
</script>

<style scoped>
#ratingBlock {
  display: inline-block;
  margin: 8px 24px;
}
</style>
