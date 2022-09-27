<template>
    
</template>

<script>
    import { useCounterStore } from '../stores/counter'
    import { moon } from '../stores/moon/moon'
    export default {
        name: "Login",
        setup() {
            const counterStore = useCounterStore()
            return { counterStore }
        },
        data() {
            return {
                
            }
        },
        mounted(){
        },
        computed: {
            
        },
        methods: {

        },
        created() {

        },
        directives: {
            
        }
    }
</script>

<style scoped lang="scss">
    #scene {
        width: 1200px;
        height: 100vh;
        margin: 200px auto;
        background: #333;
    }
    .aaa{
        border: 1px solid red;
        display: block;
        position: absolute;
    }
    .layer{
        border: 1px solid red;
        width: 100px;
        position: absolute;
    // display: block;
    }
    .slide-fwd-center {
        width: 200px;
        height: 200px;
        position: absolute;
        background-color: #666;
        border: 1px solid red;
        -webkit-animation: slide-fwd-center 2s linear ;
        animation: slide-fwd-center 2s linear ;

    }
    @-webkit-keyframes slide-fwd-center {
        0% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        100% {
            -webkit-transform: translateZ(160px);
            transform: translateZ(160px);
        }
    }
    @keyframes slide-fwd-center {
        0% {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        100% {
            -webkit-transform: translateZ(160px);
            transform: translateZ(160px);
        }
    }
</style>