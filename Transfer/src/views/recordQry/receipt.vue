<template>
    <div class="electronicReceipt">
        <nav-bar title="电子回单"></nav-bar>
        <!--交易成功-->
        <scroller class="scroller">
            <div class="totalBox" ref="shareRef" >
                <div class="wrapper">
                    <image :src="bankImg" class="bankImg" />
                    <div class="wrapper2">
                        <text class="transferBank_title">{{transferBank}}</text>
                        <text class="receiptText">电子回单</text>
                    </div>
                </div>
                <div>
                    <div class="everySingle">
                        <text class="leftText">付款户名</text>
                        <text class="rightText">{{everyInfo.fkrhm}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">付款账号</text>
                        <text class="rightText">{{everyInfo.PyrAcctNo}}</text>
                    </div>
                    <div class="everySingle dottedLine">
                        <text class="leftText">付款银行</text>
                        <text class="rightText">{{transferBank}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">收款户名</text>
                        <text class="rightText">{{everyInfo.skrhm}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">收款账号</text>
                        <text class="rightText">{{everyInfo.PyeAcctNo}}</text>
                    </div>
                    <div class="everySingle dottedLine">
                        <text class="leftText">收款银行</text>
                        <text class="rightText">{{everyInfo.PyeBnkNm}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">转账金额</text>
                        <text class="rightText">{{everyInfo.TxnAmt}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">手续费</text>
                        <text class="rightText">¥{{everyInfo.PcdFee?everyInfo.PcdFee:'0.00'}}</text>
                    </div>
                    <div class="everySingle" v-if="everyInfo.Smy">
                        <text class="leftText">用途/附言</text>
                        <text class="rightText">{{everyInfo.Smy}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">交易名称</text>
                        <text class="rightText">{{everyInfo.OrgnlPymtCnlCd!='CRDC'&&everyInfo.OrgnlPymtCnlCd!='COSP'?'跨行转账':'行内转账'}}</text>
                    </div>
                    <div class="everySingle dottedLine">
                        <text class="leftText">交易时间</text>
                        <text class="rightText">{{dealTimeLine(everyInfo.OrgnlTxnCnlDt,everyInfo.OrgnlSysTm)}}</text>
                    </div>
                    <div class="everySingle">
                        <text class="leftText">转账状态</text>
                        <text class="rightText">{{$store.state.recordState[everyInfo.TxnSt]}}</text>
                    </div>
                    <!-- <div class="everySingle">
                        <text class="leftText">回单编号</text>
                        <text class="rightText">{{}}</text>
                    </div>
                    <div class="everySingle" style="border-bottom-width:1px;border-bottom-color:rgba(234,234,234,1)">
                        <text class="leftText">验证码</text>
                        <text class="rightText">{{}}</text>
                    </div> -->
                    <image class="elecsign" :src="receiptUrl"/>
                </div>
                <div class="prompt">
                    <text class="prompt_title">重要提示:</text>
                    <text class="prompt_text">本回单不作为收款方的发货依据，以实际到账为准，并请避免重复记账</text>
                </div>
                <div class="qrCode">
                    <image :src="qrCodeImg" class="qrCode_img" />
                    <text class="qrCode_desc">打开美团银行银行企业手机银行-扫一扫功能即可轻松验证电子回单</text>
                </div>
            </div>
        </scroller>
        <div class="operateBtnBox">
            <text class="resetBtn" @click="share">分享微信好友</text>
            <text class="confirmBtn" @click="save">保存本地</text>
        </div>
    </div>
</template>
<script>
    import NavBar from "../../components/titlebar_component.vue";
    const Share = weex.requireModule("weex-share");//分享模块
    const modal = weex.requireModule("modal");
    const wjalert = weex.requireModule("weex-alert")
    const qrcode = weex.requireModule("qr-code");
    const context = weex.requireModule("context");
    export default {
        components: { NavBar },
        data() {
            return {
                // 转账银行
                transferBank: "美团银行农村商业银行",
                bankImg: "./imgs/9999.png",
                //   回单编号
                receiptNumber: "",
                // 验证码
                verificationCode: "",
                qrCodeImg: "",
                weixinImg: "./imgs/9999.png",
                saveImg: "./imgs/9999.png",
                sealImg: "./imgs/receipt@3x.png",
                everyInfo:{},
                receiptUrl:'./imgs/receipt@3x.png',//电子印章
                shareSaveData:'',
            };
        },
        created(){
            this.everyInfo=this.$route.query.everyInfo; 
            this.getCard2();
        },
        methods:{
            getCard2() {
                var params={
                    promptText:"此回单真实有效",
                    flag:'receipt'
                }
                qrcode.createQRCode(JSON.stringify(params), data => {
                    if (data) {
                        this.shareSaveData=data;
                        let responseData = JSON.parse(data);
                        this.qrCodeImg = context.getMappedFileUrl(responseData.path);
                    }
                });
            },
            runState(str){
                if(str=="0"){
                str="交易成功"
                }else if(str=="1"){
                str="通讯失败"
                }else if(str=="2"){
                str="交易失败"
                }else if(str=="3"){
                str="交易异常"
                }else if(str=="5"){
                str="正在发送主机"
                }else if(str=="6"){
                str="预约成功"
                }else if(str=="9"){
                str="状态未明"
                }
                return str
            },
            share(){
                // Share.shareBanksImg(data=>{
                //     if(JSON.parse(data).status=='success'){
                //         wjalert.alert("分享成功","确定",data=>{})
                //     }else{
                //         wjalert.alert("分享失败","确定",data=>{})
                //     }
                // },this.$refs.shareRef);
                Share.shareBanksImg(data=>{
                    //微信SDK未提供分享是否成功的回调
                    // if(JSON.parse(data).status=='success'){
                    //     wjalert.alert("分享成功","确定",data=>{})
                    // }else{
                    //     wjalert.alert("分享失败","确定",data=>{})
                    // }
                },this.$refs.shareRef,this.shareSaveData)
            },
            save(){
                // Share.saveBanksImg(data=>{
                //     if(JSON.parse(data).status=='success'){
                //         wjalert.alert("图片保存成功","确定",data=>{})
                //     }else{
                //         wjalert.alert("图片保存失败","确定",data=>{})
                //     }
                // },this.$refs.shareRef);
                Share.saveBanksImg(data=>{
                    if(JSON.parse(data).status=='success'){
                        wjalert.alert("图片保存成功","确定",data=>{})
                    }else{
                        wjalert.alert("图片保存失败","确定",data=>{})
                    }
                },this.$refs.shareRef,this.shareSaveData);
            },
        }
    };
</script>
<style scoped>
.scroller{
    background-color:rgba(250,250,250,1);
}
.everySingle{
    flex-direction: row;
    /* height: 80px; */
    /* border-bottom-width: 1px;
    border-bottom-color: rgba(234,234,234,1); */
    align-items: center;
    justify-content: space-between;
}
.dottedLine{
    border-bottom-width: 1px;
    border-bottom-color: rgba(234,234,234,1);
    border-bottom-style: dotted;
}
.leftText{
    width: 180px;
    font-size:30px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:80px;
    padding-left: 30px;
}
.rightText{
    width: 510px;
    font-size:30px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:56px;
    padding-right: 30px;
    text-align: right;
}
.totalBox{
    width:690px;
    margin-left: 30px;
    border-radius: 12px;
    border-width: 1px;
    border-color: rgba(245,245,245,1);
    margin-top: 30px;
    margin-bottom: 100px;
    background-color: #fff;
}
.operateBtnBox{
    flex-direction: row; 
    justify-content: space-between; 
    position: fixed;
    bottom: 0px;
    width: 750px;
    height: 88px;
}
.resetBtn{
    width: 375px;
    text-align: center;
    font-size: 32px;
    line-height: 88px;
    color:rgba(102,102,102,1);
    background-color: #f8f8f7;
}
.confirmBtn{
    width: 375px;
    font-size: 32px;
    text-align: center;
    line-height: 88px;
    color: #fff;
    background-image: -webkit-linear-gradient(right, #FB5D7A, #E6022C);
    background-image: -o-linear-gradient(right, #FB5D7A, #E6022C);
    background-image: -moz-linear-gradient(right, #FB5D7A, #E6022C);
    background-image: linear-gradient(to right, #FB5D7A, #E6022C);
}
.wrapper {
    background-color: white;
    padding: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: dotted;
    border-bottom-color: rgba(234,234,234,1);
}
.wrapper2 {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    height: 40px;
}
.transferBank_title {
    margin: 0 20px;
    font-size: 30px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    color:rgba(51,51,51,1);
    line-height: 40px;
}
.receiptText{
    color: #999;
    font-size: 26px;
    border-left-width: 1px;
    border-left-color: #999;
    padding-left: 20px;
    line-height: 40px;
}
.bankImg {
    width: 64px;
    height: 64px;
}
.elecsign{
    position: absolute;
    top: 450px;
    width:230px;
    height:165px;
    right:30px;
}
.prompt {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.prompt_title {
    font-size:30px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:30px;
    margin-top: 30px;
    margin-left: 30px;
}
.prompt_text{
    font-size:28px;
    width: 690px;
    flex-wrap: wrap;
    padding-left: 30px;
    padding-right: 30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:48px;
    margin-top: 20px;
}
.qrCode_img {
    width: 327px;
    height: 327px;
    margin: 60px 0;
}
.qrCode {
    display: flex;
    justify-content: center;
    align-items: center;
}
.qrCode_desc {
    margin-bottom: 20px;
    font-size: 28px;
    color: #E6022C;
    text-align: center;
    margin-left: 30px;
    margin-right: 30px;
}
.footer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: gray;
    height: 100px;
}
.share,
.save {
    display: flex;
    flex-direction: row;
}
.weixin_img,
.save_img {
    width: 60px;
    height: 60px;
    margin: 0 10px;
}
.text_white {
    color: white;
}
.seal_img {
    width: 200px;
    height: 200px;
    position: absolute;
    top: -50px;
    right: 20px;
}
.border_box{
    padding: 0 10px 20px 30px;
    border-bottom-width: 2px;
    border-bottom-style: dotted;
}
</style>