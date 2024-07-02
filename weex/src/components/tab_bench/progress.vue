<template>
	<div class="container" >
        <scroller class="progress" scroll-direction="horizontal">
          <div :style="getProgressWidth">
            <!-- 流程图部分 -->
            <div class="iconLineBox">
                <!-- 经办人 -->
                <div class="stepIconBox" style="margin-left:109px;">
                  <image :src="blueIconFirst" class="stepIcon"></image>
                  <text class="liucehngnum">1</text>
                </div>
                <!-- 审核通过的流程图部分 -->
                <div style="flex-direction:row;" v-for="(item,index) in realShowItemList" :key="index">
                  <!-- 流程图的线条 -->
                    <image class="iconLine" :src="blueIconLineSrc"></image>
                    <!-- 流程图的圆圈 -->
                    <div class="stepIconBox">
                      <image :src="blueIconFirst" class="stepIcon"></image>
                      <text class="liucehngnum">{{item.AuthStep+1}}</text>
                    </div>
                </div>
                <!-- 审核拒绝的流程图部分 -->
                <div style="flex-direction:row;" v-if="isRefuseStatus">
                    <!-- 流程图的线条 -->
                    <image class="iconLine" :src="redIconLineSrc"></image>
                    <!-- 流程图的圆圈 -->
                    <div class="stepIconBox">
                      <image :src="redAgentIconFirst" class="stepIcon"></image>
                      <text class="liucehngnum">{{lastStepNum}}</text>
                    </div>
                </div>
                <!-- 最后一步显示交易结果的流程图，审核拒绝的不显示 -->
                <div style="flex-direction:row;"  v-if="!isRefuseStatus">
                    <!-- 流程图的线条 三种（蓝：成功或预受理，灰色：待审核，红色：失败） -->
                    <image class="iconLine" :src="blueIconLineSrc" v-if="TransStatus=='1'||TransStatus=='5'"></image><!-- 成功 -->
                    <image class="iconLine" :src="greyIconLineSrc" v-if="TransStatus=='3'"></image><!-- 待审核 -->
                    <image class="iconLine" :src="redIconLineSrc" v-if="TransStatus=='2'||TransStatus=='4'"></image><!-- 失败 -->
                    <!-- 流程图的圆圈 -->
                    <div class="stepIconBox">
                      <!-- 流程图的圆圈 三种（蓝：成功或预受理，灰色：待审核，红色：失败） -->
                      <image :src="blueIconFirst" class="stepIcon" v-if="TransStatus=='1'||TransStatus=='5'"></image>
                      <image :src="grayAgentIconFirst" class="stepIcon" v-if="TransStatus=='3'"></image>
                      <image :src="redAgentIconFirst" class="stepIcon" v-if="TransStatus=='2'||TransStatus=='4'"></image>
                      <text class="liucehngnum">{{lastStepNum}}</text>
                    </div>
                </div>
            </div>


            
            <div style="flex-direction: row;">
              <!-- 经办人 -->
              <div class="everyStepBox">
                  <text class="checkStatusText">经办</text>
                  <text class="checkPerson">{{everyDetailInfo.UserName}}</text>
                  <text class="checkPerson">{{everyDetailInfo.TransTime}}</text>
              </div>
              <!-- 审核通过的流程图部分 -->
              <div class="everyStepBox" v-for="(item,index) in realShowItemList" :key="index">
                  <text class="checkStatusText">通过</text>
                  <text class="checkPerson">{{item.AuthUserName}}</text>
                  <text class="checkPerson">{{item.AuthDate}}</text>
              </div>
              <!-- 审核拒绝的流程图部分 -->
              <div class="everyStepBox" v-if="isRefuseStatus">
                  <text class="checkStatusText redFont">{{resuseInfoMap.checkAuthText}}</text><!--审核结果-->
                  <div>
                    <text class="checkPerson">{{resuseInfoMap.AuthUserName}}</text>
                    <text class="checkPerson redFont">({{ellipsis(resuseInfoMap.refuseRemark,8)}})</text>
                  </div>
                  <text class="checkPerson">{{resuseInfoMap.AuthDate}}</text>
              </div>
              <!-- 最后一步显示交易结果的流程图，审核拒绝的不显示 -->
              <div class="everyStepBox" v-if="!isRefuseStatus">
                  <text class="checkStatusText" :class="[(TransStatus=='1'||TransStatus=='5')?'blueFont':((TransStatus=='2'||TransStatus=='4')?'redFont':'greyFont')]">{{runstatus(TransStatus)}}</text><!--审核结果-->
                  <div>
                    <!-- v-if="TransStatus=='2'" -->
                    <text class="checkPerson redFont">{{ellipsis(everyDetailInfo.ReturnMsg,8)}}</text><!--失败的原因-->
                  </div>
                  <text class="checkPerson" v-if="TransStatus=='1'||TransStatus=='2'||TransStatus=='4'">{{lastTransResultTime}}</text><!--成功或者失败显示交易时间-->
              </div>
            </div>
          </div>
        </scroller>
	</div>	
