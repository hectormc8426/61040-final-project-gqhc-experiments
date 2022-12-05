<template>
    <section class="showcase-component">
        <div>
            author: {{ showcase.author }}
        </div>
        <div>
            date: {{ showcase.dateCreated }}
        </div>
        <article v-html="htmlContent">
        </article>
    </section>
</template>

<script>
import markdownMixin from '@/mixins/markdownMixin.js';
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';

export default {
    name: 'ShowcaseComponent',
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
        console.log(this.$refs);
    },
    data() {
        return {
            editing: false, // Whether or not this showcase is in edit mode
            draft: this.showcase.content, // Potentially-new content for this showcase
            alerts: {}, // Displays success/error messages encountered during showcase modification
            content: ""
        };
    },
    computed: {
        htmlContent() {
            return this.parse(this.showcase.content).reduce((content, chunk) => content + chunk)
        }
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this showcase.
             */
            this.editing = true; // Keeps track of if a showcase is being edited
            this.draft = this.showcase.content; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this showcase.
             */
            this.editing = false;
            this.draft = this.showcase.content;
        },
        deleteshowcase() {
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
        submitEdit() {
            /**
             * Updates showcase to have the submitted draft content.
             */
            if (this.showcase.content === this.draft) {
                const error = 'Error: Edited showcase content should be different than current showcase content.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            const params = {
                method: 'PATCH',
                message: 'Successfully edited showcase!',
                body: JSON.stringify({ content: this.draft }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    this.$emit('changedshowcase');
                }
            };
            this.request(params);
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
                this.$store.commit('refreshshowcases');
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
    border: 1px solid black;
}
</style>