<!-- Search for showcase -->

<template>
    <form>
        <input v-model="value" type="text" placeholder='Search by Lesson Name'>
        <button type="submit" v-on:click="submit()">
            submit
        </button>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </form>
</template>
  
<script>
export default {
    name: 'ShowcaseSearchComponent',
    props: {
    },
    data() {
        return { value: '', alerts: {} };
    },
    methods: {
        submit() {
            this.$emit('updateFilter', this.value);
            this.value = "";
        }
    }
};
</script>
  
<style scoped>
form {
    display: flex;
    position: relative;
    padding: 10px 0;
}

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>
  