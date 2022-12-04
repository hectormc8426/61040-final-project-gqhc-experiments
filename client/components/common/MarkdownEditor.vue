<template>
    <vue-easymde v-model="content" ref="markdownEditor" :configs="configs" />
</template>
   
<script>
import VueEasymde from "vue-easymde";

export default {
    name: 'MarkdownEditor',
    props: {
        configs: Object // Allow other components to pass in different configs to the markdown editor
    },
    data() {
        return {
            content: ''
        };

    },
    computed: {
        easymde() {
            console.log(this.$refs.markdownEditor.easymde);
            return this.$refs.markdownEditor.easymde;
        },
    },
    components: {
        VueEasymde
    },
};
</script>
   
<style>
@import "~easymde/dist/easymde.min.css";
</style>