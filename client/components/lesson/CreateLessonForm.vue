<template>
    <section id="lessonForm" class="flex-container">
        <div class="flex-child">
            <label>Title: </label>
            <input v-model="title" ref="titleInput" />
            <CreateTagsFormShowTemp ref="TagForm" />

            <MarkdownEditor v-model="content" ref='markdownEditor' class="editor" :configs="configs" />
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

        <section id="lessonPreview" class="flex-child">
            <h2 class="render-heading">Render</h2>
            <div class="preview-content">
                <div v-html="chunkHTML" v-for="chunkHTML in parsedHTML" :key="chunkHTML.index" class="lessonChunk">
                </div>
            </div>

        </section>
    </section>
</template>

<script>

import markdownMixin from '@/mixins/markdownMixin.js';
import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import CreateTagsFormShowTemp from "../tag/CreateTagsFormShowTemp";

export default {
    name: "CreateLessonForm",
    components: { CreateTagsFormShowTemp, MarkdownEditor },
    mixins: { markdownMixin },
    data() {
        return {
            title: "",
            content: "",
            parsedHTML: [],
            configs: {
                maxHeight: '40vh',
                hideIcons: ['side-by-side']
            }
        };
    },
    mounted() {
        // let's get our freets
        // this.$store.commit('setMarkdown', this.$refs.markdownEditor);
    },
    methods: {
        showTutorial() {
            let routeData = this.$router.resolve({ name: '/PLACEHOLDER' }); // just to get the base url
            window.open(routeData.href + 'tutorial');
        },
        async preview() {
            // DEBUGGING SESSION
            // console.log('TEST:');
            // const textAreaDivContainer = this.$refs.markdownEditor.$refs.markdownEditor.$el;
            // const textarea = Array.from(textAreaDivContainer.children)[0]; // inspect index.vue from vue-easymde folder in node_modules

            // textarea.value = "lol this is a test sentence";

            // console.log('VALUE: ' + textarea.value);
            // accessing the text content within the markdown editor
            this.content = String(this.$refs.markdownEditor.$data.content);
            // let's preprocess our text
            const lessonChunks = this.format();
            // then actually push it to the server
            this.imgURLToData(lessonChunks).then((lessonChunks2) => console.log("result2: " + lessonChunks2));
            // with the text broken down, let's compile each lesson chunk into the appropriate html
            this.parsedHTML = this.parse(lessonChunks).flat(3);
        },
        async submit() {
            if (confirm('Are you ready to submit your lesson?')) {
                const contentToOptions = (lessonContent) => {
                    return {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: this.title,
                            content: lessonContent,
                            originalText: this.content,
                        }),
                    };
                };

                this.content = this.$refs.markdownEditor.$data.content;
                const lessonChunks = this.format();
                await this.imgURLToData(lessonChunks).then(async (lessonChunks2) => {
                    const options = contentToOptions(lessonChunks2);

                    const response = await fetch("/api/lessons", options);
                    if (!response.ok) {
                        const res = await response.json();
                        throw new Error(res.error);
                    }

                    // add tags to lesson
                    const res = await response.json();
                    await this.$refs.TagForm.submit(res.lesson._id);
                });

                // Update quest corresponding to lessons completed
                const quest1 = { "questName": "createOneLesson", "progress": 1 };
                this.$store.commit("setQuest", quest1);

                let questToSave = this.$store.state.quests.filter(quest => quest.name == "createOneLesson")[0];
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


                // Update quest corresponding to lessons completed
                const quest2 = { "questName": "createLessons", "progress": 1 };
                this.$store.commit("setQuest", quest2);

                questToSave = this.$store.state.quests.filter(quest => quest.name == "createLessons")[0];

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

                // cleaning up the page

                this.$refs.markdownEditor.easymde.value("");
                this.$refs.titleInput.value = "";

                this.title = "";
                this.content = "";
                this.parsedHTML = [];

                this.$store.commit('refreshLessons');




            }
        },
        format() {
            // requirement: delimiter to be ---link:<video link>---
            let chunks = this.content.split(/---/);
            // each chunk is distinct -> one of { text, video, image }
            chunks = chunks.map((input) => {
                // for each lesson chunk
                // get rid of whitespaces at the beginning/end
                const trimmed = input.trim();
                // let's determine what this chunk represents:
                let type = null;
                let content = null;

                // if this is a video
                if (/!video:/.test(trimmed)) {
                    type = 'video';
                    const tokens = trimmed.split(/!video:/);
                    content = tokens[tokens.length - 1].trim();
                } else if (/!image:/.test(trimmed)) { // if this is an image
                    type = 'image';
                    const tokens = trimmed.split(/!image:/);
                    content = tokens[tokens.length - 1].trim();
                } else { // else, then it must be text (or let's treat it so)
                    type = 'text';
                    content = String(trimmed);
                }
                // and let's format it for our mongodb schema (not dealing with collection/router/etc rn since I need to get image working)
                return {
                    contentType: type,
                    content: content
                };
            });
            return chunks;
        },
        parse(lessonChunks) {
            // this is to grab each individual html pieces from the chunks and return them in one list
            const parser = new DOMParser(); // a parser to turn a html string to html element
            return lessonChunks.map((chunk) => { // for each chunk
                const { contentType, content } = chunk; // grab the type and content
                if (contentType == 'video') { // if we are dealing with a video
                    const link = content;
                    const tokens = link.split(/v=/); // get the link and process it
                    const videoId = tokens[tokens.length - 1]; // get the video token
                    // TODO: this is a gross hard code, but I'll edit it later
                    const stringHTML = '<iframe width="560" height="315" ' +
                        `src="https://www.youtube.com/embed/${videoId}" ` +
                        'title="YouTube video player" frameborder="0" ' +
                        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                        'allowfullscreen></iframe>';
                    // turn our html string to actual htmls (this comes in form <head></head><body>[ACTUAL CONTENT WE WANT]</body>)
                    const html = parser.parseFromString(stringHTML, 'text/html');
                    // let's grab what we actually want inside the html nbody
                    const nodes = html.getElementsByTagName('body')[0];
                    const parsedHTML = Array.from(nodes.children)[0].outerHTML; // turn the collection into an array
                    const htmlInString = String(parsedHTML);
                    return htmlInString;
                } else if (contentType == 'image') {
                    const link = content;
                    const markdownForm = "![imgX](" + link + ")";
                    const stringHTML = this.$refs.markdownEditor.easymde.markdown(markdownForm);
                    const html = parser.parseFromString(stringHTML, 'text/html');
                    const nodes = html.getElementsByTagName('body')[0];
                    const imageHTML = Array.from(nodes.children)[0];
                    return String(imageHTML.outerHTML);
                } else { // then it must be text (it's safe this way too lol)
                    // for text, we actually want to convert them using markdown rules/effects
                    const stringHTML = this.$refs.markdownEditor.easymde.markdown(content);
                    // get actual html instances
                    const html = parser.parseFromString(stringHTML, 'text/html');
                    const nodes = html.getElementsByTagName('body')[0];
                    // and get the string versions of html elements that we want (those inside the body)
                    const parsedHTML = Array.from(nodes.children).map((htmlPiece) => String(htmlPiece.outerHTML)); // turn the collection into an array
                    return parsedHTML;
                }
            })
                .flat(); // note that one text chunk can come in multiple html elements, so the result of the map operation may be 2D array. gotta flatten that! :D
        },
        async imgURLToData(lessonChunks) {
            // wait for all of the data to be turned to binary data
            return await Promise.all(lessonChunks.map(async (chunk) => {
                const { contentType, content } = chunk;

                if (contentType == 'image') {
                    const link = content;
                    const dataURL =
                        fetch(link)
                            .then(response => response.blob())
                            .then(blob => new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    resolve({ contentType: 'image', content: reader.result });
                                }
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            }));

                    return dataURL;
                }
                return chunk;
            }));
        }
    }
}
//  TODO: make it pretty
</script>


<style scoped>
.flex-container {
    display: flex;
    gap: 1em;
}

.flex-child {
    flex: 1;
}

#lesson-form {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.editor {
    width: 45vw;
}

.lessonChunk {
    overflow-wrap: anywhere;
}

#lessonPreview {
    overflow-wrap: anywhere;
    overflow-y: hidden;
    max-width: 45vw;
}

.render-heading {
    margin-bottom: 0;
}

.preview-content {
    height: 55vh;
    overflow-y: scroll;
    border: 1px solid black;
    padding: 0 1em 1em;
}
</style>
