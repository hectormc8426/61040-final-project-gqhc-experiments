<template>
    <main>
        <section>
            <h2>
                Your Profile
            </h2>
            <h3> Your Level: {{ $store.state.level }}</h3>

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