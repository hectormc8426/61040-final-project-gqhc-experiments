<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div>
    <div v-if="!loading" id="ratingContainer">
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
    await this.updateRatings();

    // get user's rating if user is allowed to input
    if (this.letInput) {
      const userUrl = `api/rating/${this.lesson._id}?useUserId=True`
      const userResponse = await fetch(userUrl);

      if (userResponse.ok) {
        const userRes = await userResponse.json();
        this.user_ratings = userRes.ratings;
        for (let category in this.ratings) {
          if (!(category in this.user_ratings)) {this.user_ratings[category] = -1}
        }
      }
    }

    this.loading = false;
  },
  methods: {
    async changeUserScore(category, score) {
      this.user_ratings[category] = score;
      await this.updateRatings();
      this.$forceUpdate()
    },
    async updateRatings() {
      const url = `api/rating/${this.lesson._id}`;
      const response = await fetch(url);
      const res = await response.json();
      this.ratings = res.ratings;
    }
  }
}
</script>

<style scoped>

#ratingContainer {
  display: flex;
  flex-direction: row;

  width: 100%;
  justify-content: space-between;

  align-items: center;
}

#ratingList {
  display: flex;
  flex-direction: row;

  /*flex-grow: 1;*/
}

#ratingBlock {
  display: flex;
  flex-direction: column;
  /*display: inline-block;*/
  /*margin: 8px 24px;*/
}
</style>
