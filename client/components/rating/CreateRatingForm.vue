<template>
  <article class="ratingForm">
    <div>
      Your rating:
    </div>
    <div id="rating_options" v-for="i in 5">

      <div v-if="i === score">
        <button v-on:click="submit(i)" id="active">
          <div v-text="i" />
        </button>
      </div>

      <div v-else>
        <button v-on:click="submit(i)" id="inactive">
          <div v-text="i" />
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
    },
    score: {
      type: Number,
      required: false
    },
    changeScoreCallback: {
      type: Function,
      required: true
    }
  },
  methods: {
    async submit(score) {
      const url = `api/rating/${this.contentId}?category=${this.category}`;
      let method = (this.score === -1) ? "POST" : "PATCH";
      method = (this.score === score) ? "DELETE" : method;

      const requestOptions = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score })
      };
      const response = await fetch(url, requestOptions);
      this.changeScoreCallback(this.category, (this.score === score) ? -1 : score);

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error);
      }

      // Update quest corresponding to rating a lesson completed
      const quest1 = { "questName": "rateOne", "progress": 1 };
      this.$store.commit("setQuest", quest1);

      let questToSave = this.$store.state.quests.filter(quest => quest.name == "rateOne")[0];
      const contentToOptions2 = () => {
        return {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experiencePoints: this.$store.state.experiencePoints,
            quest: questToSave
          }),
        };
      };
      let options = contentToOptions2();
      const response2 = await fetch("/api/users", options);
      if (!response2.ok) {
        const res = await response2.json();
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
