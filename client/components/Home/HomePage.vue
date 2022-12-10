<template>
    <main>
        <section v-if="$store.state.username">
            <header>
                <h2>Welcome @{{ $store.state.username }}</h2>
            </header>
            <section class="links">
                <router-link to="/create" class="link">
                    <div class="home-option">Create A Lesson!</div>
                </router-link>
                <router-link to="/lessons" class="link">
                    <div class="home-option">View All Lessons!</div>
                </router-link>
            </section>
        </section>
        <section v-else>
            <HomeLoginPage />
        </section>
    </main>
</template>

<script>
import HomeLoginPage from '@/components/Home/HomeLoginPage.vue';

export default {
    name: 'HomePage',
    components: { HomeLoginPage }
}

</script>

<style>
.links {
    display: flex;
    gap: 1em;
}

.home-option {
    border: 1px solid black;
    border-radius: 5px;
    padding: 2em;
}
</style>