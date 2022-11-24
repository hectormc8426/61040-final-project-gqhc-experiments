import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    username: null, // Username of the logged in user
    user: null,
    coins: null // Music Coins owned by the user
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
    setCoins(state, coins) {
      /**
       * Update the stored user to the specified one.
       * @param user - new user to set
       */
      state.coins = coins;
    },
    async refreshAccount(state) {
      /**
       * Request the server for the current account session details.
       */
      const url = `/api/users/session`;
      const res = await fetch(url).then(async r => r.json());

      state.username = res.user.username;
      state.coins = res.user.musicCoins;

    }

    // TODO: Fill this with appropriate mutations
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
