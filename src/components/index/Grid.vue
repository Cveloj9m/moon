<template>
  <table>
    <tbody>
      <tr v-for="n in rownum" :key="n">
        <td v-for="n2 in column" :key="n2">
          <button
            class="el-button--goon"
            @mouseleave="closeMessage()"
            @mouseenter="openMessage(n, n2)"
            :ref="n + '-' + n2"
            v-if="showGrid(n + '-' + n2)"
            @click="showMenu(mainMenus[n + '-' + n2].children)"
          >
            <el-popover
              popper-class="monitor-yt-popover"
              placement="top"
              :title="mainMenus[n + '-' + n2].name"
              trigger="hover"
            >
              <el-row>
                <template v-for="card in taskbarCard">
                  <Taskbar
                    :key="card.id"
                    :title="card.title"
                    :id="card.id"
                    v-if="
                      card.pid == mainMenus[n + '-' + n2].id &&
                      card.visibility == false
                    "
                    :pid="mainMenus[n + '-' + n2].pid"
                    @show-card="showCard"
                    @close-card="closeCard"
                  >
                  </Taskbar>
                </template>
              </el-row>
              <template #reference>
                <i :class="mainMenus[n + '-' + n2].icon"></i>
              </template>
            </el-popover>
          </button>
        </td>
      </tr>
      <el-drawer
        v-model="drawer"
        :direction="direction"
        :with-header="false"
        size="40%"
      >
        <button
          class="el-button--drawer"
          style="float: left; width: 25%"
          @click="prev"
          v-show="drawerData.length != 1"
        >
          《
        </button>
        <button
          class="el-button--drawer"
          style="float: right; width: 25%"
          @click="next"
          v-show="drawerData.length != 1"
        >
          》
        </button>
        <el-carousel
          class="elCarousel"
          ref="carousel"
          :autoplay="false"
          arrow="never"
          indicator-position="none"
        >
          <el-carousel-item
            class="elCarouselItem"
            v-for="item in drawerData"
            :key="item.path"
          >
            <button
              class="el-button--drawer"
              @click="addCard('cardWindow', item)"
            >
              {{ item.name }}
            </button>
          </el-carousel-item>
        </el-carousel>
      </el-drawer>
    </tbody>
  </table>
  <svg id="svgCiLa">
    <defs>
      <filter id="fe1">
        <feTurbulence
          id="animation"
          type="fractalNoise"
          baseFrequency="0.00001 9.9999999"
          numOctaves="1"
          result="warp"
        >
          <animate
            attributeName="baseFrequency"
            from="0.00001 9.9999"
            to="0.00001 0.001"
            dur="3s"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feOffset dx="0" dy="0" result="warpOffset"></feOffset>
        <feDisplacementMap
          xChannelSelector="R"
          yChannelSelector="G"
          scale="30"
          in="SourceGraphic"
          in2="warpOffset"
        ></feDisplacementMap>
      </filter>
    </defs>
  </svg>
</template>

<script>
import Taskbar from "@/components/index/Taskbar.vue";
export default {
  name: "grid",
  data() {
    return {
      refNamePopover: "popover-",
      seed: Math.floor(Math.random() * 10),
      hash: {},
      drawer: false,
      direction: "btt",
      drawerData: [],
      kk: null,
      positionRam: false,
    };
  },
  components: { Taskbar },
  props: {
    rownum: Number,
    column: Number,
    componentVisible: Array,
    componentSize: Number,
    mainMenus: Map,
    taskbarCard: Array,
  },
  mounted(){

  },
  methods: {
    ram() {
      let ranNum = this.componentSize;
      while (ranNum > 0) {
        let ran = Math.floor(Math.random() * this.componentSize + 1);
        if (!this.hash[ran]) {
          this.hash[ran] = 1;
          ranNum--;
          return ran;
        }
      }
    },
    showGrid(val) {
      for (let index = 0; index < this.componentVisible.length; index++) {
        const element = this.componentVisible[index];
        if (element == val) {
          return true;
        }
      }
      return false;
    },
    showMenu(val) {
      this.drawerData = val;
      this.drawer = true;
    },
    addCard(cardType, item) {
      this.$emit("add-card", cardType, item);
      this.drawer = false;
    },
    showCard(id) {
      this.$emit("show-card", id);
    },
    closeCard(id) {
      this.$emit("close-card", id);
    },
    openMessage(n, n2) {
      let m = this.mainMenus[n + "-" + n2];
      this.kk = this.$notify({
        title: "金宝在这欢迎你呀," + this.$store.state.principal.username,
        message: "访问 ：" + m.name,
        showClose: false,
        duration: 0,
        position: "top-right",
      });
    },
    closeMessage(area) {
      this.kk.close();
    },
    prev() {
      this.$refs.carousel.prev();
    },
    next() {
      this.$refs.carousel.next();
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
:deep(.el-drawer) {
  background-color: transparent !important;
}
.elCarousel {
  // border: 1px solid red;
  margin: 0 auto;
  width: 40%;
}
.elCarouselItem {
  /*设置为伸缩容器*/
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  /*垂直居中*/
  justify-content: center;
  align-items: center;
  height: 80%;
}
/* 重置按钮 */
.el-button--goon {
  width: 100%;
  height: 100%;
  color: rgb(250, 202, 44);
  background-color: rgba(246, 241, 248, 0);
  border-color: rgba(198, 139, 223, 0);
  font-size: 60px;
}
.el-button--goon:hover {
  background-color: rgba(175, 165, 179, 0.589);
}
.el-button--drawer {
  border: none;
  width: 50%;
  height: 70%;
  font-size: 40px;
  font-weight: 500;
  color: white;
  background-color: rgba(64, 116, 52, 0);
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.el-button--drawer:hover {
  filter: url(#fe1);
}
#svgCiLa {
  position: fixed;
}
td:hover {
  background-color: rgba(175, 165, 179, 0.589);
  width: 120px;
  height: 120px;
  transition: all 0.1s ease-in;
  transform: scale(1.1);
}
td {
  background-color: #b1aca92f;
  width: 120px;
  height: 120px;
  transition: all 1s ease-in;
}

/*最外层div,修改背景色，边框*/
.el-popover.monitor-yt-popover {
  min-width: 10px;
  background: linear-gradient(-45deg, #ab6efa, #ff6da5, #7dff6c, #5ad3ff);
  background-size: 100% 100%;
  /* animation: gradient 15s ease infinite; */
}
/*修改title颜色*/
.monitor-yt-popover .el-popover__title {
  color: white;
}
/*修改下面的小三角，属性名根据组件的placement位置做相应修改*/
.monitor-yt-popover .popper__arrow::after {
  border-top-color: #090d29 !important;
}
</style>