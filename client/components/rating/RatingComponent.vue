<!-- This displays a rating object from database -->

<template>
  <article class="rating">
    <header>
      <h3>
        {{ this.category }}
      </h3>
    </header>
      <div id="ratingContainer">
        <svg height="100" width="100" id="ratingSVG">
          <circle cx="50" cy="50" r="40" id="ratingCircle" />
        </svg>
        <div id="ratingScore"> {{ this.score.toFixed(1) }} </div>
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
      strokeDashoffset: 0,
      rgba: 'rgba(0, 0, 0, 1)'
    }
  },
  mounted() {
    this.growRatingCircle();
  },
  methods: {
    growRatingCircle() {
      const relScore = this.score/5;
      this.strokeDashoffset = -250 * (1 - relScore);
      this.rgba = `rgba(${255*(1-relScore**2)}, ${255*(relScore**2)}, 0, 1)`;
    }
  }
}
</script>


<style scoped>

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#ratingContainer {
  display: grid;
  place-items: center;
  grid-template-areas: "inner-div";
}

#ratingSVG {
  grid-area: inner-div;
}

#ratingCircle {
  fill: transparent;
  stroke: v-bind(rgba);
  stroke-width: 5;
  stroke-dasharray: 250;
  stroke-dashoffset: -250;
  animation: rotate 2s linear forwards;
}

#ratingScore {
  grid-area: inner-div;

  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes rotate {
  to {
    stroke-dashoffset: v-bind(strokeDashoffset);
  }
}

</style>
