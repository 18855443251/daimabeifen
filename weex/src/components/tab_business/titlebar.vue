<template>
  <div class="container">
    <div class="row">
      <image @click="qrCodeClick" class="qrcode-img" :src="qrcodeImg"></image>
      <image class="logo-img" :src="logoImg"></image>
      <image @click="gotoStage('main.bankNotice')" class="notice-img" :src="noticeImg"></image>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 750px;
  padding-top: 80px;
  padding-bottom: 28px;
  background-color: #ffffff;
}
.row {
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.qrcode-img {
  width: 42px;
  height: 42px;
}
.logo-img {
  width: 384px;
  height: 56px;
}
.notice-img {
  width: 42px;
  height: 42px;
}
</style>
<script>
const qrscan = weex.requireModule("weexqrscan");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule('modal');
export default {
  data() {
    return {
      qrcodeImg: "./imgs/tab_business/titlebar/qrcode@3x.png",
      logoImg: "./imgs/tab_business/titlebar/logo@3x.png",
      noticeImg: "./imgs/tab_business/titlebar/message@3x.png"
    };
  },
  methods: {
    //扫码
    qrCodeClick() {
      this.judgeIslogin(() => {
        qrscan.scanQRcode(data => {
          let qrDate = JSON.parse(data);
          if(qrDate.type=="1"){
            context.launchStage("main.enterprisesCard");
          } else {
            try {
                var obj=JSON.parse(qrDate.result);
                if(typeof obj == 'object' && obj ){
                  if(obj.flag=="1") {
                    context.sessionSetString("tansferdata",qrDate.result)
                    context.launchStage("main.FastTrans?flag=scan");
                  } else if(obj.flag=="receipt"){
                    modal.alert({
                      message:"此回单真实有效"
                    })
                  }else {
                    modal.alert({
                      message:"暂不支持此类型二维码"
                    })
                  }
                }else{
                    modal.alert({
                      message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                    })
                }
            } catch(e) {
                modal.alert({
                  message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                })
            }
          }
        });
      });
    },
    //扫一扫二维码查询
    getQueryOrder(Qrdata) {
      const params = {
        QrNo: Qrdata
      };
      this.goJson(
        "/refacmob/QueryQrOrder.do",
        params,
        response => {
          context.sessionSetString(
            "ResponseData",
            JSON.stringify(response.data)
          );
          context.launchStage("main.qrcode");
        },
        fail => {
          modal.alert({
            message: fail
          });
        }
      );
    }
  }
};
</script>
