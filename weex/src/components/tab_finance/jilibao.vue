<template>
  <div class="container">
    <slider class="slider" interval="5000" auto-play="true">
      <div class="frame" v-for="(ad,i) in  ad_list" :key="i">
        <image class="image" resize="cover" @click="goto(ad.url)" :src="ad.src"></image>
      </div>
    </slider>
  </div>
</template>

<style scoped>
.container {
  width: 750px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  margin-top: 16px;
}
.slider {
  width: 690px;
	height: 160px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.frame {
  width: 690px;
	height: 160px;
  border-radius: 14px;
}
.image {
  width: 690px;
	height: 160px;
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
      context.launchStage(url);
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