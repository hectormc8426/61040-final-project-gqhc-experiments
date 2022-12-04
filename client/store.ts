import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */

const pointsToLevel = 200; // The amount of experience points per level

const store = new Vuex.Store({
  state: {
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    username: null, // Username of the logged in user
    user: null,
    level: null, // Music Coins owned by the user
    experiencePoints: null,
    showcases: [],
    // TODO: Fill this with appropriate states
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
      state.level = points / pointsToLevel + 1
    },
    setShowcases(state, showcases) {
      /**
       * Update the stored showcases to the specified one
       * @param showcase - the new showcases to set
       */
      state.showcases = showcases;
    },
    async refreshAccount(state) {
      /**
       * Request the server for the current account session details.
       */
      const url = `/api/users/session`;
      const res = await fetch(url).then(async r => r.json());

      state.username = res.user.username;
      state.experiencePoints = res.user.experiencePoints;
      state.level = res.user.experiencePoints / pointsToLevel + 1;

    },
    async refreshShowcases(state) {
      /**
       * Request the server for the current account session details.
       */
      const url = `/api/showcases`;
      const res = await fetch(url).then(async r => r.json());
      console.log(res)
      state.showcases = res;
    }

    // TODO: Fill this with appropriate mutations
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
