<template>
    <section>
        <div id="showcaseForm" class="flex-container">
            <div class="flex-child">
                <MarkdownEditor v-model="content" ref='markdownEditor' :configs="configs" class="editor" />
                <div class="controllers">
                    <button v-on:click='showTutorial'>
                        Help
                    </button>
                    <button v-on:click='preview'>
                        Preview
                    </button>
                    <button v-on:click='submit'>
                        Submit
                    </button>
                </div>
            </div>
            <div id="showcase-preview" class="flex-child">
                <h3 class="render-header">Rendered</h3>
                <div class="preview-content">
                    <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index"
                        class="showcaseChunk">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import markdownMixin from '@/mixins/markdownMixin.js';

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
                maxHeight: "100px",
                toolbar: [
                    "bold",
                    "italic",
                    "heading",
                    "|",
                    "quote",
                    "unordered-list",
                    "ordered-list",
                    "|",
                    "link",
                    "image",
                    "|",
                    {
                        name: "guide",
                        action: (editor) => {
                            let routeData = this.$router.resolve({ name: '/PLACEHOLDER' }); // just to get the base url
                            window.open(routeData.href + 'tutorial');
                        },
                        className: "fa fa-question-circle",
                        title: "Markdown Guide",
                    }
                ]
            }
        };
    },
    methods: {
        showTutorial() {
            let routeData = this.$router.resolve({ name: '/PLACEHOLDER' }); // just to get the base url
            window.open(routeData.href + 'tutorial');
        },
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

                // Clear text boxes
                this.$refs.markdownEditor.$data.content = '';
                this.preview();

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
    width: 100%;
    align-items: space-between;
    gap: 32px;
}

.flex-child {
    flex: 1;
}

.editor {
    width: 45vw;
    /* jank fix to make editor stop overflowing */
}

#showcase-preview {
    padding-top: 0;
    margin-top: 0;
}


.preview-content {
    height: 160px;
    padding: 0px 20px;
    overflow-y: scroll;
    overflow-x: scroll;
    border: 1px solid black;
}

.showcaseChunk {
    overflow-wrap: anywhere;
}

.render-header {
    margin-top: 0;
    margin-bottom: 0;
}

section {
    padding: 20px;
}

.controllers {
    display: flex;
    justify-content: flex-end;

}
</style>