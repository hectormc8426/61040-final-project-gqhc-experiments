<template>
    <main>
        <section v-if="$store.state.username" id="mainContainer">
            <section class="homepage-header">
                <div class="welcome-message-container">
                    <h2 class="welcome-message">
                        Welcome Back, <br> {{ $store.state.username }}!
                    </h2>
                </div>

                <div id="questContainer">
<!--                  <router-link v-if="$store.state.username" to="/user" class="link">-->
<!--                    <button> Go to quests </button>-->
<!--                  </router-link>-->
                  <LevelBar id="levelBar"/>
                </div>
                <!-- <div class="streaks">
                    THIS SHOULD BE STREAK
                </div> -->
            </section>

            <LessonList :lessons="recentLessons"/>
<!--            <section class="cardContainer">-->
<!--                <h2 class="lesson-label"> Most Recent Lessons </h2>-->
<!--                <section class="lesson-container">-->
<!--                    <div v-for="lesson in recentLessons" class="card">-->
<!--                        <router-link class="link" :to="{ name: 'Lesson', params: { lessonId: lesson._id } }">-->
<!--                            <h3>-->
<!--                                {{ lesson.title }}-->
<!--                            </h3>-->
<!--                        </router-link>-->
<!--                        <LessonTagGroup :lesson="lesson" />-->
<!--                    </div>-->
<!--                </section>-->
<!--            </section>-->
        </section>
        <section v-else>
            <HomeLoginPage />
        </section>
    </main>
</template>

<script>
import HomeLoginPage from '@/components/Home/HomeLoginPage.vue';
import LessonTagGroup from "../tag/LessonTagGroup";
import LevelBar from "../quest/LevelBar";
import LessonList from "../lesson/LessonList";

export default {
    name: 'HomePage',
    components: {LessonList, LevelBar, HomeLoginPage, LessonTagGroup },
    data() {
        return {
            recentLessons:[],
        };
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            const r = await fetch('api/lessons/recent');
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.recentLessons = res;
        },
    },

    computed: {
    }
}

</script>

<style scoped>

#mainContainer {
  display: flex;
  flex-direction: column;
  gap: 5em;
}

.homepage-header {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 1em;
}


#questContainer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  min-width: 25%;
  width: fit-content;
  /*flex-grow: 1;*/
}

#levelBar {
  width: 100%;
}

.welcome-message-container {
  width: fit-content;
  /*flex-grow: 3;*/
}

a {
    color: var(--dark-font-color);
    font-size: var(--h4);
    text-decoration: none;
}

.welcome-message {
    width: fit-content;
    font-size: var(--h1);
    text-align: center;
}

</style>