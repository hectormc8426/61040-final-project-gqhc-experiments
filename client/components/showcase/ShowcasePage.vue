<template>
    <main>
        <!-- Only show showcase section if logged in -->
        <h2>Viewing All Showcases</h2>
        <ShowcaseSearchComponent @updateFilter="updateFilter" />
        <div v-if="lessonFilter">
            <div>
                Filtering by lesson name: {{ lessonFilter }}
            </div>
            <button v-on:click="updateFilter(null)">
                Clear Filter
            </button>
        </div>
        <ShowcaseComponent v-for="showcase in showcases" :key="showcase.id" :showcase="showcase" />
        <div v-if="(showcases.length === 0)">No showcases found.</div>
    </main>
</template>

<script>
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import CreateShowcaseForm from '@/components/showcase/CreateShowcaseForm.vue';
import ShowcaseComponent from '@/components/showcase/ShowcaseComponent.vue';
import ShowcaseSearchComponent from '@/components/showcase/ShowcaseSearchComponent.vue';

export default {
    name: 'ShowcasePage',
    components: {
        CreateShowcaseForm, MarkdownEditor, ShowcaseComponent, ShowcaseSearchComponent
    },
    data() {
        return {
            lessonFilter: null,
        }
    },
    mounted() {
        this.$store.commit('refreshShowcases');
    },
    computed: {
        showcases() {
            /**
             * Showcases with filter
             */
            if (!this.lessonFilter) {
                return this.$store.state.showcases;
            }
            return this.$store.state.showcases.filter((showcase) => showcase.lesson === this.lessonFilter);
        }
    },
    methods: {
        updateFilter(val) {
            this.lessonFilter = val;
        }
    }

}
</script>