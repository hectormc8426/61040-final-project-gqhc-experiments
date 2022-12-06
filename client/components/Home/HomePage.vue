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
            <header>
                <h2>Welcome to Music Mentors!</h2>
            </header>
            <article>
                <h3>
                    <router-link to="/login" class="sign-in">
                        Sign in
                    </router-link>
                    to track your progress and make lessons.
                </h3>
            </article>
        </section>
    </main>
</template>

<script>
export default {
    name: 'HomePage'
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