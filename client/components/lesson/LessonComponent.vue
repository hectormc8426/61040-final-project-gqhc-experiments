<template>
    <main class="lesson">
        <header>
            <h2>
                {{ lesson.title }}
            </h2>
            <section class="lesson-info">
                <h3 class="author">
                    by {{ lesson.author }}
                </h3>
                <p class="info">
                    {{ lesson.dateModified }}
                </p>
            </section>
        </header>
        <div v-if="$store.state.user && $store.state.user._id === lesson.userId" class="actions">
            <div v-show="editing">
                <MarkdownEditor v-model="content" ref='draftEditor' />
            </div>

            <button v-if="editing" @click="submitEdit">
                ✅ Save changes
            </button>
            <button v-if="editing" @click="stopEditing">
                🚫 Discard changes
            </button>
            <button v-if="!editing" @click="startEditing">
                ✏️ Edit
            </button>
            <button @click="deleteLesson">
                🗑️ Delete
            </button>
        </div>

        <section class="lesson-content">
            <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="lessonChunk"></div>
        </section>


        <section class="ratings">
            <LessonRatingGroup :lesson="lesson" :letInput="$store.state.username !== null" />
        </section>

        <LessonShowcaseComponent v-if="$store.state.username" :lessonId="lesson._id" />
        <CommentSection :lessonId="lesson._id" />
    </main>
</template>

<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import markdownMixin from '@/mixins/markdownMixin.js';
import LessonShowcaseComponent from '@/components/showcase/LessonShowcaseComponent.vue';
import RatingComponent from "@/components/rating/RatingComponent";
import CreateRatingForm from "@/components/rating/CreateRatingForm";
import LessonRatingGroup from "@/components/rating/LessonRatingGroup";
import CommentSection from "@/components/comment/CommentSection";

export default {
    name: 'LessonComponent',
    components: {
        LessonShowcaseComponent, RatingComponent, CreateRatingForm, LessonRatingGroup, CommentSection, MarkdownEditor
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
            console.log(this.lesson);
        },
    }
};
</script>

<style scoped>
.info {
    font-size: 15px;
}

.lesson-info {
    display: flex;
    align-items: baseline;
    gap: 1em;
    margin-top: 0;
}

.lesson-content {
    border-bottom: 1px solid black;
}



#ratingBlock {
    display: inline-block;
    margin: 8px 24px;
}
</style>