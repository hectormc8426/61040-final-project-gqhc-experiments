<template>
    <main>
        <aside id="searchBar">
          <div class="loader" v-if="loading"/>

          <div id="lessonNameInput">
            Lesson Name
            <div id="inputField">
              <input v-model='query'/>
              <button v-on:click='search'>
                Search
              </button>
            </div>
          </div>

          <div id="lessonNameInput">
            Tag name
            <div id="inputField">
              <input v-model='tagQuery'/>
              <button v-on:click='tagSearch'>
                Search
              </button>
            </div>
          </div>
        </aside>

        <div class="verticalLine" />

        <div id="mainBody">

          <section id="lessonList">
            <section class="cardContainer">
              <h1 id="lessonContainerTitle">Lessons</h1>

              <div v-for="lesson in $store.state.lessons" class="card">

                  <div id="lessonContent">
                    <router-link class="link" :to="{ name: 'Lesson', params: { lessonId: lesson._id } }">{{
                        lesson.title
                      }}</router-link>
                    <LessonTagGroup :lesson="lesson" />
                  </div>

                  <div id="lessonRating">
                      <LessonRatingGroup :let-input="false" :lesson="lesson" />
                  </div>
              </div>
            </section>
          </section>

        </div>

    </main>
</template>

<script>

import CreateLessonForm from './CreateLessonForm.vue';
import LessonComponent from './LessonComponent.vue';

import markdownMixin from '@/mixins/markdownMixin.js';
import LessonRatingGroup from "../rating/LessonRatingGroup";
import LessonTagGroup from "../tag/LessonTagGroup";
import TagComponent from "../tag/TagComponent";
import RatingComponent from "../rating/RatingComponent";

export default {
    name: "LessonPage",
    components: {RatingComponent, TagComponent, LessonTagGroup, LessonRatingGroup, CreateLessonForm, LessonComponent },
    mixins: { markdownMixin },
    data() {
        return {
            tagQuery: "",
            query: "",
            title: "",
            content: "",
            parsedHTML: [],
            loading: false,
            lessons: [],
            easymde: null,
        };
    },
    created() {
        // let's get our lessons
        this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            const r = await fetch('api/lessons/');
            const res = await r.json();
            if (!r.ok) {
                this.loading = false;
                throw new Error(res.error);
            }
            this.$store.commit('refreshLessons');
            this.lessons = res;
            this.loading = false;
        },
        async search() {
            if (this.query) {
                const r = await fetch(`/api/lessons/search/${this.query}`);
                const res = await r.json();
                // this.$store.commit('setLessons', res);
                this.$store.commit({
                    type: 'setLessons',
                    lessons: res
                });
            } else {
                this.$store.commit('refreshLessons');
            }
        },
        async preview() {
            // accessing the text content within the markdown editor
            this.content = String(this.$refs.markdownEditor.$data.content);
            // let's preprocess our text
            const lessonChunks = this.format();
            // then actually push it to the server
            this.imgURLToData(lessonChunks).then((lessonChunks2) => console.log("result2: " + lessonChunks2));
            // with the text broken down, let's compile each lesson chunk into the appropriate html
            this.parsedHTML = this.parse(lessonChunks).flat(3);
        },
        async imgURLToData(lessonChunks) {
            // wait for all of the data to be turned to binary data
            return await Promise.all(lessonChunks.map(async (chunk) => {
                const { contentType, content } = chunk;

                if (contentType == 'image') {
                    const link = content;
                    const dataURL =
                        fetch(link)
                            .then(response => response.blob())
                            .then(blob => new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    resolve({ contentType: 'image', content: reader.result });
                                }
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            }));

                    return dataURL;
                }
                return chunk;
            }));
        }
    }
}
//  TODO: make it pretty
</script>


<style scoped>
.loader {
    border: 16px solid #f3f3f3;
    /* Light grey */
    border-top: 16px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

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
}

#searchBar {
  flex-grow: 1;
  padding-top: 2em;
}

#mainBody {
  flex-grow: 7;
  padding-top: 2.5em;
}

#lessonContainerTitle {
  font-size: var(--h2);
  margin: var(--text-padding);
  /*padding: var(--text-padding);*/
}

#lessonNameInput {
  display: flex;
  flex-direction: column;
}

#inputField {
  display: flex;
  flex-direction: row;
}

.card {
  display: flex;
  flex-direction: row;
  min-height:20%;
  flex-grow: 1;
}

#lessonContent {
  width: 60%;
  flex-grow: 6;
}

#lessonRating {
  width: 30%;
}

a {
  color: var(--dark-font-color);
  font-size: var(--h4);
  text-decoration: none;
}

.links {
    display: flex;
    gap: 1em;
}

.one-lesson {
    border: 1px solid black;
    padding: 1em;
    width: 100%;
}


.lesson-container {
    display: grid;
    display: flex;
    justify-content: space-between;
    gap: 1em; 
    flex:1;
    flex-direction: column;
}

.lesson-label {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 0;
    padding-left: 0.2em;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
    font-size: var(--h3);
}


.welcome-message {
    font-size: var(--h1);
    text-align: center;
}

</style>
