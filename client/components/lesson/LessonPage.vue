<template>
    <div>
        <section v-if="$store.state.username">
            <header>
                <h2>Welcome @{{ $store.state.username }}</h2>
            </header>

            <div>
            <CreateLessonForm ref="lessonForm" />
            </div>

            <h2>Lessons by others</h2>


            <div id="lessonList" class="flex-container">
                <section id="lessonList" class="flex-container">
                    <div v-if="loading">
                        <div class="loader"></div>
                    </div>

                    <div v-else>
                    <div v-for="lesson in $store.state.lessons" :key="lesson._id" class="one-lesson">
                        <LessonComponent :lesson="lesson" class="lessonClass" />
                        <div v-for="category in categories" id="ratingBlock">
                        <RatingComponent :score="ratings[lesson._id][category]" :category="category" />
                        <CreateRatingForm :contentId="lesson._id" :category="category"/>
                        </div>
                    </div>
                    </div>
                </section>
            </div>

            <div v-if="!loading" id="ratingList">
                <div v-for="rating in ratings">
                    <RatingComponent :rating=rating />
                </div>
            </div>
        </section>

        <section v-else>
            <header>
                <h2>Welcome to Music Mentors!</h2>
            </header>
            <article>
                <h3>
                <router-link to="/login">
                    Sign in
                </router-link>
                to create, edit, and delete freets.
                </h3>
            </article>
        </section>

    </div>
</template>

<script>

import CreateLessonForm from './CreateLessonForm.vue';
import LessonComponent from './LessonComponent.vue';

import markdownMixin from '@/components/common/markdownMixin.js';
import RatingComponent from "../rating/RatingComponent";
import CreateRatingForm from "../rating/CreateRatingForm";

export default {
    name: "LessonPage",
    components: { CreateRatingForm, RatingComponent, CreateLessonForm, LessonComponent },
    mixins: { markdownMixin },
    data() {
        return {
            title: "",
            content: "",
            parsedHTML: [],
            loading: false,
            lessons: [],
            easymde: null,
            categories: ['Clarity', 'Accuracy', 'Engaging'],
            ratings: {} // dicts of dicts, rating[lessonId][category] = score
        };
    },
    created() {
        // let's get our freets
        this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            const r = await fetch('api/lessons/');
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.lessons = res;

            // now that we have lessons, get their corresponding scores in each category
            for (let i=0; i<this.lessons.length; i++) {
              const lessonId = this.lessons[i]._id;
              let rating = {}; // category : score

              for (let j=0; j<3; j++) {
                const category = this.categories[j];
                const a = await fetch(`api/rating/${lessonId}?category=${category}`);
                const b = await a.json();
                rating[category] = b['score'];
              }

              this.ratings[lessonId] = rating;
            }

            this.loading = false;
        },
        async preview() {
            // accessing the text content within the markdown editor
            this.content = String(this.$refs.markdownEditor.$data.content);
            // let's preprocess our text
            const lessonChunks = this.format();
            // then actually push it to the server
            this.imgURLToData(lessonChunks).then((lessonChunks2) => console.log("result2: " + lessonChunks2));
            // with the text broken down, let's compile each lesson chunk into the appropriate html
            this.parsedHTML = this.parse(lessonChunks).flat(3);
        },
        // parse(lessonChunks) {
        //     // this is to grab each individual html pieces from the chunks and return them in one list
        //     const parser = new DOMParser(); // a parser to turn a html string to html element
        //     return lessonChunks.map((chunk) => { // for each chunk
        //         const { contentType, content } = chunk; // grab the type and content
        //         if (contentType == 'video') { // if we are dealing with a video
        //             const link = content;
        //             const tokens = link.split(/v=/); // get the link and process it
        //             const videoId = tokens[tokens.length - 1]; // get the video token
        //             // TODO: this is a gross hard code, but I'll edit it later
        //             const stringHTML = '<iframe width="560" height="315" ' +
        //                                 `src="https://www.youtube.com/embed/${ videoId }" ` +
        //                                 'title="YouTube video player" frameborder="0" ' +
        //                                 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        //                                 'allowfullscreen></iframe>';
        //             // turn our html string to actual htmls (this comes in form <head></head><body>[ACTUAL CONTENT WE WANT]</body>)
        //             const html = parser.parseFromString(stringHTML, 'text/html');
        //             // let's grab what we actually want inside the html nbody
        //             const nodes = html.getElementsByTagName('body')[0];
        //             const parsedHTML = Array.from(nodes.children)[0].outerHTML; // turn the collection into an array
        //             const htmlInString = String(parsedHTML);
        //             return htmlInString;
        //         } else if (contentType == 'image') {
        //             const link = content;
        //             const markdownForm = "![imgX](" + link + ")";
        //             const stringHTML = this.$refs.markdownEditor.easymde.markdown(markdownForm);
        //             const html = parser.parseFromString(stringHTML, 'text/html');
        //             const nodes = html.getElementsByTagName('body')[0];
        //             const imageHTML = Array.from(nodes.children)[0];
        //             return String(imageHTML.outerHTML);
        //         } else { // then it must be text (it's safe this way too lol)
        //             // for text, we actually want to convert them using markdown rules/effects
        //             const stringHTML = this.$refs.markdownEditor.easymde.markdown(content);
        //             // get actual html instances
        //             const html = parser.parseFromString(stringHTML, 'text/html');
        //             const nodes = html.getElementsByTagName('body')[0];
        //             // and get the string versions of html elements that we want (those inside the body)
        //             const parsedHTML = Array.from(nodes.children).map((htmlPiece) => String(htmlPiece.outerHTML)); // turn the collection into an array
        //             return parsedHTML;
        //         }
        //     })
        //     .flat(); // note that one text chunk can come in multiple html elements, so the result of the map operation may be 2D array. gotta flatten that! :D
        // },
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
}

.flex-child {
    flex: 1;
}

.loader {
    border: 16px solid #f3f3f3;
    /* Light grey */
    border-top: 16px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

#ratingBlock {
  display: inline-block;
  margin: 8px 24px;
}


.one-lesson {
    border: 1px solid black;
}
</style>
