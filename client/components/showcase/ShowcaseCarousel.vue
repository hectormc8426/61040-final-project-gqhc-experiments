<template>
    <section>
        <flickity class="flickity" ref="flickity" :options="flickityOptions">
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
                prevNextButtons: true,
                wrapAround: true,
                draggable: false,
                // any options from Flickity can be used
            }
        }
    }
}</script>

<style scoped>
.flickity {
    border: 1px solid black;
    overflow: scroll;
    max-height: 50vh;
}

.flickity-page-dots {
    position: absolute;
    bottom: 10px;
}
</style>