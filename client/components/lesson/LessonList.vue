<template>
  <section id="lessonList">
    <section class="cardContainer">
      <h1 id="lessonContainerTitle">Lessons</h1>

      <div v-for="lesson in ($store.state.lessons).slice().reverse()" class="card">

        <div id="lessonContent">
          <router-link class="link" :to="{ name: 'Lesson', params: { lessonId: lesson._id } }">
            <h3 id="lessonTitle"> {{ lesson.title }} </h3>
          </router-link>
          <LessonTagGroup :lesson="lesson" />
        </div>

        <div id="lessonRating">
          <LessonRatingGroup :let-input="false" :lesson="lesson" />
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import LessonTagGroup from "../tag/LessonTagGroup";
import LessonRatingGroup from "../rating/LessonRatingGroup";

export default {
  name: "LessonList.vue",
  components: { LessonTagGroup, LessonRatingGroup },
  props: {
    lessons: {
      type: Array,
      required: true
    }
  }
}
</script>


<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

main {
  display: flex;
  flex-direction: row;
  gap: 32px;
  min-height: 100vh;
}

#lessonContainerTitle {
  font-size: var(--h2);
  margin: var(--text-padding);
  /*padding: var(--text-padding);*/
}

#lessonTitle {
  margin-top: 20px;
}

.card {
  display: flex;
  flex-direction: row;
  min-height: 20%;
  flex-grow: 1;
}

#lessonContent {
  min-width: fit-content;
  width: 60%;
  flex-grow: 2;
}

a {
  color: var(--dark-font-color);
  font-size: var(--h4);
  text-decoration: none;
}
</style>