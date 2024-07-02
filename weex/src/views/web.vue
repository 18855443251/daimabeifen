<template>
  <div class="home">
    <title-bar :title='title'></title-bar>
    <web ref="webview" style="width: 750px; height: 1334px" src="https://mp.weixin.qq.com/s/z06NVp_DJmAyDj0i1u8ImA"></web>
  </div>
</template>
<style scoped>
.home {
  width: 750px;
  height: 1334px;
  background-color: #ececec;
}
</style>
<script>
import TitleBar from "../components/templet/titlebar.vue";
const webview = weex.requireModule('webview');
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
export default {
  components: {
    TitleBar
  },
  data() {
    return {
      title: "公告"
    };
  },
  created: function() {
   
  },
  methods: {
  
  }
};
</script>