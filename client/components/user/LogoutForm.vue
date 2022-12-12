<!-- Form for signing out (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
    name: 'LogoutForm',
  components: {BlockForm},
  mixins: [BlockForm],
    data() {
        return {
            url: '/api/users/session',
            method: 'DELETE',
            setUsername: true,
            title: 'Sign out',
            fields: [],
            content: 'Taking a break? See you later.',
            callback: () => {
                this.$router.push({ name: 'Home' }); // Goes to Home page after signing out
                this.$store.commit('alert', {
                    message: 'You are now signed out!', status: 'success'
                });
                this.$store.commit('setUser', null); // manually set user to null
            }
        };
    }
};
</script>

<style scoped>

form {
  /*background-color: rgba(255, 255, 255, .4);*/
  color: var(--dark-font-color);
  /*background-color: var(--secondary-color);*/
  /*color: var(--primary-color);*/

  /*padding: var(--card-padding);*/
  padding-top: 0;

  border-radius: var(--round-border-medium);
  /*border: var(--fuzzy-border);*/
}

form h3 {
  margin-top: 0;
}

form button {
  width: 100%;
  /*height: fit-content;*/
  height: 32px;

  /*background-color: var(--primary-color);*/
  background-color: var(--secondary-color);
  color: var(--primary-color);

  border-radius: var(--round-border-tiny);
  border: none;
}

</style>
