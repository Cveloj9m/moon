<template>
    <el-container id="scene" class="container">
      <div data-depth="0.9">
          <Grid 
            :mainMenus="mainMenus" 
            :column="column" 
            :rownum="rownum" 
            :componentSize="routeMenus.length" 
            :componentVisible="componentVisible"
            :taskbarCard="taskbarCard"
            @add-card="addCard"
            @show-card="showCard"
            @close-card="closeCard"
            >
          </Grid>
          <Card
            v-for="card in windows.cards"
            :key="card.id"
            :content="card.text"
            :title="card.title"
            :type="card.card_type"
            :position="card.position"
            :id="card.id"
            :pid="card.pid"
            :card-size="card.cardSize"
            :font-size="card.fontSize"
            :votes="card.votes"
            :order="card.order"
            :active="card.id == activeDrag"
            :visibility="card.visibility"
            :routeCard="item"
            @route-create="choiceRoute"
            @update="updateCard"
            @stop-drag="stopDrag"
            @start-drag="startDrag"
            @close-card="closeCard"
            @min-card="minCard"
          >
          </Card>
      </div>
    </el-container>
</template>
<script>
import Grid from '@/components/index/Grid.vue'
import Card from "@/components/index/Card.vue";
import positioner from "@/stores/mome/positioner.js";
import Parallax from 'parallax-js'

export default {
  name: "index",
  components: {Grid, Card},
  data() {
    return {
      headState: true,
      windowWidth: document.documentElement.clientWidth-150,  //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight-150,   //实时屏幕高度
      column:Math.floor((document.documentElement.clientWidth-150)/120),
      rownum:Math.floor((document.documentElement.clientHeight-150)/120),
      componentVisible:[],
      mainMenus: new Map(),
      seed: Math.floor(Math.random() * 10),
      activeDrag: null, windows: {type: Object, cards: [], required: true, }, item : {},
      taskbarCard: [],
    }
  },
  computed: {
    routeMenus() {
      // let menus = this.$store.state.layout.routeMenu;
      let menus = null;
      if (!menus) return [];
      return menus.map(({ id, pid, name, component, icon, path, auth, children }) => {
        let hasChild = Array.isArray(children) && children.length > 0;
        let data = {
          id: id,
          pid: pid,
          path: path,
          name: name,
          icon: icon,
          component: component,
          meta: { auth: auth, title: name },
        };
        if (hasChild) {
          delete data.path;
          data.children = children.map(({ id, pid, name, component, icon, path, auth }) => {
            return {
              id: id,
              pid: pid,
              path: path,
              name: name,
              icon: icon,
              component: component,
              meta: { auth: auth, title: name },
            };
          });
        }
        return data;
      });
    }
  },
  methods: {
    // 网格组件
    myOptions () {
      this.componentVisible = []; 
      let ranNum = this.routeMenus.length;
      let hash = {};
      for (let index = 0; index < ranNum; index++) {
        let rowran = Math.floor(Math.random() * this.rownum + 1);
        let colran = Math.floor(Math.random() * this.column + 1);
        hash[rowran] = 1;
        hash[colran] = 1;
        this.mainMenus[(rowran + "-" + colran)] = this.routeMenus[index];
        this.componentVisible.push(rowran + "-" + colran);
      }
    },
    showCard(id){
      this.updateCard(id, { visibility: true });
      let cardIndex = this.taskbarCard.findIndex(function(card){
        return (id === card.id)
      })
      this.taskbarCard.splice(cardIndex, 1);
    },
    minCard(id){
      var card = this.getCardById(id);
      this.taskbarCard.push(card);
      this.updateCard(id, { visibility: false });
    },
    closeCard(id) {
      var maxOrder = this.getMaxOrder();
      var card = this.getCardById(id);
      let cardIndex = this.windows.cards.findIndex(function(card){
        return (id === card.id)
      })
      this.updateCard(id, { visibility: true });
      this.windows.cards.splice(cardIndex, 1);
    },
    // 拖动组件
    startDrag(id) {
      var maxOrder = this.getMaxOrder();
      var card = this.getCardById(id);

      // Set as active
      this.activeDrag = id;

      // This card already is the top one, dont add 1
      if (card.order === maxOrder && maxOrder > 0) {
        return;
      } else {
        this.updateCard(id, { order: maxOrder + 1 });
      }
    },
    stopDrag(id) {
      this.updateCard(id, { active: false });
    },

    getCardById(id) {
      return this.windows.cards.find(function (card) {
        return id === card.id;
      });
    },

    updateCard(id, update) {
      var card = this.getCardById(id);
      if (card) {
        // The whole windows is not "initial" anymore
        if (this.windows.initial) {
          delete this.windows.initial;
        }

        // Update card properties
        Object.assign(card, update);
      } else {
        throw new Error("Where's the card!?");
      }
      return card;
    },

    getMaxOrder() {
      return this.windows.cards.reduce(function (prev, value) {
        if (typeof value.order === "undefined") {
          return prev;
        }
        return prev > value.order ? prev : value.order;
      }, 0);
    },

    addCard(type, item) {
      var placeholderText;
      var terciary;
      this.item = item;
      switch (type) {
        case "improvement":
          placeholderText = "This needs some improvement";
          terciary = 2;
          break;
        case "cardWindow":
          placeholderText = "我自己新增的";
          terciary = 1;
          break;
        case "neutral":
          placeholderText = "Just a remark";
          terciary = 1;
          break;
        case "positive":
          placeholderText = "This went well";
          terciary = 0;
          break;
      }
      // Card default props
      var card = {
        text: placeholderText,
        pid: item.pid,
        title: item.name,
        card_type: type,
        position: positioner.getPositionforNew(terciary),
        cardSize: { w: 500, h: 350 },
        visibility: true,
        fontSize: 1,
        votes: 0,

        order: this.getMaxOrder() + 1,
        id: Math.round(Math.random() * 100000),
      };
      this.windows.cards.push(card);
    }
  },
  created(){
    const sleep = (timeout= 1000)=>new Promise((resolve, reject)=>{setTimeout(resolve, timeout);});
    // 可以使用 bluebird模块中的 bluebird.delay() 替换 sleep()
    // const bluebird = ruquire('bluebird');
    let timer = async(timeout) => {
        for(let i = 0; i< timeout; i++) {
            // await sleep(1000);
            // if(this.$store.state.layout.routeMenu){
            //   this.myOptions();
            //   break;
            // }
        }
    }
    timer(100)
  },
  // <!--在watch中监听实时宽高-->
  watch: {
    windowHeight (val) {
      let that = this;
      // console.log("实时屏幕高度：",val, that.windowHeight );
      this.rownum = Math.floor((val-150)/120)
    },
    windowWidth (val) {
      let that = this;
      // console.log("实时屏幕宽度：",val, that.windowWidth );
      this.column = Math.floor((val-150)/120)
    },
    rownum () {
      this.myOptions();
    },
    column () {
      this.myOptions();
    },
  },
  mounted() {
    new Parallax(document.getElementById("scene"));
    
    var that = this;
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        that.windowHeight = window.fullHeight;  // 高
        that.windowWidth = window.fullWidth; // 宽
      })()
    };
  },
}
</script>


<style scoped lang="scss">


// .justify-content-center {
// 	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
// 	background-size: 400% 400%;
// 	animation: gradient 15s ease infinite;
// 	height: 100vh;
// }

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

.container {
  /*设置为伸缩容器*/
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  // display: flex;
  /*垂直居中*/
  justify-content: center;
  align-items: center;
  // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23d5ab, #23a6d5);
  background: linear-gradient(90deg, #002FA7, #470024, #FBD26A, #01847F, #492D22, #003153, #D44848
  ,#002FA7, #470024, #FBD26A, #01847F, #492D22, #003153, #D44848
  ,#002FA7);
	background-size: 1500% 1500%;
	animation: gradient 250s linear infinite;
	height: 100vh;
  overflow: hidden;
  z-index:1;
}
// .container::before{
//   background: linear-gradient(
//     90deg,
    
//   );
//   background-size: 300% 300%;
// }
// .container::after{

// }

@keyframes gradient {
  0%{
    background-position: 0 0;
  }
  0%{
    background-position: 1500% 0;
  }
}

.el-menu-left .el-menu-item:hover {
  outline: 0 !important;
  background-color: #E9EEF3 !important;
}

.el-menu-right .el-menu-item:hover {
  outline: 0 !important;
  background-color: #E9EEF3 !important;
  
}

.el-copyright {
  margin-top: 20px;
  height: 50px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;

  .copyright-title {
    color: rgba(235, 215, 41, 1);
  }
}


</style>