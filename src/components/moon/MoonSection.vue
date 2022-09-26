<template>
    <input type="radio" name="1" :id="group" :checked="active">
    <label class="card" :for="group" :id="id">
        <div>6666666666</div>
    </label>
</template>

<script>
    import { useCounterStore } from '../stores/counter'
    export default {
        name: "moon section",
        setup() {
            const counterStore = useCounterStore()
            return { counterStore }
        },
        props: {
            'id': {type: Number, required: true},
            'active': {type: Boolean, default: false},
            'order': {type: Number, default: 0},
            'group': {type: String, required: true},
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