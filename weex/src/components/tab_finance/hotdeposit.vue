<template>
  <div class="container">
    <div class="row">
      <div class="banker-center">
        <image class="title-img" :src="titleImg"></image>
      </div>
      <div class="wrapper">
        <div class="main" v-for="(finance,key) in financeList" :key="key" @click="JumpTo(finance.url)">
          <div class="text-box">
            <text class="title">{{finance.name}}</text>
            <text class="description">{{finance.description}}</text>
          </div>
          <image class="img" :src="finance.src"></image>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 750px;
  background-color: #ffffff;
  margin-top: 16px;
}
.row {
  height: 193px;
  width: 750px;
}
.banker-center {
  padding-left: 20px;
}
.title-img {
  width: 152px;
  height: 36px;
}
.wrapper {
  width: 750px;
  flex-direction: row;
  margin-top: 30px;
}
.main {
  flex: 1;
  padding-left: 30px;
  padding-right: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-right-width: 1px;
  border-right-color: #efefef;
}
.title {
  font-size: 34px;
  font-weight: bold;
  color: #222222;
}
.description {
  font-size: 28px;
  color: #b6b5b6;
  margin-top: 23px;
}
.img {
  height: 102px;
  width: 102px;
}
</style>
<script>
//理财类型： hot、black、presale 、setUp、soldOut
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  props: ["jsonurl"],
  data() {
    return {
      titleImg: "./imgs/tab_finance/deposit/title_img.png",
      financeList: []
    };
  },
  created() {
    this.getFinance();
  },
  methods: {
    JumpTo(url) {
      // context.launchStage(url);
      this.gotoStage(url, true);
    },
    getFinance() {
      stream.fetch(
        {
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;
            this.financeList = tmp;
          }
        },
        () => {}
      );
    }
  },
  watch: {
    jsonurl() {
      this.getFinance();
    }
  }
};
</script>
