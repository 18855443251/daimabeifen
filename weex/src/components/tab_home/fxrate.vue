<template>
  <div class="wrapper">
      <div class="row">
        <text class="banker-center-left">外汇查询</text>
        <text class="banker-center-center" >更新时间:{{ExchangeDate}}</text>
        <image :src='refreshurl' ref="block" class="img" @click="refresh"></image>
        <text class="banker-center-right" @click="jumpforexchange">更多</text>
      </div>
      <div class="row1" >
        <text class="rate_title0 margin32">币种</text>
        <div class="main">
          <text class="rate_title">现汇买入价</text>
          <text class="rate_title margin32">现汇卖出价</text>
        </div>
      </div>
      <div class="row" v-for="(item,index) in fxRateList" :key="index">
        <image src='./imgs/tab_home/fxrate/usd@3x.png' class="countryimg margin32" v-if="item.Currency=='USD'"></image>
        <image src='./imgs/tab_home/fxrate/gbp@3x.png' class="countryimg margin32" v-if="item.Currency=='GBP'"></image>
        <image src='./imgs/tab_home/fxrate/jpy@3x.png' class="countryimg margin32" v-if="item.Currency=='JPY'"></image>
        <image src='./imgs/tab_home/fxrate/eur@3x.png' class="countryimg margin32" v-if="item.Currency=='EUR'"></image>
        <text class="rate_title1">{{movespace(item.CurrencyName)}}({{item.Currency}})</text>
        <div class="main">
          <text class="rate_title ">{{item.Saleprice}}</text>
          <text class="rate_title margin32">{{item.Rbuyprice}}</text>
        </div>
      </div>
  </div>
</template>

<style scoped>
.countryimg{
  width: 64px;
  height: 48px;
}
.wrapper {
  margin-bottom: 20px;
  /* height: 98px; */
  /* background: #ffffff; */
  /* border-top: 16px solid rgb(239, 239, 244); */
}
.main {
  /* margin-left: 32px; */
  /* margin-right: 32px; */
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  margin-right: 64px;
}
.banker-center-right{
  text-align: center;
  font-size: 24px;
  color: #AAAAAA;
  line-height: 24px;
  margin-left: 50px;
}
.banker-center-center {
  width: 370px;
  text-align: center;
  font-size: 22px;
  color: #AAAAAA;
  line-height: 24px;
  margin-left: 30px;
}
.banker-center-left {
  font-size: 32px;
  font-weight: bold;
  color: #1a263f;
  margin-left: 30px;
}
.row {
  height: 88px;
  width: 750px;
  flex-direction: row;
  align-items: center;
}
.row1 {
  height: 88px;
  width: 750px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
}
.row2{
  height: 88px;
  width: 750px;
  flex-direction: row;
  /* justify-content: space-around; */
  align-items: center;
}
.row0{
  height: 68px;
  width: 750px;
  flex-direction: row;
  /* justify-content: space-around; */
  align-items: center;
  background-color: #f3f5f7;
}
.img{
  width: 32px;
  height: 32px;
}
.rate_title{
  font-size: 26px;
  color: #999999;
  text-align: center;
  width: 150px;
}
.rate_title0{
  font-size: 26px;
  color: #999999;
  width: 300px;
  text-align: left;
}
.rate_title1{
  font-size: 26px;
  color: #999999;
  width: 250px;
  text-align: center;
}
.margin32{
  margin-left: 32px;
}
.margin64{
  
  margin-left: 96px;
}
.marquee {
  width: 500px;
  height: 50px;
  margin-left: 30px;
  overflow: hidden;
}
.container {
  height: 300px;
  position: absolute;
}
.title {
  height: 50px;
  line-height: 50px;
  text-overflow: ellipsis;
  font-size: 28px;
  color: #ffffff;
}
</style>

<script>
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');
const modal = weex.requireModule("modal");
const animation = weex.requireModule("animation");

module.exports = {
  props: ['jsonurl'],
  data() {
    return {
      fxRateList:[],
      current_rotate: 0,
      refreshurl:"./imgs/tab_home/fxrate/refresh@3x.png",
      ExchangeDate:"",
      M6Date:""
    };
  },
  mounted() {
    this.getM6Date();
    // this.getNoticeBefore();
  },
  methods: {   
    getM6Date(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      if(month<1){
        year--;
        month+=12;
      }
      if(month<10){
        month="0"+month;
      }
      var date1 = new Date(year,month,0);
      var day1 = date1.getDate();
      if(day>day1){
        day=day1
      }
      if(day<10){
        day="0"+day;
      }
      this.M6Date=year+"-"+month+"-"+day
      this.investForExRateQry()
    } ,  
    refresh(){          
      this.current_rotate += 90;
          animation.transition(
              this.$refs.block,
              {
                  styles: {
                      transform: "rotate(" + this.current_rotate + "deg)"
                  },
                  duration: 1000,
                  timingFunction: "linear",
                  needLayout: false,
                  delay: 0
              }
          );
      this.getM6Date();
    },
    // 外汇利率查询
      investForExRateQry() {
      const loginParams={
          Date:this.M6Date,
      }
      this.goJson("/eweb/ewjrcb.ExRateQry.do", loginParams,response => {
        var arr=[];
        for(let i in response.data.List){
          if(response.data.List[i].Currency=="USD"||response.data.List[i].Currency=="GBP"||response.data.List[i].Currency=="JPY"||response.data.List[i].Currency=="EUR"){
            arr.push(response.data.List[i])
          }
        }
        var  cookie = "";
        try {
          cookie =  response.headers['Set-Cookie'].replace("[","");
          cookie = cookie.replace("]","")
        } catch (e) {
          cookie =  response.headers['set-cookie'].replace("[","");
          cookie = cookie.replace("]","")
        }
        var cookieList = [];
        var sessionCookie='';
        cookie = cookie.replace(/;/g,",");
        cookieList = cookie.split(',')
        for(let i=0;i<cookieList.length;i++){
            if(cookieList[i].search('BIG')!='-1'){
                sessionCookie=sessionCookie+cookieList[i]
            }
            if(i==cookieList.length-1){
                  context.sessionSetString("SetCookieBIG",sessionCookie);
            }
        }
        this.fxRateList=arr;
        this.formatDate();
      })
      },
    formatDate(){
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        if(month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if(strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        if(hour >= 0 && hour <= 9) {
          hour = "0" + hour;
        }
        if(minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
        }
        if(seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
        }
        this.ExchangeDate = date.getFullYear() + "-" + month + "-" + strDate + " " + hour + ":" + minutes + ":" + seconds;
      },
      movespace(str){
       str= str.replace(/\s*/g,"")
       return str;
      },
    jumpforexchange(){
      context.launchStage('main.foreignExchangeRate');
    },
    goto(url) {
      context.sessionSetString('notice', url);
      context.launchStage('main.noticeDetail');
    },
    getNoticeBefore() {
      stream.fetch( 
        {
          method: 'GET',
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: 'json'
        },
        res => {
          var tmp = res.data.data;
          this.fxRateList = tmp.fxRateList;
          // this.getNotice();
        }
      );
    },
    getNotice() {
      // this.goJson('/refacmob/BankNoticeQry.do', {}, res => {
      //   let resList = res.data.List;
      //   let tmpArr = [];
      //   for (let val of resList) {
      //     tmpArr.push({
      //       title: val.NoticeSubject,
      //       url: val.ShowNo
      //     });
      //   }
      //   this.marqueelist = tmpArr;
      //   this.m_length = this.marqueelist.length;
      //   this.topList = this.marqueelist[this.m_length - 1];
      //   this.bottomList = this.marqueelist[0];
      //   this.l_bottom = -50 * this.m_length;
      //   this.loading();
      // });
    },
    loading() {
      this.timer = setInterval(() => {
        this.animate(-50);
      }, this.duration);
    },
    animate(offset) {
      var _this = this;
      var newLeft = this.m_top + offset;
      var time = 300; //位移总时间
      var interval = 10; //位移间隔时间
      var speed = offset / (time / interval); //每次位移量

      function go() {
        if (
          (speed < 0 && _this.m_top > newLeft) ||
          (speed > 0 && _this.m_top < newLeft)
        ) {
          _this.m_top = _this.m_top + speed;
          setTimeout(go, interval);
        } else {
          _this.m_top = newLeft;

          if (newLeft > -50) {
            _this.m_top = _this.l_bottom;
          }
          if (newLeft < _this.l_bottom) {
            _this.m_top = -50;
          }
        }
      }
      go();
    }
  }
};
</script>