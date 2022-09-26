<template>
  <transition name="el-fade-in-linear">
    <div id="smallCard">
        <span @click="loadCard(id)" class="title">
            {{title}}
        </span>
        <div @click="loadCard(id)" class="card">
          <svg viewBox="0 0 4000 350"  class="wave wave--back">
            <path :d="d3" fill-opacity="0.3"/>
          </svg>
          <svg viewBox="0 0 4000 350"  class="wave wave--middle">
            <path :d="d2"  fill-opacity="0.5"/>
          </svg>
          <svg viewBox="0 0 4000 350"  class="wave wave--front">
            <path :d="d1"/>
          </svg>
        </div>
        <i @click="colse(id)" class="el-icon-close"></i>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'taskbar',

  props: {
    'id': {type: Number, required: true},
    'title': {type: String, default: "标签"}
  },

  data: function () {
    return {
      d1: '',
      d2: '',
      d3: ''
    }
  },
  created() {  
    const dotsFront = this.dotsCalc(5)
    const dotsMiddle = this.dotsCalc(5, 100, 250)
    const dotsBack = this.dotsCalc(5, 170, 230)

    this.d1 = this.pathCalc(dotsFront)
    this.d2 = this.pathCalc(dotsMiddle)
    this.d3 = this.pathCalc(dotsBack)
  },
  components:{
  },
  computed: {

  },
  methods: {
    loadCard (id) {
      this.$emit('show-card', id)
      // this.$message("打开失败，我还没开发")
    },
    colse(id){
      // event.stopPropagation;
      this.$emit('close-card', id)
      // this.$message("关闭失败，我还没开发")
    },
    /**
     * @summary 贝塞尔曲线计算
     * @param {number} sx 起始 x 点坐标
     * @param {number} sy 起始 y 点坐标
     * @param {number} fx 控制点 x 坐标偏移
     * @param {number} ex 结束 x 点坐标
     * @param {number} ey 结束 y 点坐标
     */
    curveCalc(sx, sy, fx, ex, ey) {
      // 死点
      if (fx === 0) return `C${sx} ${sy}, ${sx} ${sy}, ${sx} ${sy} `
      // 加入随机数左右曲率
      const xGap = (ex - sx) * 0.02

      const x1 = Number(sx + fx + _pm() * xGap)
      const y1 = sy

      const x2 = Number(x1 + _pm() * xGap).toFixed(2)
      const y2 = ey.toFixed(2)

      return `C${x1.toFixed(2)} ${y1}, ${x2} ${y2}, ${ex} ${ey} `
    },

    /**
     * @summary 路径 d 属性生成器
     * @param {array} dots 各关键点坐标
     */
    pathCalc(dots) {
      let d = ''
      const sx = dots[0].x
      const sy = dots[0].y
      const dotsCount = dots.length
      d += `M${sx} ${sy} `
      dots.forEach((dot, index) => {
        const isLast = index + 1 === dotsCount ? 'last' : 'default'
        const pathActions = {
          last: $ => {
            // 最后一个点进行封闭图形
            d += `V350 H${sx} z`
          },
          default: $ => {
            // 非结束点进行曲线绘制
            const { x: sx, y: sy, c } = dot
            const { x: ex, y: ey } = dots[index + 1]
            const fx = (ex - sx) * (c || 0)
            const curveto = this.curveCalc(sx, sy, fx, ex, ey)
            d += curveto
          }
        }
        pathActions[isLast]()
      })

      return d
    },

    /**
     * @summary 波峰波谷间隔计算
     */
    blocksCalc(count = 7) {
      const aver = 2000 / (count - 1)
      const big = aver * 1.15
      const small = aver * 0.85
      const blocks = Array(count - 3)
        .fill(aver)
        .concat([big, small])

      let m = blocks.length

      while (m) {
        const i = Math.floor(Math.random() * m--)
        const seed = _random(50) * _pm()

        blocks[m] += seed
        blocks[i] += -1 * seed
        ;[blocks[m], blocks[i]] = [blocks[i], blocks[m]]
      }
      return blocks
    },

    /**
     * @summary 坐标生成
     * @return {array} dots: [{ x: x 坐标, y: y 坐标, c: 曲率 }]
     */
    dotsCalc(count = 7, minY = 30, maxY = 300) {
      let dots = []

      // 起点 y
      const sy = _random(300, minY)

      const originCurve = _random(0.65, 0.35)
      const blocks = this.blocksCalc(count)

      const dotActions = {
        start: _ => {
          dots.push({
            x: 0,
            y: sy,
            c: originCurve
          })
        },

        default: currentIndex => {
          const lastDot = dots[currentIndex - 1]
          const y = lastDot.y > 175 ? _random(170, minY - 10) : _random(maxY - 10, 180)
          const x = blocks[currentIndex - 1] + lastDot.x

          dots.push({
            x,
            y,
            c: 1 - lastDot.c
          })
        },

        end: _ => {
          dots.push({
            x: 2000,
            y: sy
          })
        }
      }

      Array(count)
        .fill('')
        .forEach((_, index) => {
          const indexMap = {
            0: 'start',
            [count - 1]: 'end'
          }
          // 点生成
          dotActions[indexMap[index] || 'default'](index)
        })

      const repeat = dots
        .map(dot => {
          const { x, y, c } = dot
          return {
            x: x + 2000,
            y,
            c
          }
        })
        .slice(0, -1)

      return dots.concat(repeat)
    }
  },
  watch: {

  }
}
function _random (max = 1, min = 0, offset = 0) {
  const r = (Math.random() * (max - min) + min).toFixed(2)
  return Number(r) + offset
}

// 随机正负
function _pm () {
  return Math.random() > 0.5 ? 1 : -1
}

function shuffle ([...arr]) {
  let m = arr.length
  while (m) {
    const i = ~~(Math.random() * m--)
    ;[arr[m], arr[i]] = [arr[i], arr[m]]
  }

  return arr
}
</script>

<style lang="scss" scoped>
.title{
  position: absolute;
  left: 10px;
  z-index: 10;
  cursor: pointer;
  user-select: none;
    // margin-left: 10px;
}
#smallCard{
    position: relative;
    display: flex;
    align-items: center;
    // justify-content: center;
    // border: 1px solid red;
    width: 120px;
    height: 35px;
    margin-bottom: 3px;
}
.el-icon-close{
    position: absolute;
    right: 5px;
    // border: 1px solid red;
    cursor: pointer;
    color: rgb(71, 134, 250);
    font-size: 16px;
}
.el-icon-close:hover{
    font-size: 20px;
}

.card {
  cursor: pointer;
  --to: rgb(108, 250, 255);
  --from: rgb(108, 255, 194);
  --center: rgb(255, 119, 210);
  --shadow: rgba(255, 229, 80, 0.836);
  
  position: relative;
  width: 100vw;
  height: 100%;
  margin: auto;
  overflow: hidden;
  background: linear-gradient(130deg, var(--from), var(--to));
  box-shadow: 0 53px 67px -26px var(--shadow);
  border-radius: 4% / 11.5%;

}
svg {
  position: absolute;
  width: 300%;
  height: 100%;
}
.wave {
  --cubic-bezier: cubic-bezier(0.68,0.35,0.37,0.65);
  fill: #fff;  
  &--front {
    animation: move 4.5s var(--cubic-bezier) infinite;
  }
  &--middle {
    animation: move 3.5s var(--cubic-bezier) infinite;
  }
  &--back {
    animation: move 3s var(--cubic-bezier) infinite;
  }
}

@keyframes move {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
