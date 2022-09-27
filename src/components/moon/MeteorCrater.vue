<template>
    
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
            'position': {
                type: Object,
                default: function () {
                    return {x: 0, y: 0}
                }
            },
            'size': Object,
            'fontSize': {type: Number, default: 1},
            "visibility":{type:Boolean, default: true}

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