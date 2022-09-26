<template>
    <transition name="fade">
        <div id="scene">
            <!-- <div v-bind:style="cStyle" v-draggable:onPositionMouseMove class="layer">My first Layer!</div>
            <div v-bind:style="cStyle" v-draggable:onPositionMouseMove class="layer">My second Layer!</div>
            <spen v-bind:style="cStyle" v-draggable:onPositionMouseMove class="aaa">测试</spen> -->
            <div class="slide-fwd-center" v-bind:style="cStyle" v-moon:onPositionMouseMove>66666666666</div>
            {{position}}
        </div>
    </transition>
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
                position: {x: 150, y: 150},
                focusMax : false,
                dragging: true
            }
        },
        mounted(){
        },
        computed: {
            cStyle () {
                var style = {}
                if (this.position) {
                    style.left = `${this.position.x}px`
                    style.top = `${this.position.y}px`
                }
                //显示大小
                // if (this.cardSize) {
                //   style.width = `${this.cardSize.w}px`
                //   style.height = `${this.cardSize.h}px`
                // }
                //层级
                // style.zIndex = this.order
                return style
            }
        },
        methods: {

        },
        created() {

        },
        directives: {
            moon: moon
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