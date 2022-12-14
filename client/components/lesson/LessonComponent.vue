<template>
    <main class="lesson">
        <article>
            <header>
                <h2>
                    {{ lesson.title }}
                </h2>
                <section class="lesson-info">
                    <p class="author">
                        Author: {{ lesson.author }}
                    </p>
                    <p class="info">
                        Published: {{ lesson.dateModified }}
                    </p>
                </section>
                <section class="tag-info">
                    <p>Tags:</p>
                    <LessonTagGroup :lesson="lesson" />
                </section>
            </header>
            <div v-if="$store.state.user && $store.state.user._id === lesson.userId" class="actions">
                <div v-show="editing">
                    <MarkdownEditor v-model="content" ref='draftEditor' />
                </div>

                <button v-if="editing" @click="submitEdit">
                    <i class="fa fa-solid fa-check"></i> Save changes
                </button>
                <button v-if="editing" @click="stopEditing">
                    <i class="fa fa-solid fa-ban"></i> Discard changes
                </button>
                <button v-if="!editing" @click="startEditing">
                    <i class="fa fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button @click="deleteLesson">
                    <i class="fa fa-solid fa-x"></i> Delete Lesson
                </button>
            </div>
            <section class="lesson-content">
                <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="lessonChunk">
                </div>
            </section>
        </article>
        <section class="ratings">
            <LessonRatingGroup :lesson="lesson" :letInput="$store.state.username !== null" :show-title="true" />
        </section>

        <LessonShowcaseComponent class="cardContainer" :lessonId="lesson._id" />

        <CommentSection class="cardContainer" :lessonId="lesson._id" />
    </main>
</template>

<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import markdownMixin from '@/mixins/markdownMixin.js';
import LessonShowcaseComponent from '@/components/showcase/LessonShowcaseComponent.vue';
import RatingComponent from "@/components/rating/RatingComponent";
import CreateRatingForm from "@/components/rating/CreateRatingForm";
import CommentSection from "@/components/comment/CommentSection";
import LessonTagGroup from "@/components/tag/LessonTagGroup";
import LessonRatingGroup from "../rating/LessonRatingGroup";

export default {
    name: 'LessonComponent',
    components: {
        LessonShowcaseComponent, LessonRatingGroup, RatingComponent, CreateRatingForm, CommentSection, MarkdownEditor, LessonTagGroup
    },
    mixins: { markdownMixin },
    data() {
        return {
            truthy: true,
            parsedHTML: [],
            editing: false,
            lesson: null,
            content: "",
            categories: ['Clarity', 'Accuracy', 'Engaging'],
        }
    },
    props: {
        lessonId: {
            type: String,
            required: true
        },
    },
    async mounted() {
        await this.setData(this.lessonId);
        this.parsedHTML = this.parse(this.lesson.content);
    },
    created() {
    },
    computed: {

    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.$nextTick(() => {
                this.$refs.draftEditor.easymde.value(this.lesson.originalText)
            });
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.$refs.draftEditor.easymde.value(this.lesson.originalText)
        },
        deleteLesson() {
            /**
             * Deletes this freet.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted lesson!', status: 'success'
                    });
                    this.$router.push("/lessons/");
                }
            };
            this.request(params);
        },
        async submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            this.editing = true;

            this.$nextTick(async () => {
                if (confirm('Are you ready to submit your edits?')) {
                    const title = this.lesson.title;
                    this.content = this.$refs.draftEditor.$data.content;
                    const newContent = this.content;
                    const contentToOptions = (lessonContent) => {
                        return {
                            method: 'PUT',
                            headers: { "Content-Type": "application/json" },
                            message: "Lesson edit successfully went through!",
                            body: JSON.stringify({
                                title: title,
                                content: lessonContent,
                                originalText: newContent,
                                lessonId: this.lesson._id,
                            }),
                            callback: () => {
                                this.$set(this.alerts, params.message, 'success');
                                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                            }
                        };
                    };

                    if (this.lesson.originalText === this.$refs.draftEditor.$data.content) {
                        const error = 'Error: Edited lesson content should be different than the current lesson content.';
                        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                        setTimeout(() => this.$delete(this.alerts, error), 3000);
                        return;
                    }

                    const lessonChunks = this.format();
                    await this.imgURLToData(lessonChunks).then(async (lessonChunks2) => {
                        const params = contentToOptions(lessonChunks2);
                        // this.request(params);
                        const response = await fetch(`/api/lessons/${this.lesson._id}`, params);
                    });
                    this.$store.commit('refreshLessons');
                    this.editing = false;
                }
            });
        },
        async request(params) {
            /**
             * Submits a request to the freet's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method, headers: { 'Content-Type': 'application/json' }
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/lessons/${this.lesson._id}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.editing = false;
                this.$store.commit('refreshLessons');

                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async setData(lessonId) {
            const r = await fetch(`/api/lessons?lessonId=${lessonId}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.lesson = { ...res };
        },
    }
};
</script>

<style scoped>
.lesson-info {
    display: flex;
    align-items: baseline;
    gap: 1em;
    margin-top: 0;
}

article {
    padding-bottom: 2vh;
    border-bottom: 1px solid black;
}

h2 {
    margin-bottom: 0;
}


#ratingBlock {
    display: inline-block;
    margin: 8px 24px;
}

.tag-info {
    display: flex;
    align-items: center;
}
</style>