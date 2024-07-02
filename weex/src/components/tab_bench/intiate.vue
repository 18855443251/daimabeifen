<template>
    <div style="background-color: #ffffff;">
        <!-- <div class="content"> -->
            <condition :tabindex="tabindex" @WorkList="change($event)"></condition>
            <!-- 展示内容 -->
            <scroller class="list_info" v-if="norecordFlag=='2'" :style="{bottom:absoluteBottom+'px'}" @loadmore="loadmore" loadmoreoffset=5>
                 <!-- :style="{'height':list_height}" -->
                    <div class="contents">
                        <div class="allcontents" v-for="(item,index) in $store.state.checkList" :key="index">
                            <image  class="selectimg" :src="selecturl" @click="select(index)" v-if="item.selectShow==true"></image>
                            <image  class="selectimg" :src="unselecturl" @click="select(index)" v-if="item.selectShow==false"></image>
                            <div @click="jumpdetail(item)">
                                <div class="details">
                                    <text class="details_type">{{item.TransName}}</text>
                                    <text  class="details_amt" v-if="item.Amount">¥{{moneyFilter(item.Amount)}}</text>
                                </div>
                                <div class="details">
                                    <text class="details_trstime">{{item.TransTime}}</text>
                                    <text class="details_status">待审核</text>
                                </div>
                            </div>
                        </div>               
                    </div>          
                    <text class="moreText">{{pageText}}</text>
            </scroller>
            <div class="empty" v-if="norecordFlag=='1'">
                <image class="emptyimg" :src="emptyurl"></image>
                <text class="emptytext">暂无查询记录</text>
            </div>
        <!-- </div> -->
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
    margin-top: 150px;
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
    z-index: 100;
}
.kong{
    width: 750px;
    height: 220px;
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
    flex-direction: row;
    align-items: center;
}
.details{
    margin-left: 24px;
    padding-right: 24px;
    flex-direction: row;
    justify-content: space-between;
    width: 600px;
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
}
.details_amt{
    font-size: 32px;
    color: #333333;
    margin-top: 32px;
}
.content {
  width: 750px;
  position: relative;
  flex-direction: column;
}
.selectimg {
  width: 34px;
  height: 34px;
  margin-left: 24px;
  margin-bottom: 30px;
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
                unselecturl:'./imgs/tab_bench/unselected@3x.png',
                absoluteBottom: this.isipx() ? 330 : 280, 
                selecturl:'./imgs/tab_bench/selected@3x.png',
                emptyurl:'./imgs/tab_bench/empty@3x.png',
                checkList: [],
                tabindex:"1",
                starttime:"",
                endtime:"",
                StartAmount:"",
                EndAmount:"",
                begindate:"",
                enddate:"",
                timeflag:"M1",
                transcode:"",
                showBtn: "",
                checkitemList: [],
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
            "$store.state.isGetCheck":{
                handler(oldV,newV){
                    this.$store.state.checkList=[];//清空原有数据
                    this.getCheck();
                },
                // immediate: true
            },
            "$store.state.launcherTabbarTimes":{
                handler(newV,oldV){
                    this.$store.state.checkList=[];
                    this.getCheck();
                }
            },
        },
        computed:{
            //监听列表高度
            list_height:function(){
                var height = 750/weex.config.env.deviceWidth*weex.config.env.deviceHeight - 674;
                return height;
            }
        },
        created() {
                 
        },
        mounted(){
            setTimeout(()=>{
                this.$store.state.checkList=[];
                this.getCheck();
                this.getAuduit();//在这个页面发这个交易，只为了获得要展示的待发起的总笔数，具体的数据list在各个组件中发  
            },50);
        },
        methods: {
            // 获取我发起的列表
            getAuduit() {
                //服务需要上送的字段
                var params = {
                    TransCode:this.transcode,
                    JnlState:"0",
                    AcNo:"",
                    StartAmount:this.StartAmount,
                    EndAmount:this.EndAmount,
                    BeginDate:this.begindate,
                    EndDate:this.enddate,
                    TimeFlag:this.timeflag
                };
                this.goJson("/eweb/MobQueryJnls.do", params, response => {
                    this.$store.state.AuthTotal=response.data.RecordNumber;
                });
            },
            loadmore(){
                if(this.hasMore){
                    if(this.conditionParams){
                        this.getCheck(this.conditionParams);
                    }else{
                        this.getCheck();
                    }
                }
            },
            
            // 获取子组件传来的数据
            change(data){
                    // this.checkList = data;
                    this.CurrentPage=0;//按条件查询时将当前页清0/
                    this.$store.state.checkList=[];//清空当前数据
                    this.loadinging=false;
                    this.hasMore=true;
                    this.conditionParams=data;
                    this.getCheck(data);//删选框组件传入的删选条件  
            },
            // 请求待审核数据列表            
            getCheck(conditionParams){
                this.CurrentIndex=this.CurrentPage*this.PageSize;
                //服务需要上送的字段
                var params = {
                    TransCode:this.transcode,
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
                this.goJson("/eweb/AuthListForMob.do", params, response => {
                    this.$store.state.checkList=this.$store.state.checkList.concat(response.data.EjnlList);
                    if(this.$store.state.checkList.length=='0'){
                        this.norecordFlag='1';
                    }else{
                        this.norecordFlag='2';
                    }
                    for(let i in this.$store.state.checkList){
                        this.$store.state.checkList[i].selectShow=false;
                    }
                    if (this.$store.state.checkList.length <response.data.RecordNumber) {
                        this.pageText="上拉加载更多数据";
                        this.CurrentPage++;
                    } else {
                        this.pageText="暂无更多数据";
                        this.hasMore = false;
                    }      
                    // this.$store.state.checkList=this.checkList
                    this.$store.state.checkTotal=response.data.RecordNumber;
                    this.$store.state.selectList=[];//清空已选择的数据
                    this.$store.state.tocheck="0";
                    this.$store.state.totalAmount="0.00";   
                    this.$store.state.showall=false;           
                });
            },
            //选择要审批的列表
            select(index){
                this.$store.state.checkList[index].selectShow=! this.$store.state.checkList[index].selectShow
                this.$store.state.checkList.splice(index,1, this.$store.state.checkList[index])
                var num=0;
                var totalAmount=0;
                var arr =[];
                for(let i in  this.$store.state.checkList){
                    if( this.$store.state.checkList[i].selectShow==true){
                        num++;
                        if(this.$store.state.checkList[i].Amount){
                            totalAmount+= this.$store.state.checkList[i].Amount*1
                        }
                        arr.push( this.$store.state.checkList[i])
                    }
                }
                if(arr.length == this.$store.state.checkList.length) {
                    this.$store.state.showall = true;
                }else{
                    this.$store.state.showall = false;
                }
                this.$store.state.selectList=arr;
                this.$store.state.tocheck=num;
                this.$store.state.totalAmount=totalAmount.toFixed(2);
            },
            // 根据TransCode跳转不同详情页  
            jumpdetail(item){ 
                var arr = [];
                arr.push(item);
                this.checkitemList = arr; 
                context.sessionSetString("everyDetailInfo",JSON.stringify(item));
                context.sessionSetString("selectList", JSON.stringify(this.checkitemList));               
                context.sessionSetString("TransName", item.TransName);
                context.sessionSetString("JnlNo", item.JnlNo);
                context.sessionSetString("TransCode", item.TransCode);
                context.sessionSetString("showBtn", "0");
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
                    }else if(item.TransCode == "CheckReserveModify"){//支票预约维护
                        context.launchStage("main.zpwh");
                    }
                    setTimeout(()=>{
                        this.jumpNums=true;
                    },1000)
                }
            },
    
        },
    };
</script>
