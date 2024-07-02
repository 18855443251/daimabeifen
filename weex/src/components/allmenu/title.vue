<template>
  <div class="container" :style="{backgroundColor:backgroundColor}">
    <div class="row">
      <div class="title_left" @click="goBack()">
        <image class="back_img" :src="backimg"></image>
      </div>
      <!-- <text class="title" :style="{color:fontColor}">{{title}}</text> -->
      <div class="search_wrapper">
        <div class="searchdiv" @click="goTo('main.search')">
          <image class="searchimg" :src="searchimg"></image>
          <text class="searchinput">搜索功能</text>
        </div>
      </div>
      <div class="title_left"></div>
    </div>

  </div>
</template>
<style scoped>
.container {
  background-color: #ffffff;
}
.row {
  padding-top: 80px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 13px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
}
.title_left {
  width: 60px;
  height: 36px;
}
.title {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
}
.back_img {
  width: 42px;
  height: 42px;
}
.search_wrapper {
  background-color: #ffffff;
  height: 60px;
  width: 750px;
  flex-direction: row;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
}
.searchdiv {
  height: 60px;
  width: 520px;
  background-color: rgb(247,247,247);
  border-radius: 31px;
  flex-direction: row;
  align-items: center;
}
.searchimg {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  margin-left: 34px;
}
.searchinput {
  font-size: 26px;
  color: #9c9c9c;
}
</style>
<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
export default {
  props: {
    jsonurl: {
      type: String,
      default: "title.json"
    }
  },
  data() {
    return {
      searchimg: "./imgs/allmenu/search.png",
      backimg: "",
      title: "",
      fontColor: "",
      backgroundColor: "",
      jsonBaseUrl: "./json/allmenu/"
    };
  },
  methods: {
    goTo(url) {
      context.launchStage(url);
    },
    getJson() {
      stream.fetch(
        {
          method: "GET",
          url: this.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;
            this.backimg = tmp.backimg;
            this.title = tmp.title;
            this.fontColor = tmp.fontColor;
            this.backgroundColor = tmp.backgroundColor;
          }
        }
      );
    }
  },
  created() {
    this.getJson();
  }
};
</script>
