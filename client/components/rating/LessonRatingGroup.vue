<!-- Renders the ratings for a given lesson. Can optionally show user input so they can rate lesson -->

<template>
  <div id="lessonRatingGroup">
    <div v-if="!loading" id="ratingContainer">
      <h2 v-if="letInput">Rate This Lesson</h2>
      <div id="ratingList">
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
        for (let category in this.ratings) {
          await this.updateUserRatings(category);
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
    },
    async updateUserRatings(category) {
      const url = `api/rating/${this.lesson._id}?category=${category}&useUserId=True`
      const userResponse = await fetch(url);
      this.user_ratings[category] = -1;

      if (userResponse.ok) {
        const userRes = await userResponse.json();
        this.user_ratings[category] = userRes.score;
      }
    }
  }
}
</script>

<style scoped>

h2 {
  wrap-option: none;
}

#lessonRatingGroup {
  min-width: fit-content;
  width: 100%;
  flex-grow: 1;
}

#ratingContainer {
  display: flex;
  flex-direction: row;

  width: 100%;
  /*justify-content: space-between;*/

  align-items: center;
}

#ratingList {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;

  justify-content: space-around;

  flex-grow: 1;
}

#ratingBlock {
  display: flex;
  flex-direction: column;
  /*display: inline-block;*/
  /*margin: 8px 24px;*/
}
</style>
