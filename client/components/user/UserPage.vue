<template>
    <main>
        <section>
            <h2>
                Your Profile
            </h2>
            <h3> Music Coins: {{ $store.state.coins }}</h3>

            <h3> Cosmetics </h3>
            <p> [Default Profile Cosmetic]</p>
            <p> [Default Background Cosmetic]</p>
            <p> [Default Banner Cosmetic]</p>

        </section>
        <AccountInfo />
        <LogoutForm />
    </main>
</template>

<script>
import AccountInfo from '@/components/user/AccountInfo.vue';
import LogoutForm from '@/components/user/LogoutForm.vue';

export default {
    name: 'UserPage',
    components: { AccountInfo, LogoutForm }
}
</script>