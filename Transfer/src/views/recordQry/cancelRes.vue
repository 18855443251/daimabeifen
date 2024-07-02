<template>
    <div class="transferResults">
        <nav-bar title="转账撤销结果" :isArrowBack=false></nav-bar>
        <!--转账结果 -->
        <div class="container">
            <div class="wrapper">
                <div class="wrapperBox">
                    <image :src="successimg" class="wrapper_box_img"/>
                    <!-- <image :src="failimg" class="wrapper_box_img"/> -->
                    <div style="width:750px" v-if="$store.state.transCancelResData._DisplayAuthList&&$store.state.transCancelResData._DisplayAuthList.length!=0">
                        <text class="wrapper_title">提交成功</text>
                        <text class="wrapper_desc" v-for="(item,index) in $store.state.transCancelResData._DisplayAuthList" :key="index">还需{{item.AuthUserCount}}个{{item.UserGrpId}}级审核员审核</text>
                    </div>
                    <text class="wrapper_title" v-else>撤销成功</text>
                </div>
            </div>
            <SplitDiv/>
            <submitBtn btntext="返回" @click.native="finish" />
        </div>
    </div>
</template>
<script>
    import NavBar from "@/components/titlebar_component.vue";
    import SplitDiv from "@/components/splitDiv.vue";
    import submitBtn from "../../components/submitBtn.vue";
    const context = weex.requireModule("context");
    const wjalert = weex.requireModule("weex-alert");
    export default {
        components: { NavBar,SplitDiv,submitBtn },
        data() {
            return {
                state: "提交成功",
                successimg: "./imgs/transSuccessIcon.png",
                failimg: "./imgs/transFailIcon.png",
                // 转账金额
                transferMoney: "",
                // 手续费
                commissionCharge: "",
                // 收款方名称
                payeeName: "",
                // 收款方账号
                payeeAccount: "",
                // 付款方名称
                payerName: "",
                // 付款方账号
                payerAccount: "",
                // 到账方式
                transferWay: "",
                // 展开和收起图片
                arrowimg: "./imgs/drop-down@3x.png",
                detailShow: false,//展示详情
            };
        },
        methods: {
            finish(){
                context.finish();
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
        margin-top:20px;
        text-align: center;
    }
    .transfer_result {
        background-color: white;
        padding-left: 30px;
        padding-right: 30px;
        border-radius: 20px;
        margin: 20px 0;
    }

    .transfer_result_box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #ddd;
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
        color: rgb(93, 161, 240);
        font-size: 28px;
        line-height: 30px;
    }

    .transfer_detail_box_img {
        width: 30px;
        height: 30px;
        margin-left: 15px;
    }

    .wrapper_desc {
        font-size: 30px;
        color: #999;
        padding-top: 20px;
        text-align: center;
    }

    .btn {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 50px 0;
    }

    .text_btn2 {
        width: 700px;
        height: 80px;
        background-color: gray;
        text-align: center;
        line-height: 80px;
        color: white;
        margin: 20px 0;
    }
</style>