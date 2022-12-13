<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
    <section class="login">
        <section class="page-content">
            <section class="intro">
                <h2>Welcome to Music Mentors!</h2>
                <p>Learn music alongside a community of people also interested in music. Teach others about music topics
                    you love. Showcase your learning.</p>
                <p>Sign in or create an account to track your progress and create lessons.</p>
            </section>
            <section class="login-forms">
                <LoginForm />
                <button v-on:click="(showRegister = true)" class="create">Create New Account</button>
            </section>
        </section>
        <div v-if="showRegister" class="register-modal">
            <section class="register-form">
                <RegisterModal v-if="showRegister" />
                <i class='fa fa-solid fa-xmark fa-lg exit' v-on:click="(showRegister = false)"></i>
            </section>
        </div>
    </section>
</template>
  
<script>
import RegisterModal from '@/components/Home/RegisterModal.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
    name: 'HomeLoginPage',
    components: {
        RegisterModal,
        LoginForm
    },
    data() {
        return {
            showRegister: false
        }
    }
};
</script>

<style scoped>
section {
    overflow: none;
}

.register-modal {
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);
    /* Black w/ opacity */
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.register-form {
    width: 50vw;
    margin: 15vh auto;
    position: relative;
}


.page-content {
    display: flex;
    justify-content: space-between;
    gap: 1em;
}

.intro {
    display: flex;
    flex-direction: column;
    width: 45vw;
}

.login-forms {
    display: flex;
    flex-direction: column;
    width: 40vw;
}

.exit {
    position: absolute;
    top: 20px;
    right: 15px;
    float: right;
}

.login {
    padding-top: 2em;
}
</style>
  