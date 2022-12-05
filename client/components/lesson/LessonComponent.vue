<template>
    <article class="lesson">
        <header>
            <h2>
                {{ lesson.title }}
            </h2>
            <h3 class="author">
                by {{ lesson.userId }}
            </h3>
        </header>
        <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="lessonChunk">
        </div>

        <p class="info">
            Posted at {{ lesson.dateModified }}
        </p>
        <ShowcaseComponent :lessonId="lesson._id" />
    </article>
</template>

<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import { Parser } from '../../../node_modules/marked/src/Parser';
import ShowcaseComponent from '@/components/showcase/ShowcaseComponent.vue';

export default {
    name: 'LessonComponent',
    components: {
        ShowcaseComponent
    },
    data() {
        return {
            truthy: true,
            parsedHTML: []
        }
    },
    props: {
        // Data from the stored freet
        lesson: {
            type: Object,
            required: true
        }
    },
    created() {
        this.parsedHTML = this.parse(this.lesson.content);
    },
    computed: {

    },
    methods: {
    }
};
</script>

<style scoped>

</style>