<!-- to show showcase section for a specific lesson -->
<template>
    <section>
        <!-- Only show form if logged in -->
        <h2>
            Create A Showcase
        </h2>
        <div>
            Demonstrate your learning from this lesson by making a showcase!
        </div>
        <CreateShowcaseForm v-if="$store.state.username" :lessonId="lessonId" />
        <h3>
            Showcases For This Lesson
        </h3>
        <section v-if="$store.state.username">
            <ShowcaseComponent v-for="showcase in showcases" :key="showcase.id" :showcase="showcase" />
        </section>
    </section>
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
        lessonId: String
    },
    data() {
        return {
        }
    },
    computed: {
        showcases() {
            return this.$store.state.showcases.filter((showcase) => (showcase.lessonId === this.lessonId))
        }
    },
    mounted() {
        this.$store.commit('refreshShowcases');
    }

}
</script>