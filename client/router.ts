import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from './NotFound.vue';
import LoginPage from './components/Login/LoginPage.vue';
import HomePage from './components/Home/HomePage.vue';
import UserPage from './components/user/UserPage.vue';
import ShowcasePage from './components/showcase/ShowcasePage.vue';
import LessonPage from './components/lesson/LessonPage.vue';
import TutorialPage from './components/lesson/TutorialPage.vue';
import LessonComponent from './components/lesson/LessonComponent.vue';
import CreateLessonPage from './components/lesson/CreateLessonPage.vue';

Vue.use(VueRouter);

const routes = [
  // TODO: Fill the component section -> e.g., make a Vue home page and replace 'None' with it
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/user', name: 'User', component: UserPage },
  { path: '/create', name: 'Create', component: CreateLessonPage },
  { path: '/lessons', name: 'Lessons', component: LessonPage },
  { path: '/lessons/:lessonId', name: 'Lesson', component: LessonComponent, props: true },
  { path: '/showcases', name: 'Showcase', component: ShowcasePage },
  { path: '/tutorial', name: 'Tutorial', component: TutorialPage },
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
      next({ name: 'User' }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if ((to.name === 'User') && !router.app.$store.state.username) {
      next({ name: 'Login' }); // Go to Login page if user navigates to Account/Reflection and are not signed in
      return;
    }
  }
  next();
});

export default router;
