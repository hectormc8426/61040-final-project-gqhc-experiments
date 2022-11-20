import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  // TODO: Fill the component section -> e.g., make a Vue home page and replace 'None' with it
  {path: '/', name: 'Home', component: /* TODO: Fill THIS IN */ 11111111111}, // temp value is 11111...1 to not see that red error line :(
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  // Fill this function if we need to!

  next();
});

export default router;
