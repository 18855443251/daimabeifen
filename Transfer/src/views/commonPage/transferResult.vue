<template>
    <div class="transferResults">
        <nav-bar title="转账结果" :showpayee='showpayee' :isArrowBack="isArrowBack" :rightTitle="rightTitle"></nav-bar>
        <!--转账结果 -->
        <scroller >
                <div class="wrapper">
                    <div class="wrapperBox">
                        <image :src="successimg" class="wrapper_box_img" v-if="$store.state.transResultFlag!='4'"/>
                        <image :src="failimg" class="wrapper_box_img" v-else/>
                        <text class="wrapper_title">{{transStatusInfo[$store.state.transResultFlag].transferResultText}}</text>
                    </div>
                    <div v-if="$store.state.transResultFlag=='0'">
                        <text class="wrapper_desc" v-for="(item,index) in $store.state.transResData._DisplayAuthList" :key="index">还需{{item.AuthUserCount}}个{{item.UserGrpId}}级审核员审核</text>
                    </div>
                    <text class="wrapper_desc" v-else>{{transStatusInfo[$store.state.transResultFlag].transferResultContent}}</text>
                </div>
                <SplitDiv/>
                <div class="transfer_result" v-if="$store.state.transResultFlag!='4'">
                    <div class="transfer_result_box">
                        <text class="transfer_result_box_title">转账金额:</text>
                        <text class="transfer_result_box_Text">¥ {{$store.state.transferSubmitData.Amount}}</text>
                    </div>
                    <div class="transfer_result_box">
                        <text class="transfer_result_box_title">手续费:</text>
                        <text class="transfer_result_box_Text">¥ {{$store.state.transferSubmitData.Fee}}</text>
                    </div>
                    <div class="transfer_result_box">
                        <text class="transfer_result_box_title">收款方名称:</text>
                        <text class="transfer_result_box_Text">{{ellipsis($store.state.transferSubmitData.PayeeAcName,15)}}</text>
                    </div>
                    <div class="transfer_result_box">
                        <text class="transfer_result_box_title">收款方账号:</text>
                        <text class="transfer_result_box_Text" v-if="!$store.state.accountProtect">{{$store.state.transferSubmitData.PayeeAcNo|AccountNoFormat}}</text>
                        <text class="transfer_result_box_Text" v-else>{{$store.state.transferSubmitData.PayeeAcNo|AccountNoFormat(6,-4)}}</text>
                    </div>
                    
                    <div v-if="!detailShow" class="transfer_detail_box" @click="showDetail">
                        <text class="transfer_detail_box_title">展开详情</text>
                        <image :src="arrowimg" class="transfer_detail_box_img" />
                    </div>
                    <div v-if="detailShow">
                        <div class="transfer_result_box">
                            <text class="transfer_result_box_title">付款方名称:</text>
                            <text class="transfer_result_box_Text">{{ellipsis($store.state.transferSubmitData.PayerAcName,15)}}</text>
                        </div>
                        <div class="transfer_result_box">
                            <text class="transfer_result_box_title">付款方账号:</text>
                            <text class="transfer_result_box_Text" v-if="!$store.state.accountProtect">{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat}}</text>
                            <text class="transfer_result_box_Text" v-else>{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat(6,-4)}}</text>
                        </div>
                        <div class="transfer_result_box">
                            <text class="transfer_result_box_title">到账方式:</text>
                            <text class="transfer_result_box_Text">{{transwayList[$store.state.transferSubmitData.ImmediatelyFlag]}}</text>
                        </div>
                        <div class="transfer_detail_box" @click="closeDetail">
                            <text class="transfer_detail_box_title">收起详情</text>
                            <image :src="arrowimg" class="transfer_detail_box_img" />
                        </div>
                    </div>
                    <text class="promptText">收款方信息已默认保存至收款人名册</text>
                </div>
                <div class="btn" v-if="$store.state.transResultFlag!='4'">
                    <text class="text_btn text_btn_left" @click="transAgain">再转一笔</text>
                    <text class="text_btn text_btn_right" @click="finish">完成</text>
                </div>
                <div class="btn" v-else>
                    <text class="text_btn text_btn_left" @click="backTranIndex">返回转账首页</text>
                    <text class="text_btn text_btn_right" @click="jumpModifyInfo">修改转账信息</text>
                </div>
        </scroller>
    </div>
</template>
<script>
import NavBar from "@/components/titlebar_component.vue";
import SplitDiv from "../../components/splitDiv.vue";
const context = weex.requireModule('context')
export default {
    components: { NavBar , SplitDiv},
    data() {
        return {
            successimg: "./imgs/transSuccessIcon.png",
            failimg: "./imgs/transFailIcon.png",
            rightTitle:"",
            showpayee:true,
            isArrowBack:false,
            // 展开和收起图片
            arrowimg: "./imgs/downArrow.png",
            detailShow:false,//展示详情
            transwayList:{'0':'实时到账','1':'普通到账','2':'次日到账'},
            transStatusInfo:[
                {transferResultText:"提交成功",transferResultContent:''},
                {transferResultText:"转账成功",transferResultContent:'预计10秒内到账，实际到账时间取决于对方银行'},
                {transferResultText:"转账已受理",transferResultContent:'一般情况下，资金两小时后到账,资金到账前可通过“转账记录查询”交易对此笔转账做转账撤销'},
                {transferResultText:"转账已受理",transferResultContent:'一般情况下，资金下一工作日到账，资金到账前可通过"转账记录查询"对此笔转账做转账撤销'},
                {transferResultText:"转账失败",transferResultContent:''}
            ]
        };
    },
    created(){
        this.transStatusInfo[4].transferResultContent=this.$store.state.transResData.errmsg;
        if(this.$store.state.BankInner=='0'&&this.$store.state.transferSubmitData.ImmediatelyFlag=='0'){
            this.transStatusInfo[1].transferResultContent='预计10秒内到账';
        }
    },
    methods: {
        //展开详情
        showDetail(){
            this.detailShow = true;
            this.arrowimg="./imgs/upArrow.png";
        },
        //关闭详情
        closeDetail(){
            this.detailShow = false;
            this.arrowimg="./imgs/downArrow.png";
        },
        //再转一笔，跳转到快捷转账
        transAgain(){
            //将此笔收款人信息放入缓存
            let payeeDetail={
                PayeeAcNo:this.$store.state.transferSubmitData.PayeeAcNo,
                PayeeAcName:this.$store.state.transferSubmitData.PayeeAcName,
                ProCity:this.$store.state.cityCode,
                ProvinceName:this.$store.state.transferSubmitData.PayeeProvince.Name,
                CityName:this.$store.state.transferSubmitData.PayeeCity.Name,
                LName:this.$store.state.transferSubmitData.PayeeNetName.Name,
                BankCode:this.$store.state.transferSubmitData.PayeeNetName.Value,
                PayeeBank:this.$store.state.transferSubmitData.PayeeBank,
                Phone:this.$store.state.transferSubmitData.mobilePhone,
                PayeeBankName:this.$store.state.transferSubmitData.PayeeBankName,
                SysFlag:this.$store.state.transferSubmitData.BankNodeFlag=='Y'?'1':'',
                
                // PayerCurrency:this.$store.state.transferSubmitData.PayerCurrency
            }
            context.sessionSetString("payeeDetail",JSON.stringify(payeeDetail));
            context.replaceStage('main.FastTrans?flag=transAgain');
        },
        //完成
        finish(){
            context.finish();
        },
        //跳转到转账首页
        backTranIndex(){
            context.replaceStage('main.Transfer');
        },
        //修改转账信息
        jumpModifyInfo(){
            if(context.sessionGetString('enterResultFlag')=='payerIndex'){//如果是转账主页进入
                context.sessionSetString('updateBankInnerFlag','update');//表明回到payeeinfo时要重新刷新checkbankinner
                this.$router.go(-3);
            }else{//如果是快捷转账进入
                // let payeeDetail={
                //         PayeeAcNo:this.$store.state.transferSubmitData.PayeeAcNo,
                //         PayeeAcName:this.$store.state.transferSubmitData.PayeeAcName,
                //         ProCity:this.$store.state.cityCode,
                //         ProvinceName:this.$store.state.transferSubmitData.PayeeProvince.Name,
                //         CityName:this.$store.state.transferSubmitData.PayeeCity.Name,
                //         LName:this.$store.state.transferSubmitData.PayeeNetName.Name,
                //         BankCode:this.$store.state.transferSubmitData.PayeeNetName.Value,
                //         PayeeBank:this.$store.state.transferSubmitData.PayeeBank,
                //         PayeeBankName:this.$store.state.transferSubmitData.PayeeBankName,
                //     }
                // context.sessionSetString("payeeDetail",JSON.stringify(payeeDetail));
                this.$router.go(-2);
            }
        }
    }
};
</script>
<style scoped>
.wrapper {
    background-color: white;
    padding-top: 50px;
    padding-bottom: 50px;
    align-items: center;
}
.wrapper_box_img {
    width: 110px;
    height: 110px;
}
.wrapperBox{
    justify-content: center;
    align-items: center;
}
.wrapper_title {
    font-size:30px;
    font-weight:bold;
    color:rgba(51,51,51,1);
    margin-top:10px;
}
.transfer_result {
    background-color: white;
    padding-left: 30px;
    border-radius: 20px;
    margin: 20px 0;
}
.transfer_result_box {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height:88px;
    padding-right: 30px;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
}
.transfer_result_box_title{
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.transfer_result_box_Text{
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
}
.transfer_detail_box {
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.transfer_detail_box_title {
    font-size:28px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(74,137,252,1);
}
.transfer_detail_box_img {
    width: 24px;
    height: 14px;
    margin-left: 15px;
}
.promptText{
    font-size:26px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    margin-top:20px;
}

.btn {
    flex-direction: row;
    justify-content: space-around;
    margin-top: 200px;
    margin-bottom:50px;
}
.text_btn {
    width: 325px;
    height: 88px;
    text-align: center;
    line-height: 88px;
}
.text_btn_left{
    border-width: 2px;
    border-color:rgba(230,2,44,1);
    border-radius:12px;
    font-weight:bold;
    font-size: 32px;
    color:rgba(230,2,44,1);
    letter-spacing:2px;
}
.text_btn_right{
    background-color:rgba(230,2,44,1);
    border-radius:12px;
    font-size: 32px;
    font-weight:bold;
    color:#fff;
    letter-spacing:2px;
}
.wrapper_desc{
    font-size: 26px;
    color: #999;
    margin-top: 10px;
    text-align: center;
    padding-left: 30px;
    padding-right: 30px;
}
</style>


