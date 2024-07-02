<template>
  <div class="container">
    <div class="title-box">
      <text class="title_font">专属推荐</text>
      <text class="title_des">我们的努力只为更懂你</text>
    </div>
    <div class="slider-wrapper">
      <slider class="slider" interval="5000" auto-play="true">
        <div class="frame" v-for="ad in  ad_list" :key="ad.key">
          <image class="image" resize="cover" @click="goto(ad.url)" :src="ad.src"></image>
        </div>
      </slider>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 750px;
  background-color: #ffffff;
  margin-top: 16px;
  padding-bottom: 36px;
}
.title-box {
  margin-left: 27px;
  height: 106px; 
  flex-direction: row;
  align-items: center;
}
.title_font {
  font-size: 38px;
  color: #222222;
  padding-right: 30px;
  border-right-width: 1px;
  border-right-color: #e8e8e8;
}
.title_des {
  font-size: 28px;
  color: #999999;
  padding-left: 30px;
}
.slider-wrapper {
  width: 750px;
  justify-content: center;
  align-items: center;
}
.slider {
  width: 710px;
  height: 280px;
}
.frame {
  width: 710px;
  height: 280px;
  border-radius: 10px;
}
.image {
  width: 710px;
  height: 280px;
}
</style>
<script>
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');
const modal = weex.requireModule('modal');
export default {
  props: ['jsonurl'],
  data() {
    return {
      ad_list: []
    };
  },
  mounted() {
    this.getAd();
  },
  methods: {
    goto(url) {
      // context.launchStage(url);
      this.gotoStage(url);
    },
    getAd() {
      stream.fetch(
        {
          method: 'GET',
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: 'json'
        },
        res => {
          this.ad_list = res.data.data;
        }
      );
    }
  }
};
</script>