<template>
  <article class="ratingForm">
    <div>
      Your rating:
    </div>
    <div id="rating_options" v-for="i in 5">
      <button v-on:click="submit(i)">
        <div v-text="i" />
      </button>
    </div>
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
    async submit(score) {
      const url = `api/rating/contentId=${this.contentId}&category=${this.category}`;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score , userId: '0000000000000000000000' })  // hard code for now
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error);
      }
    }
  }
}
</script>

<style scoped>

#rating_options {
  display: inline-block;
}

</style>
