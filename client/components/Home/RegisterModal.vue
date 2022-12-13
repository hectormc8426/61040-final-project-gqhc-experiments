<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
    name: 'RegisterForm',
    mixins: [BlockForm],
    data() {
        return {
            url: '/api/users',
            method: 'POST',
            hasBody: true,
            setUsername: true,
            showClose: true,
            fields: [
                { id: 'username', label: 'Username', value: '' },
                { id: 'password', label: 'Password', value: '' }
            ],
            title: 'Create New Account',
            callback: () => {
                const message = 'Successfully created an account!';
                this.$router.push({ name: 'Home' });
                this.$set(this.alerts, message, 'success');
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            }
        };
    }
};
</script>

<style scoped>
form {
    border: 1px solid #111;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
    border-radius: 10px;
    width: 50vw;
    background-color: var(--primary-color);
}

article>div {
    display: flex;
    flex-direction: column;
}

form>article p {
    margin: 0;
}

form h3,
form>* {
    margin: 0.3em 0;
}

form h3 {
    margin-top: 0;
}

textarea {
    font-family: inherit;
    font-size: inherit;
}

button {
    padding: 5px;
    border: 1px solid;
    border-radius: 5px;
    font-family: inherit;
    font-size: inherit;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>