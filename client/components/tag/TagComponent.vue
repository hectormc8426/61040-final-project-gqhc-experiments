<!-- This displays a rating object from database -->

<template>
  <article class="tag">
    <div id="tag" v-text="tagname">
    </div>
  </article>
</template>


<script>

export default {
  name: 'TagComponent',
  props: {
    tagname: {
      type: String,
      required: true,
    }
  },
}
</script>


<style scoped>

#tag {
  padding: var(--text-padding);
  background-color: var(--tertiary-color);
  border-radius: var(--round-border-tiny);

  --body-font: Averia Serif Libre
}

</style>
