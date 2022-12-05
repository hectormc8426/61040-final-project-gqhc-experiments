import Vue from "vue";
import { marked } from "marked"; // EasyMDE uses the marked package to render, so use that directly instead of through the component

const markdownMixin = Vue.mixin({
  methods: {
    async preview() {
      // accessing the text content within the markdown editor
      this.content = String(this.$refs.markdownEditor.$data.content);
      // let's preprocess our text
      const lessonChunks = this.format();
      // then actually push it to the server
      this.imgURLToData(lessonChunks).then((lessonChunks2) =>
        console.log("result2: " + lessonChunks2)
      );
      // with the text broken down, let's compile each lesson chunk into the appropriate html
      this.parsedHTML = this.parse(lessonChunks).flat(3);
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
          type = "video";
          const tokens = trimmed.split(/!video:/);
          content = tokens[tokens.length - 1].trim();
        } else if (/!image:/.test(trimmed)) {
          // if this is an image
          type = "image";
          const tokens = trimmed.split(/!image:/);
          content = tokens[tokens.length - 1].trim();
        } else {
          // else, then it must be text (or let's treat it so)
          type = "text";
          content = String(trimmed);
        }
        // and let's format it for our mongodb schema (not dealing with collection/router/etc rn since I need to get image working)
        return {
          contentType: type,
          content: content,
        };
      });
      return chunks;
    },
    parse(showcaseChunks) {
      // this is to grab each individual html pieces from the chunks and return them in one list
      const parser = new DOMParser(); // a parser to turn a html string to html element
      return showcaseChunks
        .map((chunk) => {
          // for each chunk
          const { contentType, content } = chunk; // grab the type and content
          if (contentType == "video") {
            // if we are dealing with a video
            const link = content;
            const tokens = link.split(/v=/); // get the link and process it
            const videoId = tokens[tokens.length - 1]; // get the video token
            // TODO: this is a gross hard code, but I'll edit it later
            const stringHTML =
              '<iframe width="560" height="315" ' +
              `src="https://www.youtube.com/embed/${videoId}" ` +
              'title="YouTube video player" frameborder="0" ' +
              'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
              "allowfullscreen></iframe>";
            // turn our html string to actual htmls (this comes in form <head></head><body>[ACTUAL CONTENT WE WANT]</body>)
            const html = parser.parseFromString(stringHTML, "text/html");
            // let's grab what we actually want inside the html nbody
            const nodes = html.getElementsByTagName("body")[0];
            const parsedHTML = Array.from(nodes.children)[0].outerHTML; // turn the collection into an array
            const htmlInString = String(parsedHTML);
            return htmlInString;
          } else if (contentType == "image") {
            const link = content;
            const markdownForm = "![imgX](" + link + ")";
            const stringHTML = marked.parse(markdownForm);
            const html = parser.parseFromString(stringHTML, "text/html");
            const nodes = html.getElementsByTagName("body")[0];
            const imageHTML = Array.from(nodes.children)[0];
            return String(imageHTML.outerHTML);
          } else {
            // then it must be text (it's safe this way too lol)
            // for text, we actually want to convert them using markdown rules/effects
            const stringHTML = marked.parse(content);
            // get actual html instances
            const html = parser.parseFromString(stringHTML, "text/html");
            const nodes = html.getElementsByTagName("body")[0];
            // and get the string versions of html elements that we want (those inside the body)
            const parsedHTML = Array.from(nodes.children).map((htmlPiece) =>
              String(htmlPiece.outerHTML)
            ); // turn the collection into an array
            return parsedHTML;
          }
        })
        .flat(); // note that one text chunk can come in multiple html elements, so the result of the map operation may be 2D array. gotta flatten that! :D
    },
    async imgURLToData(chunks) {
      // wait for all of the data to be turned to binary data
      return await Promise.all(
        chunks.map(async (chunk) => {
          const { contentType, content } = chunk;

          if (contentType == "image") {
            const link = content;
            const dataURL = fetch(link)
              .then((response) => response.blob())
              .then(
                (blob) =>
                  new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      resolve({ contentType: "image", content: reader.result });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  })
              );

            return dataURL;
          }
          return chunk;
        })
      );
    },
  },
});

export default markdownMixin;
