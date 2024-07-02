<template>
  <div class="container">
    <div class="item" v-for="(item,key) in items" :key="key" @click="JumpTo(item.url)">
      <image class="icon" :src="item.src"></image>
      <div class="rightdiv">
        <text class="titletext">{{item.name}}</text>
        <text class="destext">{{item.des}}</text>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 750px;
  height: 180px;
  background-color: white;
  flex-direction: row;
  align-items: center;
}
.item {
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-left: 36px;
  border-right-width: 1px;
  border-right-color: #e6e6e6;
}
.icon {
  width: 82px;
  height: 82px;
}
.rightdiv {
  margin-left: 30px;
}
.titletext {
  color: #222222;
  font-size: 30px;
  margin-bottom: 7px;
}
.destext {
  color: #999999;
  font-size: 24px;
  margin-top: 7px;
}
</style>
<script>
const stream = weex.requireModule('stream');

export default {
  props: ['jsonurl'],
  data() {
    return {
      items: [],
      bgsrc: './imgs/tab_life/userinfo/white_bg@2x.png'
    };
  },
  methods: {
    JumpTo(url) {
      // context.launchStage(url);
      this.gotoStage(url);
    }
  },
  created() {
    //查询楼层
    stream.fetch(
      {
        method: 'GET',
        url: this.$store.state.jsonBaseUrl + this.jsonurl,
        type: 'json'
      },
      response => {
        if (response.status === 200) {
          this.items = response.data.data;
        }
      },
      () => {}
    );
  }
};
</script>
