<template>
  <div>
    <nav-bar title="转账记录查询"></nav-bar>
    <div class="maintext" :style="getPosiScrollerTop">
        <div class="filter">
            <div class="edgeBottomLine"></div>
            <div class="filter_left" :class="[filterZiDuan==0?'active_filter_left':'']" @click="showFilterModal(0)">
                <text class="selectTextSty" style="margin-right:10px;">{{PayerAcNo.slice(-4)}}</text>
                <image :src="imgdownAcNo" class="filter_img" />
            </div>
            <div class="filter_left" :class="[filterZiDuan==1?'active_filter_left':'']" @click="showFilterModal(1)">
                <text class="selectTextSty" style="margin-right:10px;">{{datename}}</text>
                <image :src="imgdownDate" class="filter_img" />
            </div>
            <div class="filter_left" :class="[filterZiDuan==2?'active_filter_left':'']" @click="showFilterModal(2)">
                <text class="selectTextSty" style="margin-right:10px;">{{statusname}}</text>
                <image :src="imgdownStatus" class="filter_img" />
            </div>
            <div class="edgeBottomLine"></div>
        </div>
        <scroller style="background-color:#fafafa;">
          <div style="padding-left:30px;" v-for="(item,index) in recordList" :key="index">
              <text class="everyColDateTitle">{{item.Date}}</text>
              <div class="singleItemInfo" v-for="(item2,index2) in item.List" :key="index2" @click="jumpdetail(item2)" >
                  <image :src="imgdata(item2.PyeBnkNo,item2.PyeBnkNm)" class="logImg" />
                  <div style="width:566px;justify-content:center;">
                      <div class="reversateCodeBox" style="margin-bottom:15px;">
                          <text class="reversateNet" style="width:420px">{{item2.skrhm}}(尾号{{dividelastfour(item2.PyeAcctNo)}})</text>
                          <text class="blueReversateCodeStatus">{{$store.state.recordState[item2.TxnSt]}}</text>
                          <image class="arrow" src="./imgs/greyRightArrow.png" />
                      </div>
                      <div class="reversateCodeBox">
                          <text class="reversateCodeChin">金额</text>
                          <text class="reversateCode">-¥{{item2.TxnAmt}}</text>
                      </div>
                      <div class="reversateCodeBox">
                          <text class="reversateCodeChin">交易日期</text>
                          <text class="reversateCodeChin">{{dealTimeLine(item2.OrgnlTxnCnlDt)}}</text>
                      </div>
                  </div>
              </div>
          </div>
        </scroller>
        <!-- 筛选遮罩层 -->
        <div v-if="filterModal" style="position:absolute;top:80px;bottom:0px;width:750px;background-color:rgba(0,0,0,0.6)" @click="prevent">
            <div class="filterModal">
                <div v-if="filterZiDuan=='0'">
                    <div style="width:750px;height:558px;background-color:#fff;">
                        <scroller style="width:750px;height:470px;">
                          <text class="AcNoColSty" :class="[AcNoindex==index ? 'activeAcNo' : '']" v-for="(item,index) in AcNoList" :key="index" @click="chooseAcNo(index)">{{item.AcNo}}</text>
                        </scroller>
                        <div class="operateBtnBox">
                            <text class="resetBtn" @click="resetAcNoBtn">重置</text>
                            <text class="confirmBtn" @click="confirmBtn('AcNo')">确定</text>
                        </div>
                    </div>
                </div>
                <div v-else-if="filterZiDuan=='1'">
                    <div style="width:750px;height:558px;">
                        <div style="margin-left:30px;flex-direction:row;margin-top:60px;">
                            <text class="filterTitle">日期选择</text>
                            <text class="selectedDate" style="margin-left:30px;">({{BeginDate}}-{{EndDate}})</text>
                        </div>
                        <div class="DateBox" style="width:750px;">
                            <text class="everyDate" :class="[(dateindex==index&&item.activeStatus) ? 'activeDate' : '']" v-for="(item,index) in Navdata" :key="index" @click="choosedate(index,item)">{{item.date}}</text>
                        </div>
                        <div class="dateSelfCol" v-if="dateSelfColShow" style="margin-top:60px;">
                            <text class="dateSelf" @click="pickerBeginDate">{{BeginDate}}</text>
                            <text style="height:80px;line-height:80px;color:rgba(170,170,170,1);">—</text>
                            <text class="dateSelf" @click="pickerEndDate">{{EndDate}}</text>
                        </div>
                        <div class="operateBtnBox">
                            <text class="resetBtn" @click="resetBtn">重置</text>
                            <text class="confirmBtn" @click="confirmBtn('date')">确定</text>
                        </div>
                    </div>
                </div>
                <div v-else-if="filterZiDuan=='2'" style="width:750px;height:558px;">
                  <div class="DateBox" style="width:750px;margin-top:40px;">
                    <text class="everyDate" :class="[Statusindex==index ? 'activeDate' : '']" v-for="(item,index) in statusdata" :key="index" @click="choosestatus(index)">{{item.name}}</text>
                  </div>
                  <div class="operateBtnBox">
                      <text class="resetBtn" @click="resetStatusBtn">重置</text>
                      <text class="confirmBtn" @click="confirmBtn('status')">确定</text>
                  </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  import NavBar from "@/components/titlebar_component.vue";
  import { WxcOverlay } from "weex-ui";
  const stream = weex.requireModule("stream");
  const wjalert = weex.requireModule("weex-alert");
  const modal = weex.requireModule("modal");
  const pickerCalendar = weex.requireModule("picker");
  const context = weex.requireModule("context");
  export default {
    components: { NavBar, WxcOverlay },
    data() {
      return {
        searchInput:'',//输入的搜索条件
        filterModal:false,
        dateSelfColShow:false,
        filterZiDuan:'N',//保存点击的哪个删选条件
        PayerAcNo:'',//选择的账户
        TimeFlag:'1M',//选择的时间，，默认本月
        TxnSt:'',//转账记录的状态筛选条件的下标
        dateindex:'1',//选择的筛选条件的下标，默认本月
        AcNoindex:'0',
        Statusindex:'0',
        BeginDate:'',
        EndDate:'',
        datename:"本月",//日期筛选条件的值
        Navdata:[
          {date:"当天",value:"0",activeStatus:true},
          {date:"本月",value:"1M",activeStatus:true},
          {date:"近三月",value:"3M",activeStatus:true},
          {date:"近六月",value:"6M",activeStatus:true},
          {date:"自定义",value:"10",activeStatus:false}
        ],

        statusdata:[{name:"全部状态",value:""},{name:"交易成功",value:"PR45"},{name:"交易失败",value:"PR99"},{name:"可撤销",value:"PR12"},{name:"已撤销",value:"PR90"}],
        statusname:"全部",//转账记录的状态筛选条件的值
        AcNoList:[],//当前用户所有账户
        imgarrow: "./imgs/rightarrow_icon@3x.png",
        bookName: '',
        bookNameTemp: '输入用户名/账号/用途搜索',
        imgdownAcNo: "./imgs/solidDownArrow.png",
        imgdownDate: "./imgs/solidDownArrow.png",
        imgdownStatus: "./imgs/solidDownArrow.png",
        recordList:[
          // {
          //   Date:'2019-10-10',
          //   List:[
          //     {skrhm:"是你的卡是你的",PyeAcctNo:"4585662232522",TxnAmt:'8956',TxnSt:'PR19',OrgnlTxnCnlDt:'20191012'}
          //   ]
          // }
        ],
      };
    },
    created() {
      this.EndDate=this.getNowFormatDate('/');
      //初始化日期
      this.BeginDate=this.getFirstDate();
    //this.BeginDate=this.getNowFormatDate('/');
      this.PyeAcctNo=this.$route.query.PyeAcctNo||context.sessionGetString('PyeAcctNo');//query里是转账详情里查看与他人转账入口，session获取来的PyeAcctNo是从收款人登记簿进入的。
      this.getAcNo();
    },
    methods: {
      //选择开始日期
      pickerBeginDate(){
          pickerCalendar.pickDate({
              value: this.getNowFormatDate('-',this.BeginDate),
              max: this.getNowFormatDate('-'),
            },event => {
                  if (event.result === "success") {
                      this.BeginDate = this.getNowFormatDate('/',event.data);
                  }
              }
          );
      },
      //选择结束日期
      pickerEndDate(){
          pickerCalendar.pickDate({
              value: this.getNowFormatDate('-',this.EndDate),
              max: this.getNowFormatDate('-'),
            },event => {
                  if (event.result === "success") {
                      this.EndDate = this.getNowFormatDate('/',event.data);
                  }
              }
          );
      },
      //跳转到记录详情
      jumpdetail(item){
        this.$store.state.OtherRecordListInFo=item;
        this.jump({
           name:'otherRecordDetail',
        })
      },
      //查询转账交易记录
      getRecord(){
        this.recordList=[];
        let params={
            PayerAcNo:this.PayerAcNo,
            PyeAcctNo:this.PyeAcctNo,
            TimeFlag:this.searchInput?'10':this.TimeFlag,//默认当日0  this.Navdata[this.dateindex].value
            TxnSt:this.TxnSt,
            BeginDate:this.TimeFlag=='10'?this.getNowFormatDate('',this.BeginDate):'',
            EndDate:this.TimeFlag=='10'?this.getNowFormatDate('',this.EndDate):'',
        }
        this.post('/eweb/TransferQry.do', params , response => {
            this.recordList=response.data.List;
            if(this.recordList.length=='0'){
                wjalert.alert('暂无记录',"确定",data=>{});
            }
        })
      },
      //查询全部账户
      getAcNo(){
        this.post('/eweb/CommonAcNoListQry.do', {}, response => {
            this.AcNoList=this.AcNoList.concat(response.data.AcNoList);
            var supportType=['01','02','03','08'];
            this.PayerAcNo=this.AcNoList[0].AcNo;
            this.getRecord();
        })
      },
      //切换删选字段（全部，日期，转账记录状态）
      showFilterModal(param){
          if(this.filterZiDuan==param){
            this.filterModal=!this.filterModal;
          }else{
            this.filterModal=true;
          }
          this.filterZiDuan=param;
          if(param==0&&this.filterModal){
            this.imgdownAcNo='./imgs/solidUpArrow.png';
          }else{
            this.imgdownAcNo='./imgs/solidDownArrow.png';
          }
          if(param==1&&this.filterModal){
            this.imgdownDate='./imgs/solidUpArrow.png';
          }else{
            this.imgdownDate='./imgs/solidDownArrow.png';
          }
          if(param==2&&this.filterModal){
            this.imgdownStatus='./imgs/solidUpArrow.png';
          }else{
            this.imgdownStatus='./imgs/solidDownArrow.png';
          }
      },
      chooseAcNo(index){
          this.AcNoindex=index;
          this.PayerAcNo=this.AcNoList[index].AcNo;
      },
      //prevent方法解决安卓浮层点击穿透
      prevent(event){
        event.stopPropagation();
      },
      choosedate(index,item){
          this.imgdownDate='./imgs/solidDownArrow.png';
          this.dateindex=index;
          this.datename=item.date;
          this.TimeFlag=item.value;//获取选择日期的标志
          if(this.TimeFlag!='10'){
            if(this.TimeFlag!='1M'){
              this.BeginDate=this.calcDate(this.TimeFlag);
            }else{//本月
              this.BeginDate=this.getFirstDate();//本月第一天
            }
            this.EndDate=this.getNowFormatDate('/');
            this.dateSelfColShow=false;
            this.Navdata[4].activeStatus=false;
          }
          if(this.TimeFlag=='10'){
              //初始化日期 
              this.BeginDate=this.getNowFormatDate('/');
              this.EndDate=this.getNowFormatDate('/');
              item.activeStatus=!item.activeStatus;
              this.dateSelfColShow=!this.dateSelfColShow;
          }
      },
      choosestatus(index){
        this.Statusindex=index;
        this.statusname=this.statusdata[index].name;
        this.TxnSt=this.statusdata[index].value;
      },
      confirmBtn(param){
          //当前日期
          let nowdate=new Date();
          //两年前
          let twoYearAgotime=nowdate.setFullYear(nowdate.getFullYear()-2);
          //开始日期times
          let beginDateTime=new Date(this.BeginDate).getTime();
          //结束日期的times
          let enddate=new Date(this.EndDate)
          let endDateTime=enddate.getTime();
          //结束日期的一年前，用于判断查询跨度不能超过一年
          let endDateOneYearAgo=enddate.setFullYear(enddate.getFullYear()-1);
          if(beginDateTime<twoYearAgotime){
            wjalert.alert("最长查询2年内的转账记录","确定",data=>{});
            return;
          }else if(beginDateTime>endDateTime){
            wjalert.alert("结束日期不能小于开始日期","确定",data=>{});
            return;
          }else if(beginDateTime<endDateOneYearAgo){
            wjalert.alert("时间跨度最长不超过1年","确定",data=>{});
            return;
          }
          this.filterModal=!this.filterModal;
          if(param=='AcNo'){
            this.imgdownAcNo='./imgs/solidDownArrow.png';
          }else if(param=='date'){
            this.imgdownDate='./imgs/solidDownArrow.png';
          }else if(param=='status'){
            this.imgdownStatus='./imgs/solidDownArrow.png';
          }
          this.getRecord();
      },
      resetBtn(){
        this.imgdownDate='./imgs/solidDownArrow.png';
        this.dateindex=1;
        this.BeginDate=this.getFirstDate();//默认本月，所以BeginDate默认本月第一天
        this.EndDate=this.getNowFormatDate('/');
        this.datename=this.Navdata[this.dateindex].date;
        this.TimeFlag=this.Navdata[this.dateindex].value;//获取选择日期的标志
        this.dateSelfColShow=false;
      },
      resetAcNoBtn(){
        this.imgdownAcNo='./imgs/solidDownArrow.png';
        this.AcNoindex=0;
        this.PayerAcNo=this.AcNoList[this.AcNoindex].AcNo;
      },
      resetStatusBtn(){
        this.imgdownStatus='./imgs/solidDownArrow.png';
        this.Statusindex=0;
        this.statusname=this.statusdata[this.Statusindex].name;
        this.TxnSt=this.statusdata[this.Statusindex].value;
      }
    }
  };
</script>
<style scoped>
  input:focus{
    outline: none;
  }
  .maintext{
    position: fixed;
    /* top: 158px; */
    bottom: 0;
    width: 750px;
  }
  .listItem {
    border-bottom-color: #ccc;
    border-bottom-width: 1px;
    padding: 15px 25px;
    align-items: center;
  }
  .everyColDateTitle{
    margin-top: 20px;
    align-content: flex-start;
  }
  .singleItemInfo{
    width: 690px;
    margin-top: 20px;
    border-radius: 10px;
    padding: 20px;
    border-width: 1px;
    border-color: rgba(51,51,51,0.07);
    flex-direction: row;
    justify-content: space-between;
    background-color:#fff;
    /* align-items: center; */
  }
  .reversateNet{
    font-size:32px;
    width: 450px;
    font-family:PingFang SC;
    color:rgba(51,51,51,1);
    line-height:59px;
    padding-right: 10px;
  }
  .reversateCodeBox{
    flex-direction: row;
    align-items: center;
    text-align: right;
    justify-content: space-between;
  }
  .reversateDateBox{
    flex-direction: row;
  }
  .blueReversateCodeStatus{
    height: 42px;
    line-height: 42px;
    background-color:#E6022C;
    padding-left: 10px;
    padding-right: 10px;
    font-size:24px;
    font-weight:500;
    color:rgba(255,255,255,1);
    border-radius: 6px;
    text-align: center;
    margin-right: 10px;
  }
  .reversateCodeChin{
    font-size:28px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:56px;
  }
  .arrow {
    width: 18px;
    height: 30px;
  }
  .reversateCode{
    font-size:28px;
    font-family:PingFang SC;
    color:rgba(124,124,124,1);
    line-height:56px;
  }
  .reversateCodeStatus{
    width: 86px;
    height: 30px;
    background-color: #aaa;
    font-size:20px;
    font-weight:500;
    color:rgba(255,255,255,1);
    border-radius: 30px;
    text-align: center;
  }
  .flexrow {
    display: flex;
    flex-direction: row;
  }

  .logImg {
    width: 64px;
    height: 64px;
    margin-top: 20px;
    align-content: flex-start;
  }

  .searchInput{
    width:700px;
    height:80px;
  }

  .searchimg {
    width: 50px;
    height: 50px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .searchinput {
    line-height: 70px;
    border-radius: 10px;
    width: 600px;
  }
  .filter {
    justify-content: center;
    flex-direction: row;
    align-items: flex-end;
    height: 80px;
    /* border-bottom-width: 1px;
    border-bottom-color: rgba(234, 234, 234, 1); */
  }
  .selectTextSty{
    font-size:28px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:28px;
  }
  .edgeBottomLine{
      width: 60px;
      height: 80px;
      border-bottom-width: 1px;
      border-bottom-color: rgba(234, 234, 234, 1);
  }
  .filter_left {
    width: 210px;
    height: 70px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    /* width: 230px; */
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234, 234, 234, 1);
  }
  .active_filter_left{
    border-top-width: 1px;
    border-top-color: rgba(234, 234, 234, 1);
    border-right-width: 1px;
    border-right-color: rgba(234, 234, 234, 1);
    border-left-width: 1px;
    border-left-color: rgba(234, 234, 234, 1);
    border-bottom-width: 0px;
    border-bottom-color: rgba(255, 255, 255, 1);
  }
  .filter_mid {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    width: 300px;
  }

  .filter_right {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    flex-direction: row;
    width: 200px;
  }

  .filter_img {
    width: 18px;
    height: 12px;
    margin-left: 10px;
  }
  .filter_board {
    padding: 15px 25px;
    position: absolute;
    top: 230px;
    background-color: white;
    width: 750px;
    height: 300px;
  }

  .filter_tag_board {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }

  .filter_input_date {
    width: 240px;
    height: 60px;
    background-color: white;
    border-color: #999;
    border-width: 1px;
  }
  .shaixuanbox{
      flex-direction:row;
      width: 750px;
      height:500px;
  }
  .filter_title {
    line-height: 60px;
    width:250px;
  }
  .filterModal{
    width: 750px;
    /* height:500px; */
    background-color:#fff;
  }
  .DateBox{
    flex-direction: row;
    flex-wrap: wrap;
  }
  .operateBtnBox{
    position: absolute;
    flex-direction: row; 
    justify-content: space-between; 
    bottom: 0px;
    width: 750px;
    height: 88px;
  }
  .resetBtn{
    width: 375px;
    font-size: 32px;
    text-align: center;
    line-height: 88px;
    color:rgba(102,102,102,1);
    background-color: rgba(248,248,247,1);
  }
  .confirmBtn{
    width: 375px;
    font-size: 32px;
    text-align: center;
    line-height: 88px;
    color: #fff;
    background-image: -webkit-linear-gradient(right, #FB5D7A, #E7062F);
    background-image: -o-linear-gradient(right, #FB5D7A, #E7062F);
    background-image: -moz-linear-gradient(right, #FB5D7A, #E7062F);
    background-image: linear-gradient(to right, #FB5D7A, #E7062F);
  }
  .dateSelf{
    width: 312px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color:rgba(170,170,170,1);
    font-size:28px;
    border-radius:4px;
    border-width: 1px;
    border-color: rgba(221,221,221,1);
  }
  .dateSelfCol{
    margin-top: 20px;
    padding:0 25px;
    flex-direction:row;
    line-height:80px;
    color:rgba(170,170,170,1);
    justify-content:space-between;
  }
  .AcNoColSty{
    font-size:30px;
    padding-left: 30px;
    height: 90px;
    line-height: 90px;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234,234,234,1);
    color:rgba(124,124,124,1);
  }
  .filterTitle{
    font-size:30px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:30px;
  }
  .selectedDate{
    font-size:24px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:30px;
  }
  .everyDate{
    width:200px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top:25px;
    margin-left:25px;
    margin-right:25px;
    background-color: rgba(248,248,247,1);
    border-radius:4px;
    font-size:26px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .activeDate{
    background-color: #fff;
    border-width: 1px;
    border-color: rgba(230,2,44,1);
    color:rgba(230,2,44,1);
  }
  .activeAcNo{
    background-color: #fff;
    color:rgba(230,2,44,1);
  }
  .searchTopBox{
        margin-top:20px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .searchInputBox{
        width:690px;
        height:60px;
        border-radius:8px;
        border-width: 1px;
        border-color:#DDDDDD;
        align-self: center;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-left: 29px;
    }
    .searchIcon{
        width: 25px;
        height:25px;
        margin-right: 17px;
    }
    .searchInput{
        width:600px;
        height:50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(170,170,170,1);
    }
    .cancelSearch{
        color: #E6022C;
    }
</style>