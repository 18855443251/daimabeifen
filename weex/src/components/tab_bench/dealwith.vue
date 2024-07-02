<template>
    <div class="container">
        <div class="content">
            <condition :tabindex="tabindex" @WorkList="fromChild($event)"></condition>
            <!-- 展示内容 -->
            <scroller class="list_info" :style="{bottom:absoluteBottom+'px'}" v-if="norecordFlag=='2'" @loadmore="loadmore" loadmoreoffset=5>
                 <!-- :style="{'height':list_height}" -->
                <div class="contents" >
                    <div class="allcontents" v-for="(item,index) in $store.state.dealList" :key="index" @click="jumpdetail(item)">
                        <div class="details">
                            <text class="details_type">{{item.TransName}}</text>
                            <text  class="details_amt" v-if="item.Amount">¥{{moneyFilter(item.Amount)}}</text>
                        </div>
                        <div class="details">
                            <text class="details_trstime">{{item.TransTime}}</text>
                            <text class="details_status">{{runstatus(item.TrsFlag)}}</text>
                        </div>
                    </div>               
                </div>           
                <text class="moreText">{{pageText}}</text>
                <!-- <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'" v-if="hasMore">
                    <text>{{pageText}}</text>
                </loading> -->
            </scroller>
            <div class="empty" v-if="norecordFlag=='1'">
                <image class="emptyimg" :src="emptyurl"></image>
                <text class="emptytext">暂无查询记录</text>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading {
  width: 750;
  height: 40px;
  line-height: 40px;
  align-items: center;
  justify-content: center;
}
.moreText{
    width: 750px;
    height: 40px;
    font-size: 26px;
    text-align: center;
}
.emptytext{
    margin-top: 60px;
    /* width:212px;
    height:34px; */
    font-size:36px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.emptyimg{
    margin-top: 80px;
    width: 270px;
    height: 190px;
}
.empty{
    width: 750px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}
.list_info {
    width: 750px;
    position: fixed;
    top: 554px;
}
.kong{
    width: 750px;
    height: 120px;
}

.accounts{
  width:750px;
  height:100px;
  background-color:#ffffff;
    border-bottom-color: #ececec;
    border-bottom-style: solid;
    border-bottom-width: 10px;
}

.contents{
    width: 750px;
    display: flex;
    flex-direction: column;
}
.allcontents{
    width: 690px;
    height: 150px;
    margin-top: 20px;
    margin-left: 30px;
    background-color: #ffffff;
    border-width: 1px;
    border-color: rgb(245, 245, 245);
    border-style:solid;
    border-radius: 12px;
    flex-direction: column;
    align-items: center;
}
.details{
    margin-left: 15px;
    margin-right: 15px;
    flex-direction: row;
    justify-content: space-between;
    width: 642px;
    height: 65px;
    line-height: 65px;
    align-items: center;
}
.details_trstime{
    font-size: 24px;
    color: #AAAAAA;
}
.details_status{
    font-size: 28px;
    color: #7C7C7C;
}
.details_type{
    font-size: 30px;
    color: #333333;
    margin-top: 35px;
    font-weight: bold;
}
.details_amt{
    font-size: 32px;
    color: #333333;
    margin-top: 32px;
}
.container {
  background-color: rgb(250,250,250);
}
.content {
  width: 750px;
  position: relative;
  flex-direction: column;
}
</style>

<script>
    import Condition from "./condition.vue";
    const context = weex.requireModule("context");
    const modal = weex.requireModule("modal");
    export default {
        components: {Condition},
        data() {
            return {
                emptyurl:'./imgs/tab_bench/empty@3x.png',
                absoluteBottom: this.isipx() ? 100 + 50 : 100, 
                // dealList: [],
                menuIndex:0,
                tabindex:"2",
                starttime:"",
                endtime:"",
                StartAmount:"",
                EndAmount:"",
                begindate:"",
                enddate:"",
                timeflag:"M1",//默认查询本月
                transcode:"",
                jnlstate:"",
                showBtn: "",
                CurrentIndex:'',//每次查询从第几条开始，例如一页10条，依次是0,10,20
                CurrentPage:0,//当前是第几页
                PageSize:'20',
                hasMore: true,
                loadinging: false,
                pageText:'',
                conditionParams:'',
                norecordFlag:'0',//是否显示无记录的背景图
                jumpNums:true
            }
        },
        watch:{
            "$store.state.launcherTabbarTimes":{
                handler(newV,oldV){
                    this.$store.state.dealList=[];
                    this.getDealList();
                }
            },
        },
        computed:{
            //监听列表高度
            list_height:function(){
            var height = 750/weex.config.env.deviceWidth*weex.config.env.deviceHeight - 564;
            return height;
            }
        },
        created() {          
            this.$store.state.dealList=[];
            this.getDealList();   
        },
        methods: { 
            loadmore(){
                if(this.hasMore){
                    if(this.conditionParams){
                        this.getDealList(this.conditionParams);
                    }else{
                        this.getDealList();
                    }
                }
            },
            onloading(){
                if(this.conditionParams){
                    this.getDealList(this.conditionParams);
                }else{
                    this.getDealList();
                }
            },
            // 接受子组件传来的数据
            fromChild(data){
                // this.dealList = data;
                this.CurrentPage=0;//按条件查询时将当前页清0
                this.$store.state.dealList=[];//清空当前数据
                this.loadinging=false;
                this.hasMore=true;
                this.conditionParams=data;
                this.getDealList(data);//筛选框组件传入的筛选条件   
            },           
            // 请求我处理的数据列表
            getDealList(conditionParams) {
                this.CurrentIndex=this.CurrentPage*this.PageSize;
                //服务需要上送的字段
                var params = {
                    TransCode:this.transcode,
                    JnlState:"0",
                    StartAmount:this.StartAmount,
                    EndAmount:this.EndAmount,
                    BeginDate:this.begindate,
                    EndDate:this.enddate,
                    TimeFlag:this.timeflag,
                    CurrentIndex:this.CurrentIndex,
                    PageSize:this.PageSize
                };
                if(conditionParams){
                    Object.assign(params,conditionParams);
                }
                this.goJson("/eweb/AuthMyDealQry.do", params, response => {
                    this.$store.state.dealList=this.$store.state.dealList.concat(response.data.EtrsJnlList);  
                    if(this.$store.state.dealList.length=='0'){
                        this.norecordFlag='1';
                    }else{
                        this.norecordFlag='2';
                    }
                    if (this.$store.state.dealList.length <response.data.RecordNumber) {
                        this.pageText="上拉加载更多数据";
                        this.CurrentPage++;
                    } else {
                        this.pageText="暂无更多数据";
                        this.hasMore = false;
                    }       
                });
            },
            // 根据TransCode跳转不同详情页       
            jumpdetail(item){
                context.sessionSetString("everyDetailInfo",JSON.stringify(item));
                context.sessionSetString("TransStatus", item.TrsFlag);
                context.sessionSetString("TransName", item.TransName);
                context.sessionSetString("JnlNo", item.JnlNo);
                context.sessionSetString("TransCode", item.TransCode);
                context.sessionSetString("showBtn", "1");
                if(this.jumpNums){
                    this.jumpNums=false;
                    if(item.TransCode == "Transfer") {//转账（详情完成）
                        context.launchStage("main.hnzzdetail");
                    } else if (item.TransCode == "AgentSalary") {//代发工资
                        context.launchStage("main.dfgzdetail");
                    } else if (item.TransCode == "EndorsementApply") {//背书转让
                        context.launchStage("main.bszrdetail");
                    } else if (item.TransCode == "ewjrcb.RealTimeSettlement") {//实时结汇（部分参数无）
                        context.launchStage("main.ssjhdetail");
                    } else if (item.TransCode == "IssuanceRequest") {//提示收票（详情完成，票据状态无）
                        context.launchStage("main.tspjdetail");
                    } else if (item.TransCode == "DiscountApply") {//贴现详情(大部分参数无)
                        context.launchStage("main.txdetail");
                    } else if (item.TransCode == "CheckReserveBuy") {//预约购买支票详情
                        context.launchStage("main.yygmzpdetail");
                    }else if (item.TransCode == "AcceptSign") {//票据签收
                        context.launchStage("main.pjqsdetail");
                    }else if (item.TransCode == "TransferNotRealTimeCancel") {//转账撤销
                        context.launchStage("main.transferCanceldetail");
                    } else if (item.TransCode == "MCertAuthModeMgmtForMore") {//云盾开通
                        context.launchStage("main.yundunOpen");
                    } else if (item.TransCode == "MCertAuthResetPwdForMore") {//云盾密码重置
                        context.launchStage("main.yundunResetPsw");
                    }else if(item.TransCode == "CheckReserveModify"){
                        context.launchStage("main.zpwh");
                    }
                    setTimeout(()=>{
                        this.jumpNums=true;
                    },1000)
                }
            },  
        },   
    }
</script>
