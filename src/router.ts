import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ErrorPage from "@/views/ErrorPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "@/views/Login.vue")
    },
    {
      path: "/profile/:user_id?",
      name: "profile",
      component: () =>
        import(/* webpackChunkName: "profile" */ "@/views/Profile.vue")
    },
    {
      path: "/group/:group_id?",
      name: "group",
      component: () =>
        import(/* webpackChunkName: "group" */ "@/views/Group.vue")
    },
    {
      path: "/courses",
      name: "courses",
      component: () =>
        import(/* webpackChunkName: "courses" */ "@/views/Courses.vue")
    },
    {
      path: "/course/:course_id",
      name: "course",
      component: () =>
        import(/* webpackChunkName: "course" */ "@/views/Course.vue")
    },
    {
      path: "*",
      name: "error",
      component: ErrorPage
    }
  ]
});
