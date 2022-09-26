<template>
    陨石坑，一个坑一个桌面
</template>

<script>
    import { useCounterStore } from '../stores/counter'
    export default {
        name: "meteor crater",
        setup() {
            const counterStore = useCounterStore()
            return { counterStore }
        },
        props: {
            'id': {type: Number, required: true},
            'active': {type: Boolean, default: false},
            'order': {type: Number, default: 0},
            'content': String,
            'title': String,
            'text': String,
            'type': String,
            'background' : Object
        },
        data() {
            return {


            }
        },
        mounted(){

        },
        components: {

        },
        methods: {

        },
        created() {

        }
    }
</script>

<style scoped lang="scss">


</style>