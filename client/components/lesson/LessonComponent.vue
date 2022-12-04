<template>
    <article
        class="lesson"
    >
        <header>
            <h2>
                {{ lesson.title }}
            </h2>
            <h3 class="author">
                by {{ lesson.userId }}
            </h3>
        </header>

        <div v-if="truthy">
            
            <button v-on:click='check'>
                check
            </button>
        </div>
        <div v-else>
            
        </div>

        <div>
            {{ lesson.content }}

        </div>

        <p class="info">
            Posted at {{ lesson.dateModified }}
        </p>
    </article>
</template>

<script>

import MarkdownEditor from '@/components/common/MarkdownEditor.vue';
import { Parser } from '../../../node_modules/marked/src/Parser';

export default {
    name: 'LessonComponent',
    data() {
        return {
            truthy: true,
        }
    },
    props: {
        // Data from the stored freet
        lesson: {
            type: Object,
            required: true
        }
    },
    created() {
        
    },
    computed: {

    },
    methods: {
        check() {
            

            // console.log(this.lesson.content);
            console.log('content' + this.lesson.content[0].content)
            console.log(Parser.parse(this.lesson.content[0].content));
            // console.log('parsing: ' + this.$store.state.markdown.easymde.markdown(this.lesson.content[0].content));
            // console.log(this.parse(this.lesson.content))
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
                                        `src="https://www.youtube.com/embed/${ videoId }" ` +
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
                    // const link = content;
                    // const markdownForm = "![imgX](" + link + ")";
                    // const stringHTML = this.$store.state.markdown(markdownForm);
                    // const html = parser.parseFromString(stringHTML, 'text/html');
                    // const nodes = html.getElementsByTagName('body')[0];
                    // const imageHTML = Array.from(nodes.children)[0];
                    // return String(imageHTML.outerHTML);
                } else { // then it must be text (it's safe this way too lol)
                    // for text, we actually want to convert them using markdown rules/effects
                    const stringHTML = this.$store.state.markdown(content);
                    // get actual html instances
                    const html = parser.parseFromString(stringHTML, 'text/html');
                    const nodes = html.getElementsByTagName('body')[0];
                    // and get the string versions of html elements that we want (those inside the body)
                    const parsedHTML = Array.from(nodes.children).map((htmlPiece) => String(htmlPiece.outerHTML)); // turn the collection into an array
                    return parsedHTML;
                }
            })
            .flat(); // note that one text chunk can come in multiple html elements, so the result of the map operation may be 2D array. gotta flatten that! :D
        }
    }
};
</script>

<style scoped>

</style>