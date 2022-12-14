<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}:</label>
        <textarea v-if="field.id === 'content'" :name="field.id" :value="field.value"
          @input="field.value = $event.target.value" />
        <input v-else :type="field.id === 'password' ? 'password' : 'text'" :name="field.id" :value="field.value"
          @input="field.value = $event.target.value">
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button type="submit">
      {{ title }}
    </button>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      setUser: false, // Whether or not stored user should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      showClose: false, // whether to show close button or not
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */

      const options = {
        method: this.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const { id, value } = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setExperiencePoints', res.user ? res.user.experiencePoints : null);
          this.$store.commit('setUser', res.user);

          if (res.user) {
            this.$store.commit('refreshAccount');
            console.log("Loading quest data");
            const visitDate = new Date();
            const visitTime = visitDate.getTime();
            const oldTime = Date.parse(res.user.dailyLoginDate);
            let streak = res.user.loginStreak ? res.user.loginStreak : 1;
            const loginDates = res.user.loginDates ? res.user.loginDates : new Array([visitDate]);

            if (visitTime - oldTime >= 8.64e7) {

              streak += 1;
              loginDates.push(visitDate);

              const quest1 = { "questName": "login", "progress": 1 };
              this.$store.commit("setQuest", quest1);

              let questToSave = this.$store.state.quests.filter(quest => quest.name == "login")[0];
              const contentToOptions2 = () => {
                return {
                  method: 'PATCH',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    dailyLoginDate: visitDate,
                    experiencePoints: this.$store.state.experiencePoints,
                    quest: questToSave
                  }),
                };
              };
              let options = contentToOptions2();
              const response = await fetch("/api/users", options);
              if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error);
              }

              this.$store.commit('alert', {
                message: 'QUEST COMPLETE: Login Everyday!', status: 'quest'
              });
            }

            if (visitTime - oldTime >= 2 * 8.64e7) {
              streak = 1
            }

            this.$store.commit('setLoginStreak', streak);
            this.$store.commit('setLoginDates', loginDates);

            const contentToOptions2 = () => {
              return {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  loginDays: loginDates,
                  loginStreak: streak
                }),
              };
            };
            let options = contentToOptions2();
            const response = await fetch("/api/users", options);
            if (!response.ok) {
              const res = await response.json();
              throw new Error(res.error);
            }
          }
        }

        // if (this.setUser) {

        //   this.$store.commit('setUser', res.user);
        // }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article>div {
  display: flex;
  flex-direction: column;
}

form>article p {
  margin: 0;
}

form h3,
form>* {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
