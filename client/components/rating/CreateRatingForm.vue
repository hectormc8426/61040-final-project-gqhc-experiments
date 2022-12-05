<template>
  <article class="ratingForm">
    <div id="rating_options" v-for="i in 5">
      <button v-on:click="setScore(i)">
        i
      </button>
    </div>

    <button v-on:click="submit">
      Submit
    </button>
  </article>
</template>

<script>
export default {
  name: "CreateRatingForm.vue",
  props: {
    contentId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      score: 5,
    }
  },
  methods: {
    async submit() {
      const url = `/api/ratings/contentId=${this.contentId}&category=${this.category}`;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: this.score })
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error);
      }
    },
    setScore(score) {
      this.score = score;
    }
  }
}
</script>

<style scoped>

#rating_options {
  display: flex;
}

</style>
