<template>
  <div class="all">
    <div class="income"> 
      <div class="income_box">
        <div :class="[itemStrip.DCFlag=='D'?'garden_green':'garden']">
          <text :class="[itemStrip.DCFlag=='D'?'garden_text_green':'garden_text']">{{DCFlag(itemStrip.DCFlag)}}</text>
        </div>
        <div class="time_bank">
          <text class="time">{{itemStrip.TransTime}}</text>
          <text class="purpose">{{itemStrip.Remark}}</text>
        </div>
        <div class="money" @click="showText">
          <div class="num">
            <text class="add" :style="[{'color':itemStrip.DCFlag=='D'?'rgb(239,77,51)':'rgb(31,182,92)'}]">{{add(itemStrip.DCFlag)}}</text>
            <text class="money_num">¥{{itemStrip.Amount}}</text>
          </div>
          <text class="currency">{{itemStrip.Currency}}</text>
        </div>
        <image :src="triangleUrl" :class="[carTrue==true?'car':'triangle']"/>
      </div>
    </div>
    <div class="text_box" v-if="!carTrue">
      <div class="text_strip">
        <text class="text_type">商户全称:</text>
        <text class="text_number">{{itemStrip.shopName}}</text>
      </div>
      <div class="text_strip">
        <text class="text_type">订单金额:</text>
        <text class="text_number">¥{{itemStrip.OrderAmount}}</text>
      </div>
      <div class="text_strip">
        <text class="text_type">优惠金额:</text>
        <text class="text_number">¥{{itemStrip.SaleAmount}}</text>
      </div>
      <div class="text_strip">
        <text class="text_type">交易时间:</text>
        <div style="width:570px;">
          <text class="text_numbers">{{itemStrip.TransTime}}</text>
        </div>
      </div>
      <div class="text_strip">
        <text class="text_type">交易说明:</text>
        <div style="width:570px;">
          <text class="text_numbers">{{itemStrip.transIntroduce}}</text>
        </div>
      </div>
      <div class="text_strip">
        <text class="text_type">交易单号:</text>
        <div style="width:570px;">
          <text class="text_numbers">{{itemStrip.transCode}}</text>
        </div>
      </div>
      <div class="text_strip">
        <text class="text_type">商户单号:</text>
        <div style="width:570px;">
          <text class="text_numbers">{{itemStrip.shopCode}}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  props:["itemStrip"],
  components: {},
  data() {
    return {
      triangleUrl: this.$store.state.imgBaseUrl + "/triangle@2x.png",
      carTrue:false
    }
  },
  methods: {
    showText(){
      this.carTrue = !this.carTrue;
    },
    DCFlag(x){
      if(x =="D"){
        return "退款"
      }
      if(x == "C"){
        return "支出"
      }
    },
    add(x){
      if(x =="D"){
        return "+"
      }
      if(x == "C"){
        return "-"
      }
    }
  }
}
</script>
<style scoped>
.income{
  width:750px;
  background-color:#ffffff;
}
.income_box{
  width:720px;
  height:154px;
  margin-left:30px;
  flex-direction: row;
  align-items:center;
  border-bottom-width:1px;
  border-bottom-style:solid;
  border-bottom-color:rgb(221,221,221);
}
.garden{
  width:90px;
  height:90px;
  border-style:dashed;
  border-width:1px;
  border-color:rgb(31,182,92);
  border-radius:100%;
}
.garden_green{
  width:90px;
  height:90px;
  border-style:dashed;
  border-width:1px;
  border-color:rgb(239,77,51);
  border-radius:100%;
}
.garden_text{
  color:rgb(31,182,92);
  line-height:90px;
  text-align:center;
  font-size:26px;
}
.garden_text_green{
  color:rgb(239,77,51);
  line-height:90px;
  text-align:center;
  font-size:26px;
}
.time_bank{
  width:321px;
  height:75px;
  border-right-style:solid;
  border-right-color:rgb(221,221,221);
  border-right-width:1px;
}
.time{
  color:rgb(34,34,34);
  font-size:30px;
  margin-left:30px;
  line-height:30px;
}
.purpose{
  color:rgb(153,153,153);
  font-size:24px;
  margin-left:30px;
  margin-top:21px;
  line-height:24px;
}
.money{
  width:254px;
}
.num{
  flex-direction: row;
  margin-left:66px;
}
.add{
  color:rgb(239,77,51);
  font-size:30px;
}
.money_num{
  color:rgb(34,34,34);
  font-size:30px;
  margin-left:5px;
}
.currency{
  margin-top:19px;
  color:rgb(153,153,153);
  font-size:24px;
  margin-left:66px;
}
.triangle{
  width:30px;
  height:30px;
  animation-name: drives; 
  animation-duration:2s; 
  transform: rotateX(0deg);
}
.text_box{
  width:750px;
  background-color:rgb(247,247,247);
  padding-bottom:30px;
}
.text_strip{
  margin-left:30px;
  flex-direction: row;
}
.text_type{
  font-size:26px;
  color:rgb(102,102,102);
  line-height:26px;
  margin-top:30px;
}
.text_numbers{
  font-size:26px;
  color:rgb(102,102,102);
  margin-left:15px;
  line-height:30px;
  width:570px;
  white-space:normal;
  margin-top:30px;
}
.text_number{
  font-size:26px;
  color:rgb(102,102,102);
  margin-left:15px;
  line-height:26px;
  margin-top:30px;
}
.car { 
  animation-name: drive; 
  animation-duration:2s; 
  width:30px;
  height:30px;
  transform: rotateX(180deg);
} 
@-webkit-keyframes drive {
  from{ 
    transform: rotateX(0deg); 
  } 
  to{ 
    transform: rotateX(180deg); 
  } 
}
@-webkit-keyframes drives {
  from{ 
    transform: rotateX(180deg); 
  } 
  to{ 
    transform: rotateX(0deg); 
  } 
}
</style>