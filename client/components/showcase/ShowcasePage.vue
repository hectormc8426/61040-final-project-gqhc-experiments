<template>
    <main>
        For testing: a random lesson with the showcase
        <CreateShowcaseForm lessonId="638c1f111dacd3847fd5aa48" />
        <!-- Only show showcase section if logged in -->
        <section v-if="$store.state.username">
            Viewing All Showcases
            <ShowcaseComponent v-for="showcase in $store.state.showcases" :key="showcase.id" :showcase="showcase" />
        </section>
    </main>
</template>

<script>
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import CreateShowcaseForm from '@/components/showcase/CreateShowcaseForm.vue';
import ShowcaseComponent from '@/components/showcase/ShowcaseComponent.vue';

export default {
    name: 'ShowcasePage',
    components: {
        CreateShowcaseForm, MarkdownEditor, ShowcaseComponent
    },
    mounted() {
        this.$store.commit('refreshShowcases');
    }

}
</script>