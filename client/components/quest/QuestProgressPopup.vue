<template>
    <article class="card">
        <div class="popup-title">
            <h3>-QUEST PROGRESS-</h3>
        </div>
        <h2>{{ quest.desc }}</h2>
        <p v-if="quest.currentProgress < quest.goalProgress">
            Current Progress: {{ quest.currentProgress }}/{{ quest.goalProgress }}
        </p>
        <LevelBar />

    </article>
</template>

<script>
import LevelBar from '@/components/quest/LevelBar.vue';

export default {
    name: 'QuestComponent',
    components: {
        LevelBar,
    },
    props: {
        // Data from the stored quest
        quest: {
            type: Object,
            required: true
        }
    },
    computed: {

    },
    methods: {
    }
};
</script>

<style scoped>
.popup-title {
    text-align: center;
}

#highlight-border {
    border-color: rgb(226, 215, 11);
    border-radius: 1em;
}
</style>
