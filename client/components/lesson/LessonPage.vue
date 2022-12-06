<template>
    <div>
        <section v-if="$store.state.username">
            <header>
                <h2>Welcome @{{ $store.state.username }}</h2>
            </header>

            <div>
                <CreateLessonForm ref="lessonForm" />
            </div>

            <h2>Lessons by others</h2>


            <div id="lessonList" class="flex-container">
                <section id="lessonList" class="flex-container">
                    <div v-if="loading">
                        <div class="loader"></div>
                    </div>

                    <div v-else>
                        <div v-for="lesson in $store.state.lessons" class="one-lesson">
                            <router-link class="link" :to="{ name: 'Lesson', params: { lessonId: lesson._id } }">{{
                                    lesson.title
                            }}</router-link>
                        </div>
                    </div>
                </section>
            </div>
        </section>

        <section v-else>
            <header>
                <h2>Welcome to Music Mentors!</h2>
            </header>
            <article>
                <h3>
                    <router-link to="/login">
                        Sign in
                    </router-link>
                    to create, edit, and delete freets.
                </h3>
            </article>
        </section>

    </div>
</template>

<script>

import CreateLessonForm from './CreateLessonForm.vue';
import LessonComponent from './LessonComponent.vue';

import markdownMixin from '@/mixins/markdownMixin.js';

export default {
    name: "LessonPage",
    components: { CreateLessonForm, LessonComponent },
    mixins: { markdownMixin },
    data() {
        return {
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
                throw new Error(res.error);
            }
            this.$store.commit('refreshLessons');
            this.lessons = res;
            this.loading = false;
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
.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
}

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


.one-lesson {
    border: 1px solid black;
}
</style>
