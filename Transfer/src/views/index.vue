<template>
    <div class="transferHome">
        <nav-bar title="转账汇款"></nav-bar>
        <!-- 转账首页 -->
        <scroller>
            <!-- <div> -->
                <div class="wrapper" @click="ImmediatelyTransfer">
                    <div class="wrapper_box">
                        <image :src="transferIndexIcon" style="width:66px;height:66px;"/>
                    </div>
                    <div class="wrapper_box">
                        <text class="wrapper_box_text">立即转账</text>
                        <text class="wrapper_box_text" style="font-size:24px;">支持行内/跨行转账</text>
                    </div>
                    <image :src="imgarrow" style="width:22px;height:32px" />
                </div>
                <div class="account">
                    <div class="account_box">
                        <image :src="transRecordsSrc" class="account_box_img" />
                        <text class="account_box_text" @click="transferRecordEnquiry">转账记录查询</text>
                    </div>
                    <div class="account_box">
                        <text class="divide"></text>
                    </div>
                    <div class="account_box">
                        <image :src="payeeManagerSrc" class="account_box_img" />
                        <text class="account_box_text" @click="payeeAccountManagement">收款人账户管理</text>
                    </div>
                </div>
                <div class="splitDiv"></div>
                <div class="transfer" @click="login">
                    <div class="transfer_box">
                        <text class="recentTransTtile">最近转账 一点即转</text>
                    </div>
                    <div class="transfer_box" @click="recentLanuch">
                        <text class="transfer_box_blue">最近我发起的</text>
                        <image :src="blueRightArrowSrc" style="width:15px;height:25px;margin-left:15px" />
                    </div>
                </div>

                <div class="list_second" v-if="CommonPayerAcNoList.length>0" >
                    <div class="list_second_content" @click="shiftCaiZheng">
                        <image :src="imgdata(CommonPayerAcNoList[0].PayeeBank)" class="list_item_img" />
                        <div class="list_first_content">
                            <div style="width:570px;flex-direction: row;height:50px;line-height:50px;align-items:center;">
                                <text class="recentBankInner">{{ellipsis(CommonPayerAcNoList[0].PayeeAcName,13)}}</text>
                                <text class="list_item_middle_count">{{CommonPayerAcNoList.length}}</text>
                            </div>
                            <image :src="downArrowSrc" class="list_item_img2" />
                        </div>
                    </div>
                </div>

                <div class="list_second" v-if="showMore">
                    <div v-for="(item,index) in CommonPayerAcNoList" :key="index" class="list_second_item" @click="goFastTrans(item,'0')">
                        <div class="list_first_content2">
                            <div class="list_item_left">
                                <image :src="imgdata(item.PayeeBank)" class="list_item_img1" />
                            </div>
                            <div class="list_item_middle">
                                <text class="list_item_middle_title">{{ellipsis(item.PayeeAcName,10)}} ({{dividelastfour(item.PayeeAcNo)}})</text>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="list_second">
                    <div v-for="(item,index) in OtherPayeeList" :key="index" class="list_second_item">
                        <div class="list_second_content" @click="goFastTrans(item,'1')">
                            <div class="list_item_left">
                                <image :src="imgdata(item.PayeeBank,item.BankName)" class="list_item_img" />
                            </div>
                            <div style="border-bottom-width:1px;border-bottom-color:rgba(234,234,234,1);width:630px;height:142px;padding-top:21px;">
                                <div class="list_item_middle">
                                    <text class="list_item_middle_title" style="margin-bottom:10px;">{{ellipsis(item.PayeeAcName,13)}}</text>
                                    <text class="cooperParenter" v-if="item.PayeeacAlias">{{item.PayeeacAlias}}</text>
                                    <text class="list_item_middle_bank">{{item.BankName}} (尾号{{dividelastfour(item.PayeeAcNo)}})</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- </div> -->
        </scroller>
    </div>
</template>
<script>
    import NavBar from "../components/titlebar_component.vue";
    const modal = weex.requireModule("modal");
    const stream = weex.requireModule("stream");
    const context = weex.requireModule("context");
    export default {
        components: { NavBar },
        data() {
            return {
                payeeManagerSrc: "./imgs/payeeManager.png",
                transRecordsSrc: "./imgs/transRecords.png",
                blueRightArrowSrc: "./imgs/blueRightArrow.png",
                downArrowSrc: "./imgs/downArrow.png",
                bankLogosrc: "./imgs/gslo.png",
                imgarrow: "./imgs/whiteRightArrow.png",
                transferIndexIcon: "./imgs/transferIndexIcon.png",
                OtherPayeeList: [
                    // {PayeeAcName:"附近的时刻",BankName:"江苏你的发你看",PayeeAcNo:"665525552665",PayeeacAlias:'担惊受恐'}
                ],//最近收款人列表
                CommonPayerAcNoList: [
                    // {PayeeAcName:"的接口苏菲的世界的接口苏菲的世界",PayeeBank:'302',PayeeAcNo:'4854'}
                ],//本客户号下可操作的加挂账户
                showMore: false,
            };
        },
        created() {
            this.getAcctList();
        },
        watch:{
            "$store.state.updateList":{
                handler(newV,oldV){
                    if(newV=='1'){
                        this.getAcctList();
                        this.$store.state.updateList="";
                    }
                }
            }
        },
        methods: {
            // 查询账号列表
            getAcctList() {
                this.post("/eweb/TransferAcNoQry.do", {PayeeAcNoType:'T'}, response => {
                    this.OtherPayeeList=response.data.OtherPayeeList;
                    this.CommonPayerAcNoList = response.data.CommonPayerAcNoList;
                });
            },
            shiftCaiZheng(){
                this.showMore = !this.showMore;
                if(this.showMore){
                    this.downArrowSrc="./imgs/upArrow.png";
                }else{
                    this.downArrowSrc="./imgs/downArrow.png";
                }
            },
            ImmediatelyTransfer() {
                this.clearSubmitData();//重置转账参数
                this.jump("/PayerInfo");
            },
            payeeAccountManagement() {
                context.launchStage('main.transferBook');
            },
            transferRecordEnquiry() {
                this.jump("/RecordList");
            },
            goFastTrans(item,flag){
                if(flag=='0'){
                    this.$store.state.transferSubmitData.PayeeAcName=item.PayeeAcName||this.$store.state.transferSubmitData.PayeeAcName;
                    this.$store.state.transferSubmitData.PayeeAcNo=item.PayeeAcNo||this.$store.state.transferSubmitData.PayeeAcNo;
                    this.$store.state.transferSubmitData.PayeeBankName=item.BankName||this.$store.state.transferSubmitData.PayeeBankName;
                    this.$store.state.transferSubmitData.PayeeBank = item.PayeeBank||this.$store.state.transferSubmitData.PayeeBank;//转账-收款方银行序列号
                    this.$store.state.transferSubmitData.BankCode = item.BankCode||this.$store.state.transferSubmitData.BankCode;//转账-收款方银行网点号
                }else{
                    this.$store.state.transferSubmitData.PayeeAcName=item.PayeeAcName||this.$store.state.transferSubmitData.PayeeAcName;
                    this.$store.state.transferSubmitData.PayeeAcNo=item.PayeeAcNo||this.$store.state.transferSubmitData.PayeeAcNo;
                    this.$store.state.transferSubmitData.PayeeBankName=item.BankName||this.$store.state.transferSubmitData.PayeeBankName;
                    this.$store.state.transferSubmitData.PayeeBank = item.PayeeBank||this.$store.state.transferSubmitData.PayeeBank;//转账-收款方银行序列号
                    this.$store.state.cityCode = item.ProCity||this.$store.state.cityCode;//转账-收款人城市码（用于查询网点名称列表）
                    this.$store.state.transferSubmitData.PayeeProvince.Name=item.ProvinceName||this.$store.state.transferSubmitData.PayeeProvince.Name;//收款人省份名称
                    this.$store.state.transferSubmitData.PayeeCity.Name=item.CityName||this.$store.state.transferSubmitData.PayeeCity.Name;//收款人城市名称
                    this.$store.state.transferSubmitData.PayeeNetName.Name=item.LName||this.$store.state.transferSubmitData.PayeeNetName.Name;//收款人网点名称
                    this.$store.state.transferSubmitData.PayeeNetName.Value=item.BankCode||this.$store.state.transferSubmitData.PayeeNetName.Value;//网点号
                    this.$store.state.transferSubmitData.mobilePhone=item.Phone?item.Phone:'';
                    this.$store.state.transferSubmitData.SysFlag=item.SysFlag;//收款人管理簿标识网点省市，网点名称是否可用（1可用）
                }
                this.jump('/FastTrans');
            },
            //跳转工作台查看最近我发起的
            recentLanuch(){
                context.launchStage('main.tabBench?sevenTransfer=0');
            },
        }
    };
</script>
<style scoped>
    .scroller{
        position: fixed;
        bottom: 0px;
        width:750px;
    }
    .wrapper {
        height: 150px;
        width: 690px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin: 15px 30px 0 30px;
        border-radius: 12px;
        padding-left: 40px;
        padding-right: 40px;
        background-image: -webkit-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: -o-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: -moz-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: linear-gradient(to right, #FB5D7A, #E6022C);
    }

    .wrapper_box_img1 {
        width: 100px;
        height: 100px;
    }

    .wrapper_box_img {
        width: 50px;
        height: 50px;
    }

    .wrapper_box_text {
        color: #ffffff;
        font-size: 30px;
        width: 460px;
        padding: 10px 20px 10px 20px;
    }

    .account {
        width: 750px;
        height: 90px;
        margin-top: 20px;
        padding-left: 30px;
        padding-right: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
    
    .account_box {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .divide{
        width: 1px;
        height: 60px;
        background-color:rgba(234,234,234,1);
    }
    .splitDiv{
        width:750px;
        height:20px;
        background-color:rgba(249,249,249,1);
    }
    .recentTransTtile{
        font-size:32px;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .account_box_img {
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }
    .account_box_text{
        font-size: 30px;
        font-weight: bold;
        color: #333;
    }
    .transfer {
        width: 750px;
        padding-left: 40px;
        padding-right: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-width: 1px;
        border-color: rgba(234, 234, 234, 1);
    }

    .transfer_box {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 50px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .transfer_box_blue {
        font-size:28px;
        font-weight:500;
        color:rgba(74,137,252,1);
    }

    .list_first {
        background-color: #ffffff;
    }

    .list_first_content {
        padding-top: 40px;
        padding-bottom: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-color: #ddd;
        width: 630px;
    }

    .list_first_content2 {
        margin-left: 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-color: #ddd;
        width: 630px;
    }

    .list_second {
        background-color: #ffffff;
    }

    .list_second_content {
        /* padding-top:20px; */
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .list_item_img {
        width: 56px;
        height: 56px;
        margin-left: 30px;
        margin-right: 20px;
    }

    .list_item_img1 {
        width: 56px;
        height: 56px;
        margin-right: 20px;
    }

    .list_item_img2 {
        width: 25px;
        height: 14px;
        right: 10px;
    }

    .recentBankInner {
        font-size: 30px;
        color: rgba(51,51,51,1);
        font-weight:500;
        line-height:35px;
        margin-top: 10px;
    }
    .list_item_left{
        height: 80px;
        justify-content: center;
    }
    .list_item_middle{
        height: 100px;
        flex-direction: column;
        justify-content: center;
    }
    .list_item_middle_title {
        width: 444px;
        font-size: 30px;
        color: rgba(51,51,51,1);
        font-weight:500;
    }

    .list_item_middle_count {
        font-size: 24px;
        width:36px;
        height:36px;
        background-color:rgba(237,70,101,1);
        border-radius: 25px;
        position: relative;
        top: 0px;
        color: #fff;
        text-align: center;
        line-height: 36px;
        margin-left: 20px;
    }
    .cooperParenter{
        position:absolute;
        right: 10px;
        top:25px;
        font-size:20px;
        font-weight:500;
        color:rgba(230,2,44,1);
        line-height:28px;
        background-color:rgba(254,240,238,1);
        border-radius:4px;
        padding:5px;
    }
    .list_item_middle_bank {
        font-size: 26px;
        color:rgba(124,124,124,1);
    }
</style>