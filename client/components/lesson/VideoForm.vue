<template>
    <form enctype="multipart/form-data" @submit.prevent="submit">
        <div class="field">
            <label for="file" class="label">Upload Video Segments</label>
            <input type="file" @change="selectFile" ref="file"/>
            <button @click="submit">Send</button>
        </div>
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