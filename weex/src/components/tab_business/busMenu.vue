<template>
  <div class="contain-div">
    <div class="list-div">
      <div class="item" v-for="(item,key) in firstRowList" :key="key">
        <image class="item-img" :src="item.src" @click="goDifMoudle(item.url)"></image>
        <text class="title">{{item.name}}</text>
      </div>
    </div>
    <div class="list-div mg16">
      <div class="item" v-for="(item,key) in secondRowList" :key="key">
        <image class="item-img" :src="item.src" @click="goDifMoudle(item.url)"></image>
        <text class="title">{{item.name}}</text>
      </div>
    </div>
    <div class="list-div mg16">
      <div class="item" :style="item.mark=='1'?markstyle:''" v-for="(item,key) in thirdRowList" :key="key">
        <image class="item-img" :src="item.src" @click="goDifMoudle(item.url)"></image>
        <text class="title">{{item.name}}</text>
      </div>
      
    </div>
  </div>

</template>

<script>
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');
const modal = weex.requireModule('modal');
export default {
  /**
   * Props 接受父组件的传值
   * @prop {Json} jsonurl 推荐组件的json文件路径
   */
  props: ['jsonurl'],
  data() {
    return {
      firstRowList: [],
      secondRowList: [],
      thirdRowList: [],
      markstyle: { width: '468px' }
    };
  },
  created() {
    this.getIntell();
  },
  watch: {
    jsonurl() {
      this.getIntell();
    }
  },
  methods: {
    getIntell() {
      stream.fetch(
        {
          method: 'GET',
          url: this.jsonurl,
          type: 'json'
        },
        response => {
          if (response.status === 200) {
            var response_data = response.data.data;
            this.firstRowList = response_data.menuList;
            this.secondRowList = response_data.secondList;
            this.thirdRowList = response_data.thirdList;
          }
        }
      );
    },
    goDifMoudle(url) {
      //context.launchStage(url);
      this.gotoStage(url);
    }
  }
};
</script>

<style scoped>
.contain-div {
  width: 750px;
  height: 716px;
  padding-top: 18px;
  background-color: #fff;
}
.list-div {
  width: 750px;
  height: 216px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}
.item {
  width: 226px;
  height: 216px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.item-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.mg16 {
  margin-top: 16px;
}
.markstyle {
  width: 468px;
}
.title {
  font-size: 28px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-top: 140px;
}
</style>