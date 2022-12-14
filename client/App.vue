<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />

  </div>
</template>



<script>
import NavBar from "@/components/common/NavBar.vue";
import "./assets/css/main.css"

export default {
  name: "App",
  components: { NavBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res.user;
        this.$store.commit("setUsername", user ? user.username : null);
        this.$store.commit("setUser", user); // store user as well
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: var(--font);
  background-color: var(--primary-color);
  /*background-color: var(--quaternary-color);*/
}

main {
  padding: 14vh 5vw 7vh;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: var(--primary-color);
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}

.alerts .quest {
  transform: translate(-15%, 10%);
  width: 200%;
  background-color: rgb(177, 65, 0);
  border-color: var(--header-color) !important;
  margin: 0.5em !important;
}

.alerts .questDone {
  transform: translate(-15%, 10%);
  width: 200%;
  background-color: rgb(45, 135, 87);
  border-color: var(--header-color) !important;
  margin: 0.5em !important;
}
</style>