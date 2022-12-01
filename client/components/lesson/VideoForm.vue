<template>
    <form enctype="multipart/form-data" @submit.prevent="submit">
        <section class="field">
            <label for="file" class="label">Upload Video Segments: </label>
            <input type="file" @change="selectFile" ref="file"/>
            <button @click="submit">Send</button>
        </section>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: "videoAttachments",
    data() {
        return {
            method: "POST",
            file: ""
        };
    },
    methods: {
        async submit() {
            const formData = new FormData();
            formData.append('file', this.file);
            console.log('sending the request to: ' + (window.location.origin + '/api/lessons/videos/'));
            await axios.post(window.location.origin + '/api/lessons/videos/', formData);
        },
        async selectFile() {
            this.file = this.$refs.file.files[0]
        }
    }
}

</script>


<style scoped>


</style>