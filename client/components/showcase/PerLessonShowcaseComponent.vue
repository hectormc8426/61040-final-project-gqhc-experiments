<!-- Showcase component within a lesson -->

<template>
    <section class="showcase-component">
        <header>
            <p>
                Posted by <b>{{ showcase.author }}</b> on {{ showcase.dateCreated }}
            </p>
        </header>
        <article v-html="htmlContent">
        </article>
        <!-- <MarkdownEditor class="editor" v-if="editing" ref='markdownEditor' v-model="content" />
        <div v-if="$store.state.username === showcase.author" class="actions">
            <button v-if="editing" @click="submitEdit">
                ✅ Save changes
            </button>
            <button v-if="editing" @click="stopEditing">
                🚫 Discard changes
            </button>
            <button v-if="!editing" @click="startEditing">
                ✏️ Edit
            </button>
            <button @click="deleteShowcase">
                🗑️ Delete
            </button>
        </div> -->
    </section>
</template>

<script>
import markdownMixin from '@/mixins/markdownMixin.js';
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';

export default {
    name: 'PerLessonShowcaseComponent',
    components: { MarkdownEditor },
    mixins: { markdownMixin },
    props: {
        // Data from the showcase
        showcase: {
            type: Object,
            required: true
        }
    },
    mounted() {
        // console.log(this.$refs);
    },
    data() {
        return {
            editing: false, // Whether or not this showcase is in edit mode
            draftParsedHTML: this.showcase.content, // Potentially-new content for this showcase
            alerts: {}, // Displays success/error messages encountered during showcase modification
            content: ""
        };
    },
    computed: {
        htmlContent() {
            return this.parse(this.showcase.content).reduce((content, chunk) => content + chunk, "")
        }
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this showcase.
             */
            this.editing = true; // Keeps track of if a showcase is being edited
            // this.draft = this.showcase.content; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this showcase.
             */
            this.editing = false;
        },
        deleteShowcase() {
            /**
             * Deletes this showcase.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted showcase!', status: 'success'
                    });
                }
            };
            this.request(params);
        },
        async submitEdit() {
            /**
             * Updates showcase to have the new content
             */
            if (confirm('Submit your edit?')) {
                const contentToOptions = (showcaseContent) => {
                    return {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            content: showcaseContent
                        }),
                    };
                };

                this.content = this.$refs.markdownEditor.$data.content;
                const showcaseChunks = this.format();
                await this.imgURLToData(showcaseChunks).then(async (showcaseChunks2) => {
                    const options = contentToOptions(showcaseChunks2);

                    console.log('options:: ' + JSON.stringify(options));

                    const response = await fetch(`/api/showcases/${this.showcase._id}`, options);
                    if (!response.ok) {
                        const res = await response.json();
                        throw new Error(res.error);
                    }
                });
                this.$store.commit('refreshShowcases');
                this.editing = false;
                this.$refs.markdownEditor.$data.content = '';
            }
        },
        async request(params) {
            /**
             * Submits a request to the showcase's endpoint
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
                const r = await fetch(`/api/showcases/${this.showcase._id}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(JSON.stringify(res.error));
                }
                this.editing = false;
                this.$store.commit('refreshShowcases');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>

<style scoped>
.showcase-component {
    padding: 0 2em;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: auto;
}

.editor {
    height: 20vh;
}
</style>