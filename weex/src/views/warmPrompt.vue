<template>
  <div class="container">
    <div class="popup">
        <div class="top">
            <text class="title_text">温馨提示</text>
        </div >
        <!-- <div class="line"></div> -->
        <div class="top_div">
                <div class="flexRow">
                    <text style="width:20px;"></text>
                    <text class="textfont">感谢您使用美团银行银行企业APP。</text>
                    <text class="textfont">为</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">了保证对您的个人隐私信息合法、</text>
                    <text class="textfont">合理、</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">适度的收集、使用，并在安全、可</text>
                    <text class="textfont">控的情</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">况下进行传输存储，我们依据</text>
                    <text class="textfont">《中华人民</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">共和国网络安全法》、</text>
                    <text class="textfont">《信息安全技术个</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">人信息安全规范》 （GB</text>
                    <text class="textfont">/T35273-2017）</text>
                </div>
                <div class="flexRow">
                    <text class="textfont">以及其他相关法律法规和技术规范，制</text>
                    <text class="textfont"></text>
                </div>
                <div class="flexRow">
                    <text class="textfont">定了</text>
                    <text class="textfont blue" @click="goJump()">《美团银行银行APP用户隐私协议》</text>
                </div>
                <div class="flexRow">
                    <text class="textfont" @click="goJump()">您在使用美团银行银行APP时，</text>
                    <text class="textfont">我们将按</text>
                </div>
                <text class="textfont">照本协议处理和保护您的个人信息。</text>
        </div>
        <div class="line"></div>
        <div class="popup-footer">
           <text class="btntext"  @click="goClose()">取消</text>
           <div class="shu_line"></div>
           <text class="btntext blue"  @click="goOpen()">同意</text>
        </div>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const modal = weex.requireModule('modal');
const wjalert = weex.requireModule("weex-alert");
export default {
    //props: ["showWarmOpen"],
    data() {
        return {
        //   showWarmOpen: false,
        }     
    },
    methods:{
        goJump() {
            context.launchStage("main.privacyStatement");
        },
        goClose() {
            wjalert.alert("如果您不同意本政策中的条款，将导致美团银行银行APP无法正常运行。","确定",data=>{
                context.shutdown();
            })
        },
        goOpen() {
            context.secureSetString('warmId',1);//协议是否同意标识
            context.finish();
        }
    }

}
</script>

<style>
  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.2);
    justify-content: center;
    align-items: center;
  }
  .popup{
        position:relative;
        background-color: #FFFFFF;
        flex-direction: column; 
        width: 550px;
        border-radius: 8px;
  }
  .top{
        width: 540px;
        height: 90px;
        justify-content: center;
        align-items: center;
  }
  .title_text{
      font-size: 30px;
  }
  .line{
      width: 530px;
      height: 2px;
      background-color: #eee;
      margin-left: 10px;
  }
  .top_div{
      width: 550px;
      padding-left: 25px;
      margin-bottom: 25px;
  }
  .textfont{
      font-size: 28px;
      word-wrap: break-word;
      word-break: break-all;
  }
  .flexRow{
      flex-direction: row;
  }
  /* .main_text{
      font-size: 27px;
      color: #333;
      white-space:normal;
  } */
  .popup-footer{
      width: 550px;
      height: 90px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

  }
  .btntext{
      width: 275px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 30px;
      color: #999;
  }
  .blue{
      color: #5353aa;
  }
  .shu_line{
      width: 2px;
      height: 50px;
      background-color: #eee;
  }

</style>