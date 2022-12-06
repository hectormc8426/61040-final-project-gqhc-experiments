<template>
    <section>
        <h2>
            Comments
        </h2>
        <CreateCommentForm :parentFreetId="lessonId" @updateComments="updateComments" />
        <CommentComponent v-for="comment in comments" :comment="comment" :parentLessonInstance="lesson"
            @updateComments="updateComments" :key="comment._id" />
    </section>
</template>


<script>
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

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
.comment {
    border: 1px solid #264027;
    padding: 20px;
    position: relative;
    background-color: rgb(221, 235, 191);
}
</style>