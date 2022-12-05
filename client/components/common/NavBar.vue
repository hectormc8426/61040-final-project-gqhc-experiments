<template>
    <nav>
        <div class="left">
            <!-- <img src="../../public/logo.svg"> -->
            <h1 class="title">
                Music Mentors
            </h1>
        </div>
        <div class="right">
            <router-link to="/" class=link>
                Home
            </router-link>
            <router-link to="/lessons">
                Lessons
            </router-link>
            <router-link to="/showcases" class=link>
                Showcases
            </router-link>
            <router-link v-if="$store.state.username" to="/user">
                {{ $store.state.username }}
            </router-link>
            <router-link v-else to="/login" class=link>
                Login
            </router-link>
        </div>
        <section class="alerts">
            <article v-for="(status, alert, index) in $store.state.alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-family: "Lucida Console", "Courier New", monospace;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
    display: flex;
    align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>