<!-- The intent is that these show the tags user currently has selected for their lesson
 They also have the option to remove this tag before selecting it-->

<template>
  <article class="tempTag">
    <button id="tag" v-text="tagname" v-on:click="callback(tagname)">
    </button>
  </article>
</template>

<script>
export default {
  name: "TempTag.vue",
  props: {
    tagname: {
      type: String,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
