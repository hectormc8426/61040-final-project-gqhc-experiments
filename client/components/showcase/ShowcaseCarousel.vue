<template>
    <section>
        <flickity class="flickity card" ref="flickity" :options="flickityOptions">
            <PerLessonShowcaseComponent class="carousel-cell" v-for="showcase in showcases" :showcase="showcase"
                :key="showcase._id" />
        </flickity>
    </section>
</template>

<script>
import Flickity from 'vue-flickity'
import PerLessonShowcaseComponent from '@/components/showcase/PerLessonShowcaseComponent'


export default {
    name: 'ShowcaseCarousel',
    components: {
        Flickity, PerLessonShowcaseComponent
    },
    props: {
        showcases: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            flickityOptions: {
                prevNextButtons: this.showcases.length > 1,
                wrapAround: true,
                draggable: false,
                // any options from Flickity can be used
            }
        }
    }
}</script>

<style>
section {
    overflow: auto;
}

.flickity {
    border: 1px solid black;
    overflow: scroll;
    height: 50vh;
}

.flickity-button {
    position: sticky;
    bottom: 5em;
    opacity: .2;
    background-color: rgba(255, 255, 255, .5)
}

.flickity-button:hover {
    opacity: 1;
}

.flickity-button.previous {
    left: 20px;
}

.flickity-button.next {
    right: 20px;
    float: right;
}

.flickity-page-dots {
    position: sticky;
    bottom: 10px;
}
</style>