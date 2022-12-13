<template>
    <main>
      <OngoingQuests id="questView"/>
      <div class="verticalLine"/>
      <aside id="sidePanel">
        <div id="userPanel">

          <AccountInfo id="accountInfo"/>

          <LevelBar />

          <LogoutForm />
        </div>

        <hr/>

        <CompleteQuests />
      </aside>
    </main>
</template>

<script>
import AccountInfo from '@/components/user/AccountInfo.vue';
import LogoutForm from '@/components/user/LogoutForm.vue';
import CompleteQuests from "../quest/CompleteQuests";
import OngoingQuests from "../quest/OngoingQuests";
import LevelBar from "../quest/LevelBar";

export default {
    name: 'UserPage',
    components: {LevelBar, AccountInfo, LogoutForm, CompleteQuests, OngoingQuests },
    computed: {
        currentLevel() {
            return this.$store.state.level;
        },
        experienceToLevelUp() {
            return this.$store.state.level * this.$store.state.pointsPerLevel;
        },
        currentExperience() {
          return this.$store.state.experiencePoints;
        },
    },
    mounted() {
      this.growExp()
    },
    methods: {
      growExp () {
        const item = document.getElementById('growBar');
        item.animate({
          width: [0, (this.currentExperience / this.experienceToLevelUp) * 100 + '%'],
        },
        {
          duration: 1000,
          fill: "forwards"
        })
        // item.textContent=this.currentExperience;
      }
    }
}

</script>


<style scoped>

main {
  display: flex;
  flex-direction: row;

  gap: 56px;  /* gap between children */
}

#sidePanel {
  width: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;

  flex-grow: 1;  /* Allows it to take remaining space */
  gap: 64px;
}

hr {
  border-top: 1px solid var(--dark-font-color);
  min-width: 100%;
}

#userPanel {
  width: 100%;
  height: fit-content;

  /*color: var(--primary-color);*/
  /*background-color: var(--secondary-color);*/
  color: var(--dark-font-color);

  /*padding: var(--card-padding);*/
  border-radius: var(--round-border-medium);

  display: flex;
  flex-direction: column;

  gap: 32px;
}


/* Overriding AccountInfo style */

#accountInfo {
  font-size: var(--h1);
  font-weight: bolder;
}

#questView {
  flex-grow: 5;  /* Allows it to take remaining space */
}

</style>
