<template>
    <article class="lesson">
        <header>
            <h2>
                {{ lesson.title }}
            </h2>
            <h3 class="author">
                by {{ lesson.author }}
            </h3>
        </header>
        <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="lessonChunk">
        </div>

        <div v-if="$store.state.user._id === lesson.userId" class="actions">
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

        <p class="info">
            Posted at {{ lesson.dateModified }}
        </p>
        <CreateShowcaseForm v-if="$store.state.username" :lessonId="lesson._id" />
        <div v-for="category in categories" :key="category" id="ratingBlock">
            <RatingComponent :score="ratings[category]" :category="category" />
            <CreateRatingForm :contentId="lessonId" :category="category" />
        </div>
    </article>
</template>

<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import { Parser } from '../../../node_modules/marked/src/Parser';
import CreateShowcaseForm from '@/components/showcase/CreateShowcaseForm.vue';
import RatingComponent from "@/components/rating/RatingComponent";
import CreateRatingForm from "@/components/rating/CreateRatingForm";

export default {
    name: 'LessonComponent',
    components: {
        CreateShowcaseForm, RatingComponent, CreateRatingForm
    },
    data() {
        return {
            truthy: true,
            parsedHTML: [],
            editing: false
            lesson: null,
            ratings: {},
            categories: ['Clarity', 'Accuracy', 'Engaging'],
        }
    },
    props: {
        lessonId: {
            type: String,
            required: true
        },
    },
    mounted() {
        this.setData(this.lessonId);
    },
    created() {
        this.parsedHTML = this.parse(this.lesson.content);
        this.setData(this.lessonId);
    },
    computed: {

    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draft = this.lesson.content; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draft = this.lesson.content;
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
                }
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            // if (this.freet.content === this.draft) {
            //     const error = 'Error: Edited freet content should be different than current freet content.';
            //     this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
            //     setTimeout(() => this.$delete(this.alerts, error), 3000);
            //     return;
            // }

            // const params = {
            //     method: 'PUT',
            //     message: 'Successfully edited lesson!',
            //     body: JSON.stringify({content: this.draft}),
            //     callback: () => {
            //     this.$set(this.alerts, params.message, 'success');
            //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            //     }
            // };
            // this.request(params);
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

            ratingCategories = await Promise.all(this.categories.map((category) => ({ category: category, result: fetch(`api/rating/${this.lessonId}?category=${category}`) })));
            for (ratingCategory of ratingCategories) {
                this.ratings[ratingCategory[category]] = await ratingCategory[result].json();
            }
        },
    }
};
</script>

<style scoped>
/* article {
    border: 1px solid black;
} */


#ratingBlock {
    display: inline-block;
    margin: 8px 24px;
}
</style>