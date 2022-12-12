<template>
    <main>
      <QuestView id="questView"/>
      <aside id="userPanel">

            <AccountInfo id="accountInfo"/>

            <div id="levelContainer">
              <div id="level"> Level {{ currentLevel }} </div>

              <div id="expContainer">
                <div id="expBar">
                  <span id="growBar"></span>
                </div>

                <div id="expNum">
                  {{ currentExperience }} / {{ experienceToLevelUp }}
                </div>
              </div>
            </div>


            <LogoutForm />
        </aside>
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

  gap: 64px;  /* gap between children */
}

#accountInfo {
  font-size: var(--h2);
  font-weight: bolder;
}

#levelContainer {
  color: var(--primary-color);
  /*color: var(--secondary-color);*/
  /*background-color: var(--primary-color);*/
  /*padding: var(--card-padding);*/
  border-radius: var(--round-border-medium);
}

#level {
  font-size: var(--body-font-size);
}

#userPanel {
  width: fit-content;
  height: fit-content;

  color: var(--primary-color);
  background-color: var(--secondary-color);

  padding: var(--card-padding);
  border-radius: var(--round-border-medium);

  display: flex;
  flex-direction: column;

  gap: 32px;
}

#questView {
  flex-grow: 1;  /* Allows it to take remaining space */
}

#expContainer {
  width: 100%;
  height: fit-content;
  /*background-color: var(--secondary-color);*/

  border-radius: var(--round-border-medium);
  /*padding: var(--text-padding);*/

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

#expBar {
  width: 100%;
  height: 28px;
  background-color: var(--primary-color);
  /*background-color: var(--secondary-color);*/

  border-radius: var(--round-border-medium);
  border: var(--fuzzy-border);

  overflow: hidden;
  display: flex; /* center align growBar */
  align-items: center;
}

#growBar {
  height: 100%;
  width: 0;

  margin: 0; /* necessary for anim to look good */
  padding: 0;

  border-radius: var(--round-border-medium);
  background-color: var(--success-color);
}

#expNum {
  width: fit-content;
  height: fit-content;

  white-space: nowrap;
  color: var(--primary-color);
  font-size: 20px;
  /*color: var(--secondary-color);*/
}

</style>
