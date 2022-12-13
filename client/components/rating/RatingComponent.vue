<!-- This displays a rating object from database -->

<template>
  <article class="rating">
    <header>
      <h3>
        {{ this.category }}
      </h3>
    </header>
    <div class="square">
      <div class="circle">
        <div id="score"> {{ this.score.toFixed(1) }} </div>

        <!--      <svg height="100" width="100" id="ratingScore">-->
        <!--        <circle cx="50" cy="50" r="40" class="ratingCircle" :id="id">-->
        <!--          <div id="score"> {{ this.score.toFixed(1) }} </div>-->
        <!--        </circle>-->
        <!--      </svg>-->

      </div>
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
      id: null
    }
  },
  mounted() {
    this.id = this._uid;
    // this.growRatingCircle();
  },
  methods: {
    growRatingCircle() {
      // const dOffset = -250 * (1 - this.score / 5);
      let item = document.getElementById('score');
      item.style.cssText += `border-color: rgb(${255 * (1 - relScore)}, ${255 * relScore}, 0)`

      // item.setAttribute('id', this.category);
      // item = document.getElementById(this.category);
      // item.style.cssText += `stroke-dashoffset:${dOffset}`;
      // item.style.strokeDashoffset = String(1000 * this.score/5);
      // item.style.animation = 'animation: rotate 2s linear forwards';
      // item.style.cssText += `stroke: rgb(${255*(1-relScore)}, ${255*relScore}, 0)`;
      // item.animate({
      //   strokeDashoffset: [-250, dOffset]
      //   // width: [0, (this.currentExperience / this.experienceToLevelUp) * 100 + '%'],
      // },
      // {
      //   duration: 2000,
      //   fill: "forwards",
      //   easing: "ease-out",
      //   // stroke: `rgb(${255*(1-relScore)}, ${255*relScore}, 0)`
      // })
      // item.textContent=this.currentExperience;
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

#ratingScore {

}

.square {
  width: fit-content;
  /*height:0;*/
  /*width:100%;*/
  /*padding-bottom:100%;*/
}

.circle {
  /*position: absolute;*/

  border-radius: 50%;
  width: 64px;
  height: 64px;
  /*padding: 10px;*/
  /*background: #fff;*/
  border: 3px solid #000;
  color: #000;

  display: flex;
  align-items: center;
  /*text-align: center;*/
}

.ratingCircle {
  fill: transparent;
  /*stroke: black;*/
  /*stroke-width: 2;*/
  /*stroke-dasharray: 250;*/
  /*stroke-dashoffset: 250;*/
  /*animation: rotate 2s linear forwards;*/

  display: flex;
  z-index: 0;

  text-align: center;
  /*line-height: 120px;*/
}

#score {
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;

  /*z-index: 5;*/

  /*color: var(--dark-font-color);*/
  /*position: fixed;*/
  /*top: 50vh;*/
  /*left: 50vw;*/
  /*transform: translate(-50%,-50%);*/
}

/*@keyframes rotate {*/
/*  to {*/
/*    stroke-dashoffset: 125;*/
/*  }*/
/*}*/

</style>
