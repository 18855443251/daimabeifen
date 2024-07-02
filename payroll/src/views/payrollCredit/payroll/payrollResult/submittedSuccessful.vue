<template>
  <div>
    <nav-bar title="代发结果"></nav-bar>
    <scroller>
      <div class="result">
      <div class="wrapper">
        <image :src="successImg" class="success_img" />
         <div  v-if="$store.state.AuthItemList&&$store.state.AuthItemList.length>0"><text class="state">{{subSuccess}}</text></div>
         <div  v-else><text class="state" >{{traSuccess}}</text></div>
         <div v-if="$store.state.AuthItemList&&$store.state.AuthItemList.length>0" class="state_box">
            <div  v-for="(item,index) in $store.state.AuthItemList" :key="index" >
             <text class="state_desc">还需{{item.AuthUserCount}}个{{item.UserGrpId}}级审核员审核</text>
            </div>
         </div>
      </div>
      <div class="text_gray"></div>
      <div class="info">
        <div class="info_box">
          <text class="info_box_title">批次号:</text>
          <text class="info_box_text">{{$store.state.BatchNo}}</text>
        </div>
        <div class="info_box">
          <text class="info_box_title">总金额:</text>
          <text class="info_box_text">¥{{ $store.state.totalMoney }}</text>
        </div>
        <div class="info_box">
          <text class="info_box_title">总笔数:</text>
          <text class="info_box_text">{{ $store.state.strokeCount }}</text>
        </div>
        <div class="info_box">
          <text class="info_box_title">发放日期:</text>
          <text class="info_box_text">{{ FormattedCurDate(releaseDate) }}</text>
        </div>
      </div>
      <div class="btn">
        <text class="btn_text" @click="finish">完成</text>
      </div>
    </div>
    </scroller>
  </div>
</template>
<script>
import NavBar from "../../../../components/titlebar_component3.vue";
import { WxcPopup } from "weex-ui";
const modal = weex.requireModule("modal");
export default {
  components: { NavBar, WxcPopup },
  data() {
    return {
      releaseDate: "",
      successImg: this.$store.state.imgBaseUrl + "13.png",
      subSuccess: "提交成功",
      traSuccess:"交易成功",
    };
  },
  methods:{
    finish(){
     this.jump("/index")
    }
  }
};
</script>
<style scoped>
.result {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  /* height: 270px; */
  /* height: 400px; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.success_img {
  width: 110px;
  height: 110px;
  margin-top: 30px;
}
.state {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-top: 20px;
}
.state_desc {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}

.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.info {
  height: 352px;
}
.info_box {
  height: 88px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  margin-left: 30px;
}
.state_box{
  /* height: 180px; */
   margin-top: 22px;
  margin-bottom: 30px;
}
.desc {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-top: 60px;
  margin-left: 30px;
}
.info_box_text {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
}
.btn_text {
  width: 670px;
  height: 88px;
  line-height: 88px;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  border-radius: 12px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.info_box_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
</style>
