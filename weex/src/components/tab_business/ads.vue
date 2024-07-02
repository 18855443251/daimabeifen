<template>
  <div class="container">
    <slider class="slider" interval="5000" auto-play="true">
      <div class="frame" v-for="(ad,i) in  ad_list" :key="i">
        <image class="image" resize="cover" @click="goto(ad.url)" :src="ad.src"></image>
      </div>
      <indicator class="indicator"></indicator>
    </slider>
  </div>
</template>

<style scoped>
.container {
  width: 750px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.slider {
  width: 690px;
  height: 241px;
}
.frame {
  width: 690px;
  height: 241px;
}
.image {
  width: 690px;
  height: 241px;
  border-radius: 18px;
}
.indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background-color: rgba(0, 0, 0, 0);
  item-size: 15px;
  item-color: rgba(255,255,255,0.5);
  item-selected-color: rgba(255,255,255,1);
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  props: ["jsonurl"],
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
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        res => { 
          this.ad_list = res.data.data;
        }
      );
    }
  }
};
</script>