<template>
    <vue-easymde v-model="content" ref="markdownEditor" />
</template>
   
<script>
import VueEasymde from "vue-easymde";

export default {
    name: 'MarkdownEditor',
    components: {
        VueEasymde
    }
};
</script>
   
<style>
@import "~easymde/dist/easymde.min.css";
</style>