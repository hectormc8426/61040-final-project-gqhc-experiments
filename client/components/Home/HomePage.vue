<template>
    <main>
        <section v-if="$store.state.username">
            <header>
                <h2>Welcome @{{ $store.state.username }}</h2>
            </header>
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

// console.log(this.$store);
</script>