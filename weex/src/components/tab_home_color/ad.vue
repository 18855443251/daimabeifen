<template>
  <div class="adcontainer">
    <slider class="slider" interval="5000" auto-play="true">
      <div class="frame" v-for="(ad,i) in  ad_list" :key="i">
        <image class="image" resize="cover" @click="goto(ad.url)" :src="ad.src"></image>
      </div>
    </slider>
  </div>
</template>

<style scoped>
.adcontainer {
  width: 750px;
  height: 250px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F8F8F8;
}
.slider {
  width: 690px;
  height: 220px;
}
.frame {
  width: 690px;
  height: 206px;
}
.image {
  width: 690px;
  height: 206px;
  border-radius: 14px;
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