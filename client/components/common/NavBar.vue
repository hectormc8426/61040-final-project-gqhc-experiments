<template>
    <nav>
        <div class="left">
            <!-- <img src="../../public/logo.svg"> -->
            <router-link to="/" class=link>
                <h1 class="title">
                    Music Mentors
                </h1>
            </router-link>

            <router-link v-if="$store.state.username" to="/create" class="link">
                Create
            </router-link>

            <div class="verticalLine" />

            <router-link to="/lessons" class="link">
                Search
            </router-link>

            <div class="verticalLine" />

            <router-link v-if="$store.state.username" to="/user" class="link">
                Quests
            </router-link>

        </div>

        <div class="right">
            <!--            <router-link to="/showcases" class=link>-->
            <!--                Showcases-->
            <!--            </router-link>-->
            <router-link v-if="$store.state.username" to="/user" class="link">
                {{ $store.state.username }}
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
    background-color: var(--header-color);
    color: var(--primary-color);
    font-size: 22px;

    display: flex;
    flex-direction: row;

    justify-content: space-between;
    align-items: center;

    position: fixed;
    width: 100%;

    z-index: 99;
}

nav div {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.link {
    color: var(--primary-color);
    text-decoration: none;
}

.link:hover {
    color: var(--tertiary-color);
}

.verticalLine {
    border-left: 2px solid var(--primary-color);
    min-height: 100%;
}

.title {
    font-size: 32px;
    margin: 0 8px;
    padding: 4px 6px;
    border: 2px solid var(--primary-color);
}

.title:hover {
    border-color: var(--tertiary-color);
    -webkit-transition: all ease 1s;
    -moz-transition: all ease 1s;
    transition: all ease 1s;
    cursor: pointer;
}

img {
    height: 32px;
}

.left {
    display: flex;
    align-items: center;
}

.right {
    /*font-size: 20px;*/
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