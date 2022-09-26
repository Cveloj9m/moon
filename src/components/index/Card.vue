/**
 * Card component, for each individual card in a board
 */
<template>
  <!-- <transition name="el-fade-in-linear"> -->
      <div class="card" v-show="visibility" v-bind:class="nClass" v-bind:style="cStyle" v-draggable:onPositionMouseMove
       @click.stop="" @mousedown="focusMax = true;" @mouseup="focusMax = false;" @keyup.esc="removeCard">
        <div v-bind:class="{ focusMaxClass: focusMax }"></div>
        <div>
          <div class="card-title">
              <span>{{title}}</span>
              <span>
                <el-button icon="el-icon-close" @click="close('close')" class="card-button-red"></el-button>
                <el-button icon="el-icon-full-screen" @click="close('max')" class="card-button"></el-button>
                <el-button icon="el-icon-minus" @click="close('min')" class="card-button"></el-button>
              </span>
          </div>
          <div>
            <iframe 
                :src="url" frameborder="0" v-bind:style="iframe" scrolling="yes"
                @load='loadfrom'>
            </iframe>
          </div>
          <div v-show="active" class="card-resize-handle" @mousedown="focusMax = true" @mouseup="focusMax = false" v-draggable:onSizeMouseMove></div>
        </div>
    </div>
  <!-- </transition> -->
</template>

<script>
// import { defineAsyncComponent } from 'vue'
// import { View } from `@/views/${global.componentTemp}.vue`

export default {
  name: 'custom-card',

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
    'cardSize': Object,
    'fontSize': {type: Number, default: 1},
    'votes': {type: Number, default: 0},
    'routeCard': Object,
    "visibility":{type:Boolean, default: true},
    "pid": Number

  },

  data: function () {
    return {
      dragging: false, stateContent: this.content, html: this,
      positionTemp:{}, sizeTemp:{},
      url: this.routeCard.path,

      focusMax:false
    }
  },
  created() {
    // this.componentTemp = this.routeCard.component;
    // this.choiceRoute(this.routeCard);
  },
  components:{
    // View: defineAsyncComponent(() => import(`@/views/${global.componentTemp}.vue`))
    // View: () => import(`@/views/${global.componentTemp}.vue`)
  },
  computed: {
    cStyle () {
      var style = {}
      if (this.position) {
        style.left = `${this.position.x}px`
        style.top = `${this.position.y}px`
      }
      if (this.cardSize) {
        style.width = `${this.cardSize.w}px`
        style.height = `${this.cardSize.h}px`
      }
      style.zIndex = this.order

      return style
    },
    nClass () {
      var output = {}
      output.active = this.active
      output.dragging = this.dragging
      output[this.type] = true
      return output
    },
    iframe(){
      var iframeS = {}
      iframeS.position= "relative";
      iframeS.left= "0";
      iframeS.right= "0";
      iframeS.top= "0";
      iframeS.bottom= "0";
      iframeS.height = `${this.cardSize.h - 43}px`
      iframeS.width= "100%";
      iframeS.background= "#fff";
      iframeS.overflowY= "auto";
      iframeS.zIndex= "0";
      return iframeS;
    }
  },
  methods: {
    loadfrom (val) {
      
    },
    onPositionMouseMoveStart () {
      this.$emit('start-drag', this.id)
    },
    onPositionMouseMoveStop() {
      this.dragging = false
      this.$emit('stop-drag', this.id)
    },
    onPositionMouseMove(d) {
      if (Math.abs(d.dx) > 0 || Math.abs(d.dy) > 0) {
        this.dragging = true
      } else {
        this.dragging = false
        return
      }
      let newX, newY, position
      newX = this.position.x + d.dx
      newY = this.position.y + d.dy
      position = {x: newX, y: newY}

      if (this.cardSize.w == document.documentElement.clientWidth && this.cardSize.h == document.documentElement.clientHeight){var cardSize = {w: 800, h: 550};this.$emit('update', this.id, { cardSize: cardSize })}

      this.$emit('update', this.id, { position: position })
    },
    onSizeMouseMove(d) {
      var newW = this.cardSize.w + d.dx
      var newH = this.cardSize.h + d.dy

      if (newW < 200) { newW = 200 }
      if (newH < 150) { newH = 150 }

      var cardSize = {w: newW, h: newH}
      this.$emit('update', this.id, { cardSize: cardSize })
    },
    openAlert(func, text) {
      // const h = this.$createElement;
      this.$message({
        showClose: true,
        message: (func + text)
      });
    },
    close(type){
        if(type == "min")
            this.$emit('min-card', this.id, type)
        else if(type == "max"){
            let windowsWidth = document.documentElement.clientWidth;
            let windowsHeight = document.documentElement.clientHeight;
            if(windowsWidth - this.cardSize.w <= 0  && windowsHeight - this.cardSize.h <= 0 ){
                this.$emit('update', this.id, { position: this.positionTemp })
                this.$emit('update', this.id, { cardSize: this.sizeTemp })
            } else {
                this.positionTemp = this.position;
                this.sizeTemp = this.cardSize;
                let cardSize = {w: windowsWidth, h: windowsHeight}
                let position = {x: 0, y: 0}
                this.$emit('update', this.id, { position: position })
                this.$emit('update', this.id, { cardSize: cardSize })
            }
        }else if(type == "close")
            this.$emit('close-card', this.id, type)
    }
  },
  watch: {
    /** listen to input field with content, emit event when changed **/
    // stateContent (newText, oldText) {
    //   if (newText !== oldText) {
    //     this.$emit('update', this.id, {text: newText})
    //   }
    // }
  },
  directives: {
    draggable: {
      isFn: true,
      acceptStatement: true,
      beforeMount (el, binding) {
        var MouseMove = function (e)   {
          var start, dx, dy, data
          start = this.start
          dx = e.pageX - start.x
          dy = e.pageY - start.y
          data = {dx: dx, dy: dy}

          if (e.buttons === 0) {
            this.onMouseUp()
            return
          }

          // only dispatch relative data for now
          if (this.prev) {
            data.dx -= this.prev.dx
            data.dy -= this.prev.dy
          }
          this.prev = {dx: dx, dy: dy}
          // ------------------------------------------------------
          if(binding.arg == 'onPositionMouseMove'){
            binding.instance.onPositionMouseMove(data)
          }else if (binding.arg == 'onSizeMouseMove'){
            binding.instance.onSizeMouseMove(data)
          }
          e.stopImmediatePropagation()
        }

        var MouseDown = function (e) {
          this.start = {
            x: e.pageX,
            y: e.pageY
          }
          // ------------------------------------------------------
          if(binding.arg == 'onPositionMouseMove'){
            binding.instance.onPositionMouseMoveStart()
          }
          window.addEventListener('mousemove', this.onMouseMove)
          e.stopImmediatePropagation()
        }

        var MouseUp = function () {
          this.prev = null
          window.removeEventListener('mousemove', this.onMouseMove)
          // ------------------------------------------------------
          if(binding.arg == 'onPositionMouseMove'){
            binding.instance.onPositionMouseMoveStop()
          }
        }

        // 做准备工作
        // 例如，添加事件监听器或其他昂贵的东西  
        // 这只需要运行一次
        el.start = {x: 0, y: 0}
        el.onMouseMove = MouseMove.bind(el)
        el.onMouseDown = MouseDown.bind(el)
        el.onMouseUp = MouseUp.bind(el)

        el.addEventListener('mousedown', el.onMouseDown)
        el.addEventListener('mouseup', el.onMouseUp)

        if (!binding.arg) {
          throw new Error('没有定义回调')
        }
      },

      unmounted (el) {
        // 做清洁工作
        // 例如移除bind()中添加的事件监听器
        el.removeEventListener('mousedown', el.onMouseDown)
        el.removeEventListener('mouseup', el.onMouseUp)
        window.removeEventListener('mousemove', el.onMouseMove)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/index/scss/variables.scss';
.focusMaxClass{
  margin-top: 40px;
  width:100%;
  height:100%;
  // border: 1px solid red;
  position: absolute;
  z-index: 100;
  user-select: none;
  // background: black;
}
.card {
  background-color: $white;
  position: fixed;
  border-radius: 3px;
  border: none;
  border-bottom: 1px solid $gold;
  box-shadow: 0px 0px 5px $shadow;
  transition: box-shadow 0.5s, transform 0.25s;
  cursor: -webkit-grab;
  &.improvement {
    background-color: $red;
  }
  &.neutral {
    background-color: $neutral-grey;
  }
  &.positive {
    background-color: $green;
  }
  &.cardWindow {
    background-color: rgb(158, 152, 152);
  }
  &.dragging {
    box-shadow: 0px 0px 20px $shadow;
    transform: scale(1.05);
    cursor: -webkit-grabbing;
  }
  &.active {
    box-shadow: 0px 0px 20px $blue;
  }
  .card-title{
    user-select: none;
    line-height: 40px;
    height: 40px;
  }
  .card-title span{
    margin-left: 2%;
  }
  .card-button {
    margin: 0;
    padding: 0;
    float: right;
    border: none;
    background-color: transparent;
    font-size: 1.5em;
    width: 45px;
    cursor: pointer;
    font-size: 1em;
    box-shadow: none;
  }
  .card-button-red {
    margin:0;
    padding: 0;
    float: right;
    border: none;
    background-color: transparent;
    font-size:1.5em;
    width: 45px;
    cursor: pointer;
    font-size: 1em;
    box-shadow: none;
  }
  .card-button-red:hover{
    background-color: rgb(185, 75, 75);
  }

  .card-votes {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 5px;
      height: auto;
  }

  .card-vote {
      width: 1em;
      height: 1em;
      border-radius: 100%;
      background-color: $ocean;
      display: inline-block;
      margin-right: 0.5em;
  }

  .card-resize-handle {
    position: absolute;
    bottom: 0;
    right:  0;
    width:  25px;
    height: 25px;
    cursor: se-resize;
    background-color: rgba(0,0,0,0.1);
    z-index: 101;
  }
}

@media screen and (max-width: 768px) {
  .card {
    position: fixed;
    height: auto !important;
    width: 100% !important;
    margin: 0.5em 0;

    .card-votes {
      position: static;
      margin: 0.5em;
    }
    button.card-button {
      display: none;
    }
    &:last-child {
      margin-bottom: 3em;
    }
  }

}
/*- scrollbar -*/
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
::-webkit-scrollbar-thumb{
    background-color: #999;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
::-webkit-scrollbar-thumb:vertical:hover{
    background-color: #666;
}
::-webkit-scrollbar-thumb:vertical:active{
    background-color: #333;
}
::-webkit-scrollbar-button{
    display: none;
}
::-webkit-scrollbar-track{
    background-color: #f1f1f1;
}
</style>