</template>
<style scoped>
.container {
    width: 750px;
    margin-top: 5px;
    background-color: rgb(236, 234, 234);
}
.progress{
  width: 750px;
  height: 203px;
  display: flex;
  background-color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
}
.iconLineBox{
  flex-direction: row;
}
.everyStepBox{
  width: 206px;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: flex-start;
  align-items: center;
  margin-left: 30px;
}
.stepIconBox{
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
}
.stepIcon{
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  
}
.liucehngnum{
  font-size: 26px;
  color: #fff;
}
.checkStatusText{
  font-family: Helvetica;
  font-size: 24px;
  color: #4A89FC;
  letter-spacing: 0;
  text-align: center;
}
.checkPerson{
  width: 206px;
  height: 24px;
  font-family: Helvetica;
  font-size: 20px;
  color: #9C9C9C;
  letter-spacing: 0;
  text-align: center;
  line-height: 24px;
  margin-top: 5px;
}
.blueFont{
  color: #4A89FC;
}
.greyFont{
  color: #9C9C9C;
}
.redFont{
  color: #E6022C;
}
.iconLine{
  width: 154px;
  height: 2px;
  margin-top: 23px;
  margin-left:17px;
  margin-right:17px;
  /* position: absolute;
  right: 65px; */
}









</style>
<script>
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  data() {
    return {
      blueIconFirst:"./imgs/tab_bench/blueIconFirst.png",
      blueIconLineSrc:"./imgs/tab_bench/bluespan@3x.png",
      redAgentIconFirst:'./imgs/tab_bench/redAgentIconFirst.png',
      redIconLineSrc:'./imgs/tab_bench/redspan@3x.png',
      grayAgentIconFirst:'./imgs/tab_bench/grayAgentIconFirst.png',
      greyIconLineSrc:'./imgs/tab_bench/grayspan@3x.png',

      CheckAuthItemList:[],//所有的审核人员List
      realShowItemList:[
        //{
          //   ReMark:null,
          //   AuthUserName:'董春雪',
          //   AuthState:1,
          //   AuthDate:'2020-01-08 16:09:19.669',
          //   AuthSeq:7533721,
          //   AuthStep:1, 
          //   AuthUserSeq:28062,
          //   UserGrpId:1
          // },
          // {
          //   ReMark:null,
          //   AuthUserName:'董春雪',
          //   AuthState:1,
          //   AuthDate:'2020-01-08 16:09:19.669',
          //   AuthSeq:7533721,
          //   AuthStep:1, 
          //   AuthUserSeq:28062,
          //   UserGrpId:1
          // },
          // {
          //   ReMark:null,
          //   AuthUserName:'董春雪',
          //   AuthState:1,
          //   AuthDate:'2020-01-08 16:09:19.669',
          //   AuthSeq:7533721,
          //   AuthStep:1, 
          //   AuthUserSeq:28062,
          //   UserGrpId:1
          // },
          // {
          //   ReMark:null,
          //   AuthUserName:'董春雪',
          //   AuthState:1,
          //   AuthDate:'2020-01-08 16:09:19.669',
          //   AuthSeq:7533721,
          //   AuthStep:1, 
          //   AuthUserSeq:28062,
          //   UserGrpId:1
          // },
      ],//过滤后实际要展示的审核通过人员list
      isRefuseStatus:false,//是否是被拒绝的审核
      refuseRemark:'',//拒绝审核的原因
      lastTransResultTime:'',//最后一步交易审核的时间
      resuseInfoMap:{
        checkAuthText:'拒绝',
        AuthUserName:'',
        AuthDate:'',
        refuseRemark:''
      },
      TransStatus: "",
      everyDetailInfo:{},
      lastStepNum:0,//最后一步数字
      authSuccStepNum:0,//中间审核部分流程图的最后一步的数字
    };
  },
  watch:{
    "$store.state.CheckAuthItemList":{
      handler(newV,oldV){
        this.CheckAuthItemList=this.$store.state.CheckAuthItemList;
        this.realShowItemList=[];
        this.filterAuthItemList();
      },
      immediate:true,
      deep:true
    }
  },
  created(){
    this.everyDetailInfo=JSON.parse(context.sessionGetString("everyDetailInfo"));//列表中带入的经办人信息
    this.TransStatus=context.sessionGetString("TransStatus");
    // this.TransStatus=1;
  },
  computed:{
    getProgressWidth(){
      var ProgressWidth=this.lastStepNum*236;
      return {width:ProgressWidth+"px"}
    }
  },
  methods: {
    //处理审核人员列表_AuthItemList
    filterAuthItemList(){
      if(this.CheckAuthItemList.length==0){//如果审核列表为空，则直接展示 经办人->待审核
        this.realShowItemList=[];
        this.lastStepNum=2;
        return;
      }else{
        for(let i=0;i<this.CheckAuthItemList.length;i++){
          if(this.CheckAuthItemList[i].ReMark){//因为拒绝原因是必输，所有Remark不为空的时候表明是拒绝的审核，则退出循环
              this.resuseInfoMap.AuthUserName=this.CheckAuthItemList[i].AuthUserName;
              this.resuseInfoMap.refuseRemark=this.CheckAuthItemList[i].ReMark;
              this.resuseInfoMap.AuthDate=this.CheckAuthItemList[i].AuthDate;
              this.lastTransResultTime=this.CheckAuthItemList[i].AuthDate;
              this.lastStepNum=this.CheckAuthItemList[i].AuthStep+1;
              this.isRefuseStatus=true;
              return;
          }else{
              if(this.CheckAuthItemList[i].AuthState==1){//表明是审核通过
                this.realShowItemList.push(this.CheckAuthItemList[i]);
                this.lastTransResultTime=this.CheckAuthItemList[i].AuthDate;
                this.lastStepNum=this.CheckAuthItemList[i].AuthStep+1+1;
              }else if(this.CheckAuthItemList[i].AuthState==0){//表明是未审核的
                return;
              }
          }
        }
      }
    },
  }
};
</script>



