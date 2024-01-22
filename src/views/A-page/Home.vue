<template>
    <div class="home">
        <img alt="Vue logo" src="@/assets/images/logo.png" />
        <h1>This is an home page</h1>
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
import { a } from '@/utils';
export default {
    name: 'Home',
    components: {
        HelloWorld: () => import(/* webpackChunkName:"HelloWorld" */ './components/HelloWorld.vue')
    },
    methods: {
        methodB() {
            a();
        }
    }
};
</script>
