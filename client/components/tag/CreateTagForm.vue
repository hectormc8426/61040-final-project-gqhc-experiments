<template>
  <article class="ratingForm">

    <div id="tag">
      Add a tag:
      <input v-model="tagname"/>
      <button v-on:click="submit()"/>
    </div>

  </article>
</template>

<script>

export default {
  name: "CreateRatingForm.vue",
  props: {
    contentId: '',
  },
  data() {
    return {
      tagname: '',
    }
  },
  methods: {
    async submit() {
      const url = `api/tag/${this.contentId}`;
      const tagname = this.tagname;

      const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagname })
      };
      const response = await fetch(url, requestOptions);
      this.tagname = '';  // reset field

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error);
      }
    }
  }
}
</script>

<style scoped>

#tag {
  display: inline-block;
}
</style>
