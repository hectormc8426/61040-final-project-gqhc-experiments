<template>
    <main>
        <!-- Only show showcase section if logged in -->
        <h2>Viewing All Showcases</h2>
        <section v-if="$store.state.username">
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