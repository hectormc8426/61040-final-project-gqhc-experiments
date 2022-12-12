<!-- This displays a rating object from database -->

<template>
  <article class="rating">
    <header>
      <h3>
        {{ this.category }}
      </h3>
    </header>
    <div>
      <svg height="100" width="100">
        <circle cx="50" cy="50" r="40" />
        {{ this.score.toFixed(1) }}
      </svg>
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

circle {
  fill: white;
  stroke: black;
  stroke-width: 2;
  stroke-dasharray: 250;
  stroke-dashoffset: 1000;
  animation: rotate .3s linear;
}

@keyframes rotate {
  to {
    stroke-dashoffset: 125;
  }
}

</style>
