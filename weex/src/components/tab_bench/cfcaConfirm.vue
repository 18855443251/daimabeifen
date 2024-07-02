<template>
  <div class="container">
    <div class="fucengModal">
      <div class="modalBox">
        <div class="certificateBox">
          <text class="certificateTitle">安全认证</text>
          <image :src="cancelMsgIcon" class="cancelMsgIcon" @click="cancel" />
        </div>
        <div class="mainCertificate">
          <text class="certificateText">云盾密码</text>
          <!-- 云盾输入框 -->
          <cfcaPassword
            ref="cloudPwd"
            class="certificateInput"
            @chickFinish="cfcaKeyboradHide"
            :strServerRandom="serverRandomStr"
          ></cfcaPassword>
          <text class="forgetCertifiText">忘记云盾密码</text>
        </div>
        <text class="passwordBtn" @click="confirm1">确认</text>
      </div>
    </div>
  </div>
</template>

<script>
  const modal = weex.requireModule("modal");
  const cfcaPlugin = weex.requireModule("yunzhengtong");//云盾
  const wjalert = weex.requireModule("weex-alert");

export default {
    data() {
        return {
            cancelMsgIcon: '', 
            _tokenName:'',//防重复验证码
            //云盾相关
            serverRandomStr: "",//云盾随机数
            getRandomInfo:{},
            authdata:'', 
            showCfca: true,
        }
    },
    created(){
      
    },
    methods: {
        cancel() {
            this.showCfca = false;
            this.$emit('changeCfca',this.showCfca);
        },
    }
}

</script>

<style scoped>
    .fucengModal{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-color:rgba(0,0,0,0.5);
    }
    .modalBox{
    width: 630px;
    height: 540px;
    margin-top: 316px;
    margin-left: 68px;
    background-color: #fff;
    border-radius: 12px;
    align-items: center;
    padding-top: 40px;
  }
  .certificateBox{
    width: 550px;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 50px;
  }
  .certificateTitle{
    height:36px;
    font-size:36px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:36px;
  }
  .mainCertificate{
    width:630px;
    padding-left:40px;
    padding-bottom:40px;
    border-bottom-width: 1px;
    border-bottom-color: #EAEAEA;
  }
  .certificateText{
    width: 550px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .forgetCertifiText{
    width: 550px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    text-align: right;
    color:#4A89FC;
  }
  .passwordBtn{
    width:550px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    color: #fff;
    border-radius:12px;
    margin-top: 30px;
    background-image: linear-gradient(to right, #FB5D7A, #E6022C);
  }
  .certificateInput{
    width: 550px;
    height: 90px;
    border-width: 1px;
    border-color: rgba(221,221,221,1);
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .cancelMsgIcon{
    width: 36px;
    height: 36px;
    position: absolute;
    right: 0;
  }
</style>
