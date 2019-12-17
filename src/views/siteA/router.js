import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ './pages/home.vue'),
        },
        {
            path: '/list',
            name: 'list',
            component: () => import(/* webpackChunkName: "list" */ './pages/list.vue'),
        },
    ]
})