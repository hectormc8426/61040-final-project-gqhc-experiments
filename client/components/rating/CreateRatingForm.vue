<template>
  <article class="ratingForm">
    <div>
      Your rating:
    </div>
    <div id="rating_options" v-for="i in 5">

      <div v-if="i === score">
        <button v-on:click="submit(i)" id="active">
          <div v-text="i"/>
        </button>
      </div>

      <div v-else>
        <button v-on:click="submit(i)" id="inactive">
          <div v-text="i"/>
        </button>
      </div>

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
      score: -1,  // which button is active

      loading: true,
    }
  },
  async created() {
    const url = `api/rating/${this.contentId}?category=${this.category}&useUserId=True`;
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }

    const response = await fetch(url, requestOptions);
    const res = await response.json();

    this.score = res.score;
    this.loading = false;
  },
  methods: {
    async submit(score) {
      if (this.loading) {  // don't submit until we know to patch or post
        return;
      }

      const url = `api/rating/${this.contentId}?category=${this.category}`;
      let method = (this.score === -1)? "POST" : "PATCH";
      method = (this.score === score)? "DELETE" : method;

      const requestOptions = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score })
      };
      const response = await fetch(url, requestOptions);
      this.score = (method === "DELETE")? -1 : score;

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

#active {
  background: lawngreen;
}

#inactive {
  /*background: white;*/
}

</style>
