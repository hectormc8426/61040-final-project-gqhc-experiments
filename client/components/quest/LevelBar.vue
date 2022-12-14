<template>
  <div id="levelContainer">
    <span id="level"> Level <span class="levelCircle">{{ currentLevel }} </span></span>

    <div id="expContainer">
      <div id="expBar">
        <span id="growBar"></span>
      </div>

      <div id="expNum">
        {{ currentExperience }} / {{ experienceToLevelUp }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LevelBar",
  mounted() {
    this.growExp()
  },
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
  methods: {
    growExp() {
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
#levelContainer {
  min-width: 10vw;
  width: 100%;
  max-width: 40vw;

  border-radius: var(--round-border-medium);
}

#level {
  font-size: var(--body-font-size);
}

#expContainer {
  width: 100%;
  height: fit-content;

  border-radius: var(--round-border-medium);

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

#expBar {
  width: 100%;
  height: 28px;
  background-color: var(--secondary-color);

  border-radius: var(--round-border-medium);
  border: var(--fuzzy-border);

  overflow: hidden;
  display: flex;
  /* center align growBar */
  align-items: center;
}

#growBar {
  height: 100%;
  width: 0;

  margin: 0;
  /* necessary for anim to look good */
  padding: 0;

  border-radius: var(--round-border-medium);
  background-color: var(--tertiary-color);
}

#expNum {
  width: fit-content;
  height: fit-content;

  white-space: nowrap;
  font-size: 20px;
}
</style>