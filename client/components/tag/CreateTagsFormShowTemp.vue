<template>
  <article class="TempTagForm">
    <div id="tagInputContainer">
      Add a tag:
      <input v-model="tagname" id="input" />
      <button v-on:click="addTempTag()">
        Add
      </button>
    </div>

    <div id="tempTagContainer">
      <TempTag v-for="tagname in tagnames" :callback="removeTempTag" :tagname="tagname" :key="tagnames"/>
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
        this.tagnames.push(this.tagname.toLowerCase());
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
    },
    getTagnames() {
      return this.tagnames
    }
  }
}
</script>

<style scoped>
.TempTagForm {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 0;
  margin: 8px 0;

  font-size: 18px;

}

#tempTags {
  /*display: inline-block;*/
  /*display: flex;*/
  /*flex-direction: row;*/
  /*gap: 8px;*/
}

#tagInputContainer {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  /*margin: 0 0 12px 0;*/
}

#tempTagContainer {
  display: flex;
  flex-direction: row;
  gap: 8px
}

#input {
  height: fit-content;
  width: 74px;
  border-radius: var(--round-border-tinytiny);
  border: var(--fuzzy-border);
  border-color: rgba(0, 0, 0, .25);
  padding: var(--text-padding);
}
</style>
