<template>
    <div id="lessonForm" class="flex-container">
        <div>
            {{ new SimpleMDE() }}
        </div>

        <section class="flex-child">
            <form @submit.prevent="submit">
                <textarea v-model="message" placeholder="Write your lesson here!"/>
                <p>Message is: {{ message }}</p>

                <button @click="submit">
                    Send
                </button>
            </form>
        </section>

        <section id="lessonPreview" class="flex-child">
            <h2>Render</h2>
        </section>
    </div>
</template>

<script>

import SimpleMDE from 'simplemde';

// import VideoForm from "./VideoForm.vue";

export default {
    name: "CreateLessonForm",
    components: {  },
    data() {
        return {
            message: ""
        };
    },
    methods() {
    
    }
}

</script>


<style scoped>

.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
}



</style>