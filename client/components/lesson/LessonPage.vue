<template>
    <main>
        <aside id="searchBar">
            <!--          <div class="loader" v-if="loading"/>-->

            <div id="lessonNameInput">
                <h3 id="lessonNameTitle"> Search By Title </h3>
                <div id="inputGroup">
                    <input v-model='query' id="inputField" />
                    <button v-on:click='search' id="inputButton">
                        Search
                    </button>
                </div>
            </div>
            <!-- </div> -->
            <hr />
            <!--          <hr style="width: 100%; border: 1px solid black"/>-->

            <div id="lessonNameInput">
                <h3 id="lessonNameTitle"> Search By Tags </h3>
                <CreateTagsFormShowTemp ref="tempTags" />
                <button v-on:click="searchByTags()">Search</button>
            </div>

        </aside>

        <div class="verticalLine"></div>

        <div id="mainBody">

            <LessonList :lessons="lessons" />

        </div>

    </main>
</template>

<script>

import CreateLessonForm from './CreateLessonForm.vue';
import LessonComponent from './LessonComponent.vue';

import markdownMixin from '@/mixins/markdownMixin.js';
import TagComponent from "../tag/TagComponent";
import RatingComponent from "../rating/RatingComponent";
import CreateTagsFormShowTemp from "../tag/CreateTagsFormShowTemp";
import LessonList from "./LessonList";

export default {
    name: "LessonPage",
    components: {
        LessonList,
        CreateTagsFormShowTemp,
        RatingComponent, TagComponent, CreateLessonForm, LessonComponent
    },
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
        async searchByTags() {
            const tagnames = this.$refs.tempTags.getTagnames();
            console.log("tag names", tagnames);
            if (tagnames.length > 0) {
                const r = await fetch(`/api/tag/search/${JSON.stringify(tagnames)}`);
                const res = await r.json();

                const lessons = res.tags.map((tag) => tag.contentId);
                this.$store.commit({
                    type: 'setLessons',
                    lessons: lessons
                });
                console.log("set lessons", lessons);
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
    height: fit-content;
    flex-grow: 1;
    padding-top: 2em;
    position: -webkit-sticky;
    position: sticky;
    top: 5.5em;

    display: flex;
    flex-direction: column;
    gap: 48px;
}

hr {
    width: 100%;
}

#mainBody {
    flex-grow: 7;
    padding-top: 2.5em;
}

#lessonNameInput {
    display: flex;
    flex-direction: column;
}

#lessonNameTitle {
    margin-top: 0;
}

#inputGroup {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

#inputField {
    border-radius: var(--round-border-tiny);
    border: var(--fuzzy-border);
}

a {
    color: var(--dark-font-color);
    font-size: var(--h4);
    text-decoration: none;
}

.welcome-message {
    font-size: var(--h1);
    text-align: center;
}
</style>
