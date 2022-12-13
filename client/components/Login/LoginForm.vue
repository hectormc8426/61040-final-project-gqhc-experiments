<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setUser: true,
      fields: [
        { id: 'username', label: 'Username', value: '' },
        { id: 'password', label: 'Password', value: '' }
      ],
      title: 'Sign in',
      callback: () => {
        this.$router.push({ name: 'Home' });
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  border-radius: 10px;
  width: 40vw;
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
</style>