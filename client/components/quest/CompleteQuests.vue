<template>
  <article class="quest-view">
    <section>
      <h2 id="questTitle">Completed Quests</h2>
      <div class="cardContainer">
        <QuestComponent v-for="quest in $store.getters.completeQuests" :key="quest.name" :quest="quest" />
      </div>
      <br />
    </section>
  </article>
</template>

<script>
import QuestComponent from '@/components/quest/QuestComponent.vue';

export default {
  name: 'QuestView',
  components: { QuestComponent },
  computed: {

  },
  methods: {
    async reactionRequest(params) {
      /**
       * Submits a request to the reaction's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const reactionId = this.userReaction ? this.userReaction._id : "";
        const r = await fetch(`/api/reactions/${reactionId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshReactions');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>

.quest-view {
  width: 100%;
}

#questTitle {
  font-size: var(--h4);
  color: var(--dark-font-color);
  /*margin: 0;*/
  margin-top: 0;
}


</style>