<template>
  <article class="comment">
    <header>
      <h3 class="author">
        @{{ comment.author }} commented
      </h3>
      <div v-if="$store.state.username === comment.author" class="actions">
        <button @click="deleteComment">
          🗑️ Delete
        </button>
      </div>
    </header>

    <p class="content">
      {{ comment.content }}
    </p>
    <p class="info">
      Posted at {{ comment.dateModified }}
    </p>

    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>

export default {
  name: 'CommentComponent',
  props: {
    // Data from the stored lesson
    parentLessonInstance: {
      type: Object,
      required: true
    },
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during comment modification
    };
  },
  computed: {
  },
  methods: {
    deleteComment() {
      /**
       * Deletes this comment.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted comment!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the comment's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/comments/${this.comment._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshComments');
        this.$emit('updateComments'); // use emit to update comments. Can improve functionality later

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
<!-- 
<style scoped>
.comment {
  border: 1px solid #264027;
  padding: 20px;
  position: relative;
  background-color: rgb(221, 235, 191);
}
</style> -->