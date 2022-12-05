import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */

export const pointsToLevel = 200; // The amount of experience points per level

const store = new Vuex.Store({
  state: {
    pointsPerLevel: pointsToLevel,
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    username: null, // Username of the logged in user
    user: null,
    level: null, // level of the user
    experiencePoints: null,
    showcases: [],
    quests: null,
    comments: []
    // TODO: Fill this with appropriate states
  },
  getters: {
    incompleteQuests: (state) => {
      return state.quests.filter(quest => quest.currentProgress < quest.goalProgress);
    },
    completeQuests: (state) => {
      return state.quests.filter(quest => quest.currentProgress >= quest.goalProgress);
    }
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUser(state, user) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.user = user;
    },
    setExperiencePoints(state, points) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.experiencePoints = points;
      state.level = Math.floor(points / pointsToLevel + 1);
    },
    setShowcases(state, showcases) {
      /**
       * Update the stored showcases to the specified one
       * @param showcase - the new showcases to set
       */
      state.showcases = showcases;
    },
    setQuest(state, questNameAndProgress) {
      /**
       * Update the progress of quest 'questName' by the 
       * amount specified by 'progress'
       * 
       * @param questNameAndProgress - Object of form {questName:string, progress:number} for updating a quest
       *                               with name "questName" by amount "progress"
       */
      let questIndex = 0;
      for (let index = 0; index < state.quests.length; index++) {
        if (state.quests[index].name == questNameAndProgress.questName) {
          questIndex = index;
          break
        }
      }

      const completed = state.quests[questIndex].currentProgress >= state.quests[questIndex].goalProgress;

      if (!completed) {
        state.quests[questIndex].currentProgress += questNameAndProgress.progress;
        if (state.quests[questIndex].currentProgress >= state.quests[questIndex].goalProgress) {
          state.experiencePoints += state.quests[questIndex].reward;

          if (state.quests[questIndex].repeatAmount > 0) {
            state.quests[questIndex].goalProgress += state.quests[questIndex].repeatAmount;
          }
        }
      }
      state.level = Math.floor(state.experiencePoints / pointsToLevel + 1);

    },
    async refreshAccount(state) {
      /**
       * Request the server for the current account session details.
       */
      const url = `/api/users/session`;
      const res = await fetch(url).then(async r => r.json());

      state.username = res.user.username;
      state.experiencePoints = res.user.experiencePoints;
      state.level = Math.floor(res.user.experiencePoints / pointsToLevel + 1);
      state.quests = res.user.quests;

      console.log(state.quests);
    },
    async refreshShowcases(state) {
      /**
       * Request the server for the current account session details.
       */
      const url = `/api/showcases`;
      const res = await fetch(url).then(async r => r.json());
      console.log(res)
      state.showcases = res;
    },
    async refreshComments(state) {
      /**
       * Request the server for the currently available comments.
       */
      const url = `/api/comments`;
      const res = await fetch(url).then(async r => r.json());
      state.comments = res;
    }

    // TODO: Fill this with appropriate mutations
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
