<template>
    <div class="container">
            <condition :tabindex="tabindex" @WorkList="change($event)"></condition>
            <!-- 展示内容 -->           
            <list class="list_info" :style="{bottom:absoluteBottom+'px'}" v-if="norecordFlag=='2'" @loadmore="loadmore" loadmoreoffset=5>
                <!--  :style="{'height':list_height}" -->
                    <cell v-for="(item,index) in $store.state.auduitList" :key="index" @click="jumpdetail(item)">
                        <div class="allcontents">
                            <div class="details">
                                <text class="details_type">{{item.TransName}}</text>
                                <text  class="details_amt" v-if="item.Amount">¥{{moneyFilter(item.Amount)}}</text>
                            </div>
                            <div class="details">
                                <text class="details_trstime">{{item.TransTime}}</text>
                                <text class="details_status">{{runstatus(item.TrsFlag)}}</text>
                            </div>   
                        </div> 
                    </cell>
                    <cell>
                        <text class="moreText">{{pageText}}</text>
                    </cell>
                <!-- <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'" v-if="hasMore">
                    <text>{{pageText}}</text>
                </loading> -->
            </list>
            <div class="empty" v-if="norecordFlag=='1'">
                <image class="emptyimg" :src="emptyurl"></image>
                <text class="emptytext">暂无查询记录</text>
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
.indicator-text {
  color: #888888;
  font-size: 30px;
  text-align: center;
}
.indicator {
  margin-top: 16px;
  height: 40px;
  width: 40px;
  color: blue;
}
.emptytext{
    margin-top: 60px;
    /* width:212px;
    height:34px; */
    font-size:36px;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.emptyimg{
    margin-top: 80px;
    width: 318px;
    height: 233px;
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

.contents{
    /* position: absolute; */
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
    position: relative;
    /* box-shadow: 0 10px 15px rgba(200, 96, 96, 0.14); */
    flex-direction: column;
    align-items: center;
}
.details{
    margin-left: 15px;
    margin-right: 15px;
    flex-direction: row;
    justify-content: space-between;
    width: 635px;
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
    const context = weex.requireModule("context");
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule("modal");
    const stream = weex.requireModule("stream");
    import Bottom from "../templet/bottom.vue";
    import Condition from "./condition.vue";
    export default {
        components: {Condition ,Bottom},    
        props: {
            activeTab: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                emptyurl:'./imgs/tab_bench/empty@3x.png',  
                absoluteBottom: this.isipx() ? 100 + 50 : 100,       
                tabindex:"0",
                StartAmount:"",
                EndAmount:"",
                jnlState:"",
                begindate:"",
                enddate:"",
                timeflag:"M1",
                transcode:"",
                // auduitList: [],
                showBtn: "",
                CurrentIndex:'',//每次查询从第几条开始，例如一页10条，依次是0,10,20
                CurrentPage:0,//当前是第几页
                PageSize:'20',
                hasMore: true,
                loadinging: false,
                pageText:'',
                conditionParams:'',
                norecordFlag:'0',//是否显示无记录的背景图
                jumpNums:true//防止点击多次跳转多次
            }
        },
        computed:{
            //监听列表高度
            list_height:function(){
                var height = 750/weex.config.env.deviceWidth*weex.config.env.deviceHeight - 564;
                return height;
            }
        },
        watch:{
            "$store.state.launcherTabbarTimes":{
                handler(newV,oldV){
                    this.$store.state.auduitList=[];
                    this.getAuduit();
                }
            },
        },
        created(){
            
        },
        mounted() {
            this.$store.state.auduitList=[];
            this.getAuduit();
        },
        methods: {
            // 获取子组件传来的数据
            change(data){               
                // this.auduitList = data; 
                this.CurrentPage=0;//按条件查询时将当前页清0
                this.$store.state.auduitList=[];//清空当前数据
                this.loadinging=false;
                this.hasMore=true;
                this.conditionParams=data;
                this.getAuduit(data);//删选框组件传入的删选条件               
            },
            // 获取我发起的列表
            getAuduit(conditionParams) {
                this.CurrentIndex=this.CurrentPage*this.PageSize;
                //服务需要上送的字段
                var params = {
                    TransCode:this.transcode,
                    JnlState:"0",
                    AcNo:"",
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
                this.goJson("/eweb/MobQueryJnls.do", params, response => {                   
                    this.$store.state.auduitList=this.$store.state.auduitList.concat(response.data.EjnlList);
                    if(this.$store.state.auduitList.length=='0'){
                        this.norecordFlag='1';
                    }else{
                        this.norecordFlag='2';
                    }
                    this.$store.state.AuthTotal=response.data.RecordNumber;
                    if (this.$store.state.auduitList.length <response.data.RecordNumber) {
                        this.pageText="上拉加载更多数据……";
                        this.CurrentPage++;
                    } else {
                        this.pageText="暂无更多数据";
                        this.hasMore = false;
                    }
                });
            },
            loadmore(){
                if(this.hasMore){
                    if(this.conditionParams){
                        this.getAuduit(this.conditionParams);
                    }else{
                        this.getAuduit();
                    }
                }
            },
            onloading(){
                if(this.conditionParams){
                    this.getAuduit(this.conditionParams);
                }else{
                    this.getAuduit();
                }
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
                    } else if (item.TransCode == "MCertAuthModeMgmtForMore"||item.TransCode == "MCertAuthModeMgmt") {//云盾开通
                        context.launchStage("main.yundunOpen");
                    } else if (item.TransCode == "MCertAuthResetPwdForMore"||item.TransCode == "MCertPinClear") {//云盾密码重置
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
