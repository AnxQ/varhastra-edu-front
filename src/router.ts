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
      path: "/profile/:user_id",
      name: "rank",
      component: () =>
        import(/* webpackChunkName: "profile" */ "@/views/Profile.vue")
    },
    {
      path: "*",
      name: "error",
      component: ErrorPage
    }
  ]
});
