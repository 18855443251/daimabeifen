<template>
  <div class="home">
    <NavBar :title="title"></NavBar> 
		<scroller class="scroller_content">
			<div class="container">
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>     
        <div class="content_box">
          <div class="content_details content_details_title">
            <text class="detail_info">开通信息</text>
          </div>
          <div class="content_details margin32">
            <text class="info">用户名：</text>
            <text class="info_right">{{detail.Name}}</text>
          </div>
          <div class="content_details margin32" style="margin-top:10px;">
            <text class="info">证件号码：</text>
            <text class="info_right">{{detail.IdNo}}</text>
          </div>
          <div  class="content_details margin32" style="margin-top:10px;">
            <text class="info">手机号：</text>
            <text class="info_right">{{detail.MobilePhone}}</text>
          </div>
        </div>
			</div>
		</scroller>
    <showBotton v-if="showBtn == '0'"></showBotton>
	</div>
	
</template>
<style scoped>
.info_right{
  width: 500px;
  font-size: 30px;
  color: #666;
}
.kong{
  height: 100px;
}
.info{
  font-size: 30px;
  color: #333;
}
.detail_info{
  color: #333;
  font-size: 30px;
  font-weight: bold;
  margin-left: 32px;
}
.progress{
  height: 180px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.content_box{
  width: 690px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style:solid;
  border-radius: 18px;
  flex-direction:column;
  background-color: rgb(255, 255, 255);
}
.content_details{
  flex-direction: row;
  height:70px;
}
.content_details_title{
  margin-top: 20px;
}
.margin32{
  flex-direction: row;
  justify-content:space-between;
  margin-left: 32px;
  margin-right: 32px;
}
.home {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgb(250, 250, 250);
}
.container {
  width: 750px;
  background-color: rgb(250, 250, 250);
}
.scroller_content::-webkit-scrollbar{
  display: none;
}
</style>
<script>
import showBotton from "@/components/tab_bench/showBotton.vue";
import NavBar from "@/components/templet/titlebar";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  components: {
    NavBar,
    intiateProgress,
    showBotton,
    Progress
  },
  data() {
    return {
      title: "",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
      CheckAuthItemList:[] 
      // AuthStep表示审核的先后顺序
      // AuthState   0：未审核  1：已审核
      // UserGrpId  审核员级别 
    };
  },
  created(){
        this.TransStatus=context.sessionGetString("TransStatus");
        this.title=context.sessionGetString("TransName");
        this.JnlNo=context.sessionGetString("JnlNo");
        this.TransCode=context.sessionGetString("TransCode");
        this.showBtn=context.sessionGetString("showBtn");
        if(this.showBtn == "0") {
          this.getCheckDetail()
        } else if(this.showBtn == "1"){
          this.getDetail()
        }             
  },
  methods: {
    //请求我发起的和我处理的详情信息
    getDetail() {
      var params={
          TransCode: this.TransCode,
          JnlNo: this.JnlNo
      }
      this.goJson("/eweb/AuthEjnlDetail.do", params , response => {
        this.detail = response.data.EjnlList[0];
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      })
    },
    //请求待审核的交易详情
    getCheckDetail(){
        this.goJson("/eweb/AuthDetailQuery.do", {
            TransCode:this.TransCode,
            _AuthJnlNo:this.JnlNo
        }, response => {
        this.detail = response.data.EjnlList[0];
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      });
    },
  }
};
</script>



