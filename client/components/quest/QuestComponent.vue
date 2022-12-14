<template>
    <article class="card">
        <h2>{{ quest.desc }}</h2>
        <p v-if="quest.currentProgress < quest.goalProgress">
            Progress: {{ quest.currentProgress }}/{{ quest.goalProgress }}
        </p>
        <p v-else>
            Progress: COMPLETED <i class="fa fa-solid fa-square-check"></i>
        </p>
        <p>
            Reward: {{ quest.reward }} xp
        </p>
    </article>
</template>

<script>
export default {
    name: 'QuestComponent',
    props: {
        // Data from the stored freet
        quest: {
            type: Object,
            required: true
        }
    },
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

</style> 