<template>
    <el-input type="button" :click="!display">点我出桌面</el-input>
    <section v-show="display"></section>
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
                display: false
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