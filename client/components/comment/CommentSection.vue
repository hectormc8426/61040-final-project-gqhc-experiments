<template>
    <section>
        <h2>
            Comments
        </h2>
        <CreateCommentForm class="card" :parentLessonId="lessonId" @updateComments="updateComments" />
        <CommentComponent class="card" v-for="comment in comments" :comment="comment" :parentLessonInstance="lesson"
            @updateComments="updateComments" :key="comment._id" />
    </section>
</template>


<script>
import CommentComponent from '@/components/comment/CommentComponent.vue';
import CreateCommentForm from '@/components/comment/CreateCommentForm.vue';

export default {
    name: 'CommentSection',
    components: {
        CommentComponent, CreateCommentForm
    },
    props: {
        lessonId: {
            type: String,
            required: true
        }
    },
    async mounted() {
        await this.setData();
    },
    data() {
        return {
            lesson: null,
            comments: []
        };
    },
    computed: {
    },
    methods: {
        async setData() {
            // Note: Make this prettier
            const r2 = await fetch(`/api/lessons?lessonId=${this.lessonId}`);
            const res2 = await r2.json();

            if (!r2.ok) {
                throw new Error(res2.error);
            }
            this.lesson = { ...res2 };
            await this.updateComments();
        },
        async updateComments() {
            const r = await fetch(`/api/comments?lessonId=${this.lessonId}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.comments = [...res];
        }
    }
};
</script>

<style scoped>

</style>