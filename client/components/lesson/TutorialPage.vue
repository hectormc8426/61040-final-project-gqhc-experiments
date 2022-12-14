<template>
    <main>
        <h2>
            Editor Tutorial
        </h2>
        <p>
            Hello there! This is a guide to help you use our editor to make lessons and showcases!
        </p>
        <p>
            The text editor you see in the lesson page uses an alternate version of a markdown editor. Markdown is an
            easy and clean language to format your text. You can treat it simply as a normal text editor, but you can do
            some cool things with it.
        </p>
        <ul>
            <li>
                If you want to bold your text (character, word, sentence, etc.), surround it with two */asterisk
                symbols.
                For example: **hello**
            </li>
            <li>
                If you want to italicize your text (character, word, sentence, etc.), surround it with the underline
                character (_).
                For example: _hello_
            </li>
            <li>
                If you want to make a title, add # (from 1-6) before the text you want to designate as a title (one #
                meaning
                the biggest title there can be and six # meaning the smallest).
            </li>
        </ul>

        <p>
            For more information, visit this link: <a href='https://www.markdowntutorial.com/'> Markdown Tutorial </a>
        </p>


        <p>
            But normal markdown doesn't support videos. So we also have our own rules to accommodate!
        </p>

        <ul>
            <li>
                If you want to embed videos (external links), type: !video:&lt;video link&gt;.
            </li>
            <li>
                If you want to embed images (external links), type: !image:&lt;image link&gt;.
            </li>
            <li>
                Don't include brackets!
            </li>
            <li>
                After each time you embed an image(s) or video(s), <b>make sure to separate it from other elements by
                    typing "---" between it and other elements (other embedded images, videos, or text in general).</b>
            </li>
        </ul>

        <h4>
            Example
        </h4>

        <p>
            Hello this is a lesson text.
        </p>


        <p>
            ---
        </p>

        <p>
            !image:imagelink1
        </p>

        <p>
            ---
        </p>

        <p>
            !video:videolink1
        </p>
    </main>
</template>

<script>

export default {
    name: "TutorialPage",
    data() {
    },
    methods: {
    }
}

</script>


<style scoped>

</style>