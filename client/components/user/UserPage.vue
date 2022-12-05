<template>
    <main>
        <section>
            <h2>
                Your Profile
            </h2>
            <AccountInfo />
            <h3> Your Level: {{ currentLevel }}</h3>
            <p> Level Progress: [{{ currentExperience }} / {{ experienceToLevelUp }}] xp</p>
        </section>
        <QuestView />
        <LogoutForm />
    </main>
</template>

<script>
import AccountInfo from '@/components/user/AccountInfo.vue';
import LogoutForm from '@/components/user/LogoutForm.vue';
import QuestView from '@/components/quest/QuestView.vue';

export default {
    name: 'UserPage',
    components: { AccountInfo, LogoutForm, QuestView },
    computed: {
        currentLevel() {
            return this.$store.state.level;
        },
        experienceToLevelUp() {
            return this.$store.state.level * this.$store.state.pointsPerLevel;
        },
        currentExperience() {
            return this.$store.state.experiencePoints;
        }
    }
}
</script>