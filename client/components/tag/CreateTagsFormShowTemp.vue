<template>
  <article class="TempTagForm">
    <div id="tagInput">
      Add a tag:
      <input v-model="tagname" id="input" />
      <button v-on:click="addTempTag()">
        Add
      </button>
    </div>

    <div v-for="tagname in tagnames" id="tempTags">
      <TempTag :tagname="tagname" :callback="removeTempTag" />
    </div>

  </article>
</template>

<script>
import TempTag from "./TempTag";

export default {
  name: "CreateTagsFormShowTemp",
  components: { TempTag },
  props: {
    callback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      tagname: '',
      tagnames: []
    }
  },
  methods: {
    addTempTag() {
      if (this.tagname !== '' && !this.tagnames.includes(this.tagname)) {
        this.tagnames.push(this.tagname);
      }
      this.tagname = '';
    },
    removeTempTag(tagname) {
      const index = this.tagnames.indexOf(tagname);
      this.$delete(this.tagnames, index);
    },
    async submit(contentId) {
      const url = `api/tag/${contentId}`;

      for (let i = 0; i < this.tagnames.length; i++) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagname: this.tagnames[i] })
        };
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.error);
        }
      }
    }
  }
}
</script>

<style scoped>
.tempTagForm {
  display: block;
}

#tempTags {
  display: inline-block;
}

#tagInput {
  display: inline-block;
  margin: 0 0 12px 0;
}

#input {
  width: 74px;
}
</style>
