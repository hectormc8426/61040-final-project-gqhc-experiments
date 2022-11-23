import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from './NotFound.vue';
import LoginPage from './components/Login/LoginPage.vue';

Vue.use(VueRouter);

const routes = [
  // TODO: Fill the component section -> e.g., make a Vue home page and replace 'None' with it
  { path: '/', name: 'Home', component: /* TODO: Fill THIS IN */ 11111111111 }, // temp value is 11111...1 to not see that red error line :(
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  // Fill this function if we need to!
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({ name: 'Account' }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if ((to.name === 'Account') && !router.app.$store.state.username) {
      next({ name: 'Login' }); // Go to Login page if user navigates to Account/Reflection and are not signed in
      return;
    }
  }
  next();
});

export default router;
