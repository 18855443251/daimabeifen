<template>
<div class="wrapper">
    <NavBar :title="title"></NavBar>
    <condition :tabindex="tabindex" @WorkList="change($event)"></condition>
    <scroller class="list_info" v-if="checkList.length>0" @loadmore="loadmore" loadmoreoffset=1>
        <div class="contents">
            <div class="content">
                <div class="allcontents" v-for="(item,index) in checkList" :key="index">
                    <image  class="selectimg" :src="selecturl" @click="select(index)" v-if="item.selectShow==true"></image>
                    <image  class="selectimg" :src="unselecturl" @click="select(index)" v-if="item.selectShow==false"></image>
                    <div  @click="jumpdetail(item)">
                        <div class="details">
                            <text class="details_type">{{item.TransName}}</text>
                            <text  class="details_amt" v-if="item.Amount">¥{{item.Amount}}</text>
                        </div>
                        <div class="details">
                            <text class="details_trstime">{{item.TransTime}}</text>
                            <text class="details_status">待审核</text>
                        </div>
                    </div>
                </div>
            </div>           
        </div>
        <text class="moreText">{{pageText}}</text>
        <div class="kong"></div>
        <div class="footer">
            <div class="selectall">
                <image class="selectimga" :src="unselecturl" v-if="$store.state.showall==false"  @click="selectall"></image>
                <image class="selectimga" :src="selecturl" v-if="$store.state.showall==true"  @click="selectall"></image>
                <text class="select"  @click="selectall">全选</text>
                <text class="selecttotal" v-if="$store.state.showall==true">{{$store.state.checkTotal}}/{{$store.state.checkTotal}}</text>
                <text class="selecttotal" v-if="$store.state.showall==false">{{$store.state.tocheck}}/{{$store.state.checkTotal}}</text>
                <!-- <text class="total"  v-if="showall==false">总金额 ¥0.00</text> -->
                <text class="total">总金额 ¥{{moneyFilter($store.state.totalAmount)}}</text>
            </div>
            <div class="button">
            <div class="left_button" @click="refuse">
                <text class="font32 red">拒绝</text>
            </div>
            <div class="right_button" @click="pass">
                <text class="font32 white">通过</text>
            </div>
            </div>
        </div>       
    </scroller>
    <div class="empty" v-else>
        <image class="emptyimg" :src="emptyurl"></image>
        <text class="emptytext">暂无查询记录</text>
    </div>      
</div>


</template>

<style scoped>
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
.selectimg {
  width: 34px;
  height: 34px;
  margin-left: 24px;
  margin-bottom: 30px;
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
    margin-top: 180px;
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
.kong{
    width: 750px;
    height: 200px;
}
.selecttotal{
  margin-left: 10px;
  font-size: 28px;
  color: #333333;
}
.select{
  font-size: 28px;
  color: #AAAAAA;
}
.total{
  font-size: 30px;
  color: #333333;
  width: 350px;
  text-align: right;
  margin-left: 30px;
}
.selectimga {
  width: 34px;
  height: 34px;
  margin-right: 20px;
  margin-left: 40px;
}
.white{
  color: #ffffff;
}
.red{
  color: #E6022C;
}
.font32{
  font-size: 32px;
}
.selectall{
  height: 80px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
}
.button{
  height: 90px;
  flex-direction: row;
}
.footer{
    position: fixed;
    bottom:0px;
    flex-direction: column;
    height: 180px;
    width: 750px;
    background-color: #ffffff;
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #eee;
}
.left_button{
    width: 325px;
    height: 88px;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: #E6022C;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #E6022C;
    border-right-style: solid;
    border-right-width: 2px;
    border-right-color: #E6022C;
    border-left-style: solid;
    border-left-width: 2px;
    border-left-color: #E6022C;
    /* border: 2px solid #E6022C; */
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
}
.right_button{
    margin-left: 40px;
    width: 325px;
    height: 88px;
    /* background-color: #E6022C; */
    background-image: linear-gradient(to right,#FB5D7A,#E6022C);
    /* background-image: linear-gradient(124deg, #FB5D7A 0%, #E6022C 100%); */
    border-radius: 12px;
    align-items: center;
    justify-content: center;
}
.moreText{
    width: 750px;
    height: 40px;
    line-height: 40px;
    font-size: 26px;
    text-align: center;
}
</style>

<script>
    const context = weex.requireModule("context");
    const modal = weex.requireModule("modal");
    const stream = weex.requireModule("stream");
    import NavBar from "@/components/templet/titlebar";
    import Condition from "@/components/tab_bench/condition.vue";
export default {
    components: { NavBar, Condition },
    data() {
        return {
            title: "待审核",
            unselecturl:'./imgs/tab_bench/unselected@3x.png',
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
            timeflag:"",
            transcode:"",
            showBtn: "",
            checkitemList: [],
            CurrentIndex:'',//每次查询从第几条开始，例如一页10条，依次是0,10,20
            CurrentPage:0,//当前是第几页
            PageSize:'20',
            hasMore: true,
            loadinging: false,
            pageText:'',
            conditionParams:''
        };
    },
    mounted() {
        this.getCheck()
    },
    methods: {
        //加载更多
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
             this.CurrentPage=0;//按条件查询时将当前页清0
            this.checkList=[];//清空当前数据
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
                // BeginDate:"2018-01-06",
                // EndDate:"2019-10-13",
                TimeFlag:this.timeflag,
                CurrentIndex:this.CurrentIndex,
                PageSize:this.PageSize
            };
            if(conditionParams){
                Object.assign(params,conditionParams);
            }
            this.goJson("/eweb/AuthListForMob.do", params, response => {
                this.checkList=this.checkList.concat(response.data.EjnlList);
                for(let i in this.checkList){
                    this.checkList[i].selectShow=false;
                }
                if (this.checkList.length <response.data.RecordNumber) {
                    this.pageText="上拉加载更多数据";
                    this.CurrentPage++;
                } else {
                    this.pageText="暂无更多数据";
                    this.hasMore = false;
                } 
                this.$store.state.checkList=this.checkList
                this.$store.state.checkTotal=response.data.RecordNumber;
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
            this.$store.state.totalAmount=totalAmount+"";
        },
        //选项判断
        selectall(){
            this.$store.state.showall=!this.$store.state.showall;
            this.$store.state.totalAmount= 0;
            if(this.$store.state.showall==true){
                for(let i in this.$store.state.checkList){
                this.$store.state.checkList[i].selectShow=true;
                this.$store.state.checkList.splice(i,1,this.$store.state.checkList[i])
                if(this.$store.state.checkList[i].Amount){
                    this.$store.state.totalAmount += this.$store.state.checkList[i].Amount*1;
                }
                
                }
                this.$store.state.selectList=this.$store.state.checkList;
                this.$store.state.tocheck=this.$store.state.checkList.length;
            }else if(this.$store.state.showall==false){
                for(let i in this.$store.state.checkList){
                this.$store.state.checkList[i].selectShow=false;
                this.$store.state.checkList.splice(i,1,this.$store.state.checkList[i])
                }
                this.$store.state.tocheck = 0;
                this.$store.state.selectList=[];
                this.$store.state.totalAmount= 0;
            }
            this.$store.state.totalAmount=this.$store.state.totalAmount.toFixed(2);
        },
            // 点击拒绝跳转
        refuse(){
            if(this.$store.state.selectList.length<1){
                this.showOneBtnAlert("请选择待审核交易","确定");
                return
            }
            context.sessionSetString("tocheck", this.$store.state.tocheck);
            context.sessionSetString("totalAmount", this.$store.state.totalAmount);
            context.sessionSetString("selectLists", JSON.stringify(this.$store.state.selectList));
            context.sessionSetString("checkFlag", "0");
            context.launchStage("main.WorkSpaceCheck");
            // var params = {
            //     selectList: this.$store.state.selectList,
            //     checkFlag:"0"
            // };
            // this.jumpBundle("Check", params);
        },
        // 点击通过跳转
        pass(){
            if(this.$store.state.selectList.length<1){
                this.showOneBtnAlert("请选择待审核交易","确定");
                return
            }
            context.sessionSetString("tocheck", this.$store.state.tocheck);
            context.sessionSetString("totalAmount", this.$store.state.totalAmount);
            context.sessionSetString("selectLists", JSON.stringify(this.$store.state.selectList));
            context.sessionSetString("checkFlag", "1");
            context.launchStage("main.WorkSpaceCheck");
            // var params = {
            //     selectList: this.$store.state.selectList,
            //     checkFlag:"1"
            // };
            // this.jumpBundle("Check", params);
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
                context.launchStage("main.Pjqsdetail");
            }else if (item.TransCode == "TransferNotRealTimeCancel") {//转账撤销
                    context.launchStage("main.transferCanceldetail");
            } else if (item.TransCode == "MCertAuthModeMgmtForMore") {//云盾开通
                context.launchStage("main.yundunOpen");
            } else if (item.TransCode == "MCertAuthResetPwdForMore") {//云盾密码重置
                context.launchStage("main.yundunResetPsw");
            }
        },

    }
    
}
</script>