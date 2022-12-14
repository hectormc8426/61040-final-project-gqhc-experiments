<template>
  <article class="quest-view">
    <section>
      <h2 id="questTitle">Ongoing Quests</h2>
      <div class="cardContainer">
        <QuestComponent v-for="quest in $store.getters.incompleteQuests" :key="quest.name" :quest="quest" />
      </div>
    </section>
  </article>
</template>

<script>
import QuestComponent from '@/components/quest/QuestComponent.vue';
import QuestProgressPopup from '@/components/quest/QuestProgressPopup.vue';

export default {
  name: 'QuestView',
  components: { QuestComponent, QuestProgressPopup },
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
#questTitle {
  font-size: var(--h1);
  margin-top: 0;

  color: var(--dark-font-color);
}
</style>