
<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
    name: 'CreateCommentForm',
    mixins: [BlockForm],
    props: {
        parentLessonId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            url: `/api/comments/${this.parentLessonId}`,
            method: 'POST',
            hasBody: true,
            fields: [
                { id: 'content', label: 'Content', value: '' }
            ],
            title: 'Add a comment',
            refreshFreets: true,
            callback: async () => {
                const message = 'Successfully created a comment!';
                this.$set(this.alerts, message, 'success');

                // Update quest corresponding to comment creation completed
                const quest1 = { "questName": "commentOne", "progress": 1 };
                this.$store.commit("setQuest", quest1);

                let questToSave = this.$store.state.quests.filter(quest => quest.name == "commentOne")[0];
                console.log(questToSave);
                const contentToOptions2 = () => {
                    return {
                        method: 'PATCH',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            experiencePoints: this.$store.state.experiencePoints,
                            quest: questToSave
                        }),
                    };
                };
                let options = contentToOptions2();
                const response = await fetch("/api/users", options);
                if (!response.ok) {
                    const res = await response.json();
                    throw new Error(res.error);
                }


                this.$emit('updateComments'); // tell parent to update comments
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            }
        };
    }
};
</script>
