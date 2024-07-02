<template>
    <div class="yundunpasswordsetting">
        <nav-bar title="联系我们" left-show="false"></nav-bar>
        <div class="textdiv" >
            <div class="all"></div>
          <div class="contextdiv">
            <text class="kefutext">总行地址</text>
            <text class="contexttext1">江苏省美团银行市吴江区中山南路1777号</text>
          </div>
          <div class="contextdiv">
            <text class="kefutext">邮政编码</text>
            <text class="contexttext1">215200</text>
          </div>
          <div class="contextdiv">
            <text class="kefutext">官网地址</text>
            <text class="contexttext1">www.szrcb.com</text>
          </div>
          <div class="blac"></div>
          <!-- <div class="contextdiv">
             <text class="kefutext">客服邮件</text>
             <text class="contexttext1">office@szrcb.com</text>
          </div>  -->
          <div class="contextdiv">
             <text class="kefutext">服务热线:</text>
             <text class="contexttext1">96098(江苏省内)</text>
          </div>
          <div class="contextdiv">
             <text class="kefutext">服务热线:</text>
             <text class="contexttext1">400-86-96068(江苏省外)</text>
          </div>
          <!-- <div class="contextdiv1">
             <text class="contexttext1">400-86-96068(江苏省外)</text>
          </div> -->
        </div>
        
    </div>
</template>

<script>
// import NavBar from "../components/NavBar.vue";
import NavBar from "@/components/templet/titlebar";
export default {
  components: {
    NavBar
  },
  data() {
    return {
    };
  },
  methods: {
    
  }
};
</script>

<style scoped>
.blac{
  width:750px;
height:20px;
background-color:rgba(245,245,245,1);
}
.all{
    width: 10px;
    height: 20px;
}
.yundunpasswordsetting {
  background-color:rgba(255,255,255,1);;
}
.textdiv {

}
.contextdiv {
  margin-left: 30px;
  width: 720px;
  height: 110px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(240,240,240,1);
  flex-direction: row;
  justify-content: space-between;
}
.contextdiv1{
    width: 720px;
    height: 50px;
    /* left: 30px;
    top: 66px; */
    flex-direction: row;
    justify-content: flex-end;
}
.kefutext{
  font-size:30px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(51,51,51,1);
    line-height: 110px;
}
.contexttext1{
    font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
    line-height:110px;
    padding-right: 30px;
}
</style>
