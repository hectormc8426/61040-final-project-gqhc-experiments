<!-- to show showcase section for a specific lesson -->
<template>
    <main>
        <h3>
            Make a showcase!
        </h3>
        <!-- Only show form if logged in -->
        <CreateShowcaseForm v-if="store.state.username" :lessonId="lessonId" />
        <h3>
            Showcases
        </h3>
        <section v-if="$store.state.username">
            <ShowcaseComponent v-for="showcase in showcases" :key="showcase.id" :showcase="showcase" />
        </section>
    </main>
</template>

<script>
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import CreateShowcaseForm from '@/components/showcase/CreateShowcaseForm.vue';
import ShowcaseComponent from '@/components/showcase/ShowcaseComponent.vue';

export default {
    name: 'LessonShowcaseComponent',
    components: {
        CreateShowcaseForm, MarkdownEditor, ShowcaseComponent
    },
    props: {
        lessonId: string
    },
    data() {
        return {
            showcases: this.$store.state.showcases.filter((showcase) => (showcase.lessonId === this.lessonId))
        }
    },
    mounted() {
        this.$store.commit('refreshShowcases');
    }

}
</script>