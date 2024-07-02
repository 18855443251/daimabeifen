<template>
  <wxc-popup
    popup-color="#ffffff"
    :show="$store.state.rightShowBol"
    @wxcPopupOverlayClicked="popupOverlayBottomClick"
    pos="right"
    :width="550">
    <scroller>
    <div class="titles">
      <text class="name">条件筛选</text>
      <text class="close" @click="closePopup">取消</text>
    </div>
    <text class="title_type" style="margin-top:30px;">查询时间</text>
    <div class="menu">
      <text class="menu_btn" v-for="(item,index) in menuTimeData" :key="index" 
       @click="menuClick(index,item)"
      :style="[{'margin-left':index==0||index==3?'0px':'10px'},
      {'background-color':index==menuIndex?'rgb(75,75,75)':'rgb(236,236,236)'},
      {'color':index==menuIndex?'rgb(254,254,254)':'rgb(34,34,34)'}]">{{item.text}}</text>
    </div>
    <div class="time_box" v-if="timeBol">
      <input type="date" v-model="startTime" placeholder="起始时间" class="pas_word" @change="getStartTimes" :max="newDate"/>
      <image :src="dateUrl" class="returns"></image>
      <input type="date" v-model="endTime" placeholder="结束时间" class="pas_word" @change="getEndTimes" :max="newDate"/>
    </div>
    <text class="title_type">收支类型</text>
    <div class="menu">
      <text class="menu_btn" v-for="(itemt,indext) in typeData" :key="indext"
        @click="menuTypeClick(indext,itemt)" 
      :style="[{'margin-left':indext==0||indext==3?'0px':'10px'},
      {'background-color':indext==menuTypeIndex?'rgb(75,75,75)':'rgb(236,236,236)'},
      {'color':indext==menuTypeIndex?'rgb(254,254,254)':'rgb(34,34,34)'}]">{{itemt.text}}</text>
    </div>
    <text class="title_type">排序</text>
    <div class="menu">
      <text class="menu_btn" v-for="(itemFar,indexFar) in farNear" :key="indexFar"
        @click="farNearclick(indexFar,itemFar)" 
      :style="[{'margin-left':indexFar==0||indexFar==3?'0px':'10px'},
      {'background-color':indexFar==farNearIndex?'rgb(75,75,75)':'rgb(236,236,236)'},
      {'color':indexFar==farNearIndex?'rgb(254,254,254)':'rgb(34,34,34)'}]">{{itemFar.text}}</text>
    </div>
    <text class="title_type">金额区间</text>
     <div class="time_box">
      <input type="number" v-model="StartAmount" placeholder="最低金额" class="pas_word"/>
      <image :src="dateUrl" class="returns"></image>
      <input type="number" v-model="EndAmount" placeholder="最高金额" class="pas_word"/>
    </div>
    <div class="btns">
      <text class="reset" @click="reset">重置</text>
      <text class="confirm" @click="confirm">确定</text>
    </div>
    </scroller>
  </wxc-popup>
</template>
<style scoped>
.titles{
  width:550px;
  height:120px;
  flex-direction: row;
  justify-content:space-between;
  border-bottom-style:solid;
  border-bottom-width:1px;
  border-bottom-color:rgb(221,221,221);
}
.name{
  color:rgb(0,0,0);
  font-size:30px;
  margin-left:24px;
  margin-top:64px;
  line-height:30px;
}
.close{
  color:rgb(153,153,153);
  font-size:26px;
  margin-right:32px;
  line-height:26px;
  margin-top:65px;
}
.title_type{
  color:rgb(153,153,153);
  font-size:26px;
  margin-left:24px;
  margin-top:40px;
}
.menu{
  width:550px;
  padding-left:24px;
  margin-top:20px;
  flex-direction: row;
  flex-wrap:wrap;
}
.menu_btn{
  width:160px;
  height:70px;
  margin-top:10px;
  margin-left:12px;
  text-align:center;
  line-height:70px;
  background-color:rgb(236,236,236);
  border-radius:4px;
  color:rgb(34,34,34);
  font-size:24px;
}
.time_box{
  flex-direction: row;
  align-items:center;
  width:550px;
  padding-left:24px;
  margin-top:30x;
}
.pas_word{
  width:200px;
  height:60px;
  border-style:solid;
  border-color:rgb(187,187,187);
  border-width:1px;
  border-radius:4px;
  font-size:26px;
}
.returns{
  width:30px;
  height:23px;
  margin-left:30px;
  margin-right:30px;
}
.btns{
  width:440px;
  height:80px;
  flex-direction: row;
  align-items:center;
  background-color:rgb(213,155,87);
  border-radius:40px;
  margin-top:100px;
  margin-left:55px;
  margin-bottom:100px;
}
.reset{
  width:220px;
  height:46px;
  line-height:46px;
  text-align:center;
  border-right-style:solid;
  border-right-width:1px;
  border-right-color:rgb(139,106,67);
  color:rgb(255,255,255);
  font-size:30px;
}
.confirm{
  width:220px;
  height:46px;
  line-height:46px;
  text-align:center;
  border-left-style:solid;
  border-left-width:1px;
  border-left-color:rgb(234,177,110);
  color:rgb(255,255,255);
  font-size:30px;
}


</style>

<script>
import { WxcPopup } from 'weex-ui';
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  props:["acBdkh"],
  components: {
    WxcPopup
  },
  data() {
    return {
      closeUrl: this.$store.state.imgBaseUrl + "/cancel@2x.png",
      dateUrl: this.$store.state.imgBaseUrl + "/date@2x.png",
      startTime:"",//input起始时间
      endTime:"",//input结束时间
      menuTimeData:[
        {text:'当天',time:"0d"},
        {text:'七天',time:"-1w"},
        {text:'一个月',time:"-1m"},
        {text:'三个月',time:"-3m"},
        {text:'自定义',time:''}
      ],
      BeginDate:this.$parent.yymmdd(new Date()),//开始时间
      EndDate:this.$parent.yymmdd(new Date()),//结束时间
      newDate:this.$parent.yymmdd(new Date()),//今天
      menuIndex:0,//时间索引
      timeText:"当天",//时间内容
      timeBol:false,//显示时间选择框
      typeData:[
        {text:'全部',time:''},
        {text:'支出',time:'1'},
        {text:'收入',time:'2'}
      ],
      InCome:"",//全部or支出or收入
      menuTypeIndex:0,
      InComeText:"全部",
      farNear:[
        {text:'由远及近',time:'1'},
        {text:'由近及远',time:'2'}
      ],
      TimeFlag:2,//正序
      FlagText:"正序",
      farNearIndex:1,
      StartAmount:"",//起始金额
      EndAmount:"",//终止金额
      clickTime:null,
      clickMoney:null
    }
  },
  created() {
    // modal.toast({ message: this.newDate+123 })
    if(this.acBdkh == "e"){
      this.typeData = [
        {text:'全部',time:''},
        {text:'支出',time:'1'},
        {text:'收入',time:'2'},
        {text:'转入',time:''},
        {text:'转出',time:''}
      ]
    }
  },
  methods: {
    menuClick(x,y){
      this.timeBol = false;
      this.menuIndex = x;
      if(x!=4){
        var group = y.time.match(/(-?\d+)([dDMmWw])/);
        var value = parseInt(group[1], 10),
            type = group[2].toUpperCase();
            this.clickTime=null
        if (type === 'D'){
          this.BeginDate = this.newDate;
          this.EndDate = this.newDate;
          this.timeText = y.text;
          this.clickTime=null
        }else if (type === 'W'){
          this.BeginDate = this.$parent.yymmdd(new Date(new Date().getTime() + (value *7* 24 * 3600 * 1000)));
          this.EndDate = this.newDate;
          this.timeText = y.text;
          this.clickTime=null
        }else if (type === 'M') {
          this.timeText = y.text;
          var date = new Date();
          date.setMonth(date.getMonth() + value)
          this.BeginDate = this.$parent.yymmdd(date);
          this.EndDate = this.newDate;
          this.clickTime=null
        }
      }else{
        this.timeText = y.text;
        this.timeBol = true;
      }
    },
    //全部or收入or支出
    menuTypeClick(x,y){
      this.menuTypeIndex = x;
      this.InCome = y.time;
      this.InComeText = y.text;
    },
    //正序or倒序
    farNearclick(x,y){
      this.farNearIndex = x;
      this.TimeFlag = y.time;
      if(y.time =="2"){
        this.FlagText = "正序";
      }
      if(y.time == "1"){
        this.FlagText = "倒序";
      }
    },
    //重置
    reset(){
      this.BeginDate = this.newDate;
      this.EndDate = this.newDate;
      this.TimeFlag = 2;
      this.InCome = "";
      this.menuIndex = 0;
      this.menuTypeIndex = 0;
      this.farNearIndex = 1;
      this.clickTime=null;
      this.clickMoney=null;
      this.timeBol = false;
      this.StartAmount = "";
      this.EndAmount="";
      this.startTime = "";
      this.endTime = "";
      this.FlagText= "正序";
      this.InComeText="全部";
      this.timeText="当天";//时间内容
    },
  //获取自定义初始时间
  getStartTimes(event){
    this.startTime = event.value
  },
  //获取自定义终止时间
  getEndTimes(event){
    this.endTime = event.value
  },

  confirm(){
    //自定义时间校验
    if(this.timeBol == true){
      if(this.startTime==""||this.endTime == ""){
        this.showOneBtnAlert("请输入自定义时间","确定",()=>{}) 
        this.clickTime = false;
        this.BeginDate = "";
        this.EndDate = "";
      }else{
        if(new Date(this.startTime).getTime() * 1>new Date(this.endTime).getTime() * 1){
          this.clickTime = false;
          this.showOneBtnAlert("起始时间不能大于终止时间","确定",()=>{})
        }else{
          this.clickTime = true;
          this.BeginDate = this.startTime;
          this.EndDate = this.endTime;
        }
      } 
    }
    const params = {
      InComeText:this.InComeText,
      timeText:this.timeText,
      FlagText:this.FlagText,
      BeginDate:this.BeginDate,
      EndDate:this.EndDate,
      InCome:this.InCome,
      TimeFlag:this.TimeFlag,
      StartAmount:"",
      EndAmount:""
    }
    //金额区间校验
    var re = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    // if(this.StartAmount == ""&&this.EndAmount == ""){
    //     this.clickMoney = false;
    //     this.showOneBtnAlert("请输金额","确定",()=>{})
    // }else{
        if(this.StartAmount !=""&&this.EndAmount != ""){
          if(re.test(this.StartAmount)&&re.test(this.EndAmount)){
              if(this.EndAmount*1<this.StartAmount*1){
                this.clickMoney = false;
                this.showOneBtnAlert("金额区间格式不正确","确定",()=>{})
              }else{
                this.clickMoney = true;
                params.StartAmount = this.StartAmount;
                params.EndAmount = this.EndAmount;
              }
          }else{
              this.clickMoney = false;
              this.showOneBtnAlert("金额区间格式不正确","确定",()=>{})
          }
      }else{
        if(this.StartAmount !=""||this.EndAmount != ""){
                this.clickMoney = true;
                params.StartAmount = this.StartAmount;
                params.EndAmount = this.EndAmount;
        }
      }

  
    if(this.clickMoney!=false&&this.clickTime!=false){
      this.$emit("screen",params);
      this.popupOverlayBottomClick();
    }
  },
  //关闭这个下部弹框
    popupOverlayBottomClick(){
       this.$store.state.rightShowBol=false;
    },
    closePopup(){
      this.popupOverlayBottomClick();
    }
  }
};
</script>