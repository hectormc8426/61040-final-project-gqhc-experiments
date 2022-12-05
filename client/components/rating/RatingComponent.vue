<!-- This displays a rating object from database -->

<template>
  <article class="rating">
    <header>
      <h2>
        {{ this.category }}
      </h2>
    </header>
    <div>
      <!-- here I put circle reflecting score -->
      {{ this.score }}
    </div>
  </article>
</template>


<script>

export default {
  name: 'RatingComponent',
  props: {
    category: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
    };
  },
}
</script>


<style scoped>



</style>
