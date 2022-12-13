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
        <circle cx="50" cy="50" r="40" id="ratingCircle"/>
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
  mounted() {
    this.growRatingCircle();
  },
  methods: {
    growRatingCircle() {
      const score = (this.score === -1)? 0 : this.score;
      const dOffset = 250 - 250 * score / 5;
      console.log(dOffset);
      const item = document.getElementById('ratingCircle');
      // item.style.cssText += `stroke-dashoffset:${dOffset}`;
      // item.style.strokeDashoffset = String(1000 * this.score/5);
      // item.style.animation = 'animation: rotate 2s linear forwards';
      item.animate({
        strokeDashoffset: [-125+dOffset, -125]
        // width: [0, (this.currentExperience / this.experienceToLevelUp) * 100 + '%'],
      },
      {

        duration: 2000,
        fill: "forwards",
        easing: "ease-out",
      })
      // item.textContent=this.currentExperience;
    }
  }
}
</script>


<style scoped>

#ratingCircle {
  fill: white;
  stroke: black;
  stroke-width: 2;
  stroke-dasharray: 250;
  /*stroke-dashoffset: 250;*/
  /*animation: rotate 2s linear forwards;*/
}

/*@keyframes rotate {*/
/*  to {*/
/*    stroke-dashoffset: 125;*/
/*  }*/
/*}*/

</style>
