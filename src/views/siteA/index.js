import { add } from '../../assets/js/utils.js';
import Vue from 'vue';
import router from './router';
import App from './app.vue';

console.log(add(1,2));

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');