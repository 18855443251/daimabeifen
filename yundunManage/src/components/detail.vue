<template>
  <div class="box">
      <div class="container">
          <text class="shopName">{{itemStrip.data}}</text>
          <text class="transferDate">{{itemStrip.date}}</text>
      </div>
      <div class="container">
        <text class="Amount">¥{{itemStrip.amount}}</text>
        <text class="payState">{{itemStrip.transactionResult}}</text>
      </div>
      <div class="line"></div>
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
    return {}
  },
   methods: {}
}
</script>
<style scoped>
.line{
  width: 750px;
  height: 1px;
  background-color: #dddddd;
  margin-left: 40px;
  margin-top: 10px;
}
.box{
  background-color: #ffffff;
}
.container{
  flex-direction: row;
}
.shopName{
   width: 400px;
   margin-top: 15px;
   margin-left: 40px;
   font-size: 30px;
   color: #222222;
}
.transferDate{
   font-size: 30px;
   margin-top: 15px;
   color: #999999;
}
.Amount{
   width: 400px;
   margin-top: 15px;
   margin-left: 40px;
   font-size: 30px;
   font-size: 29px;
}
.payState{
   font-size: 30px;
   margin-top: 15px;
   color:rgb(53,171,25);
   /* color:rgb(239,77,51); */
}
</style>