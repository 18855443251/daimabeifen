<template> 
  <div class="home">
    <scroller>
      <top-need-login></top-need-login>
      <homepage :jsonurl="financeurl"></homepage>
      <list-component :jsonurl="listurl" :num="num"></list-component>
    </scroller>
    <bottom></bottom>
    <prize v-if="$store.state.AutoLoginUrl!=''"></prize>
  </div>
</template>
<style scoped>
.home {
  width: 750px;
  background-color: #ffffff;
}
.loading {
  width: 750px;
  height: 200px;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #f1f1f1;
}
.bottom-img {
  width: 750px;
  height: 160px;
}
.loading-img {
  width: 450px;
  height: 186px;
  position: absolute;
  top: 7px;
  left: 150px;
}
</style>
<script>
import topNeedLogin from "../components/tab_user/topNeedLogin";
import Homepage from "../components/tab_user/homepage_component";
import ListComponent from "../components/tab_user/list_component";
import Bottom from "../components/templet/bottom.vue";
import prize from "../components/tab_user/prize";

const context = weex.requireModule("context");
const modal = weex.requireModule('modal');
const stream = weex.requireModule("stream");
export default {
  components: {
    topNeedLogin,
    Homepage,
    ListComponent,
    prize,
    Bottom
  },
  data() {
    return {
      layoutlist: [],
      laytou_url: "tab_user/layout.json",
      listurl:"tab_user/list.json",
      loadinging: false,
      financeurl: "tab_user/homepage.json",
      bottomhImg: "./imgs/templet/bottom/bottom-img.png",
      loadingImg: "./imgs/templet/bottom/loading.gif",
      num:""
    };
  },
  created: function() {
    //查询楼层
    stream.fetch(
      {
        method: "GET",
        url: this.$store.state.jsonBaseUrl + this.laytou_url,
        type: "json"
      },
      response => {
        if (response.status === 200) {
          this.layoutlist = response.data.data;
        }
      }
    );
  },
  methods: {
    onloading() {
      this.loadinging = true;
	   setTimeout(() => {
         this.loadinging = false;
        }, 1200);
    }
  },
  watch: { 
  }
};
</script>