<template>
  <div id="scene">
    <div class="layer" data-depth="0.2">My first Layer!</div>
    <div class="layer" data-depth="0.6">My second Layer!</div>
    <spen data-depth="0.9">测试</spen>
  </div>
</template>

<script>
import Parallax from 'parallax-js'
import { useCounterStore } from '../stores/counter'
export default {
  name: "Login",
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
      position: function () {
        return {x: 0, y: 0}
      },
      focusMax : false

    }
  },
  mounted(){
    new Parallax(document.getElementById("scene"));
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
  #scene {
      width: 800px;
      height: 600px;
      margin: 200px auto;
      background: #333;
  }
  .aaa{
    border: 1px solid red;
    // display: block;
  }
  .layer{
    border: 1px solid red;
    // display: block;
  }
</style>