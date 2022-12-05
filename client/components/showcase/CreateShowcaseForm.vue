<template>
    <section>
        <h2>
            Create a Showcase!
        </h2>
        <div id="showcaseForm" class="flex-container">
            <div>
                <MarkdownEditor v-model="content" ref='markdownEditor' :configs="configs" />
                <button v-on:click='preview'>
                    Preview
                </button>
                <button v-on:click='submit'>
                    Submit
                </button>
            </div>
            <section id="showcasePreview" class="flex-child">
                <h3>Rendered</h3>
                <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="showcaseChunk">
                </div>
            </section>
        </div>
    </section>

</template>
<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import markdownMixin from '@/components/common/markdownMixin.js';

export default {
    name: "CreateShowcaseForm",
    components: { MarkdownEditor },
    mixins: { markdownMixin },
    props: {
        lessonId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            title: "",
            content: "",
            parsedHTML: [],
            configs: {
                maxHeight: "100px"
            }
        };
    },
    methods: {

        async submit() {
            if (confirm('Submit your showcase?')) {
                const contentToOptions = (showcaseContent) => {
                    return {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            lessonId: this.lessonId,
                            content: showcaseContent
                        }),
                    };
                };

                this.content = this.$refs.markdownEditor.$data.content;
                const showcaseChunks = this.format();
                await this.imgURLToData(showcaseChunks).then(async (showcaseChunks2) => {
                    const options = contentToOptions(showcaseChunks2);

                    console.log('options:: ' + JSON.stringify(options));

                    const response = await fetch("/api/showcases", options);
                    if (!response.ok) {
                        const res = await response.json();
                        throw new Error(res.error);
                    }
                });
                this.$store.commit('refreshShowcases');


                const quest1 = { "questName": "createShowcases", "progress": 1 };
                this.$store.commit("setQuest", quest1);

                let questToSave = this.$store.state.quests.filter(quest => quest.name == "createShowcases")[0];
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


                const quest2 = { "questName": "doOneShowcase", "progress": 1 };
                this.$store.commit("setQuest", quest2);

                questToSave = this.$store.state.quests.filter(quest => quest.name == "doOneShowcase")[0];
                console.log(questToSave);
                const contentToOptions3 = () => {
                    return {
                        method: 'PATCH',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            experiencePoints: this.$store.state.experiencePoints,
                            quest: questToSave
                        }),
                    };
                };
                options = contentToOptions3();
                const response2 = await fetch("/api/users", options);
                if (!response2.ok) {
                    const res = await response2.json();
                    throw new Error(res.error);
                }
            }
        },
    }
}
//  TODO: make it pretty
</script>


<style scoped>
.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
}

section {
    padding: 20px;
}
</style>