<!-- to show showcase section for a specific lesson -->
<template>
    <section>
        <!-- Only show form if logged in -->
        <section>
            <h2>
                Create A Showcase
            </h2>
            <div>
                Demonstrate your learning from this lesson by making a showcase!
            </div>
            <CreateShowcaseForm v-if="$store.state.username" :lessonId="lessonId" />
        </section>
        <h2>
            Showcases For This Lesson
        </h2>
        <ShowcaseCarousel :showcases="showcases" />
    </section>
</template>

<script>
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import CreateShowcaseForm from '@/components/showcase/CreateShowcaseForm.vue';
import ShowcaseComponent from '@/components/showcase/ShowcaseComponent.vue';
import ShowcaseCarousel from '@/components/showcase/ShowcaseCarousel.vue';

export default {
    name: 'LessonShowcaseComponent',
    components: {
        CreateShowcaseForm, MarkdownEditor, ShowcaseComponent, ShowcaseCarousel
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