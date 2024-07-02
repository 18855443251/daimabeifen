<template>
    <div class="payeeInfo">
        <nav-bar title="转账汇款"></nav-bar>
        <!-- 填写收款方信息 -->
        <scroller>
            <div style="padding-left:30px;"> 
                <div class="wrapper">
                    <text class="wrapper_title_one">2</text>
                    <text class="wrapper_title_two">/2</text>
                    <text class="wrapper_title_text">填写收款方信息</text>
                </div>
                <div class="list">
                    <div class="list_item">
                        <text class="list_item_title">收款方名称</text>
                        <div class="list_item_box">
                            <input type="text" v-model="$store.state.transferSubmitData.PayeeAcName" 
                            placeholder="请输入或者选择收款方" class="input1" :class="[$store.state.transferSubmitData.PayeeAcName?'input1RightText':'input1']" />
                        </div>
                        <image :src="choosePayeeIconSrc" class="choosePayeeIcon" @click="payeeAccountManagement" />
                    </div>
                    <div class="list_item" >
                        <text class="list_item_title">收款方账号</text>
                        <div class="list_item_box">
                            <input type="text" v-model="$store.state.transferSubmitData.PayeeAcNo" placeholder="请输入收款方账号" class="input1" 
                         :class="[$store.state.transferSubmitData.PayeeAcNo?'input1RightText':'input1']" @blur="checkAndDivide()" />
                        </div>
                    </div>
                    <div class="list_item" @click="chooseBank">
                        <text class="list_item_title">收款方银行</text>
                        <div class="list_item_box">
                            <text :class="[$store.state.transferSubmitData.PayeeBankName!='请选择收款方银行'?'input1RightText':'input1']">{{$store.state.transferSubmitData.PayeeBankName}}</text>
                        </div>
                        <image :src="rightarrowSrc" class="list_item_img" />
                    </div>
                    <!-- 跨行展示 -->
                    <div class="list_item" @click="chooseCity" v-if="$store.state.transferSubmitData.BankNodeFlag=='Y'">
                        <text class="list_item_title">网点省市</text>
                        <div class="list_item_box">
                            <div class="province_city">
                                <text :class="[$store.state.transferSubmitData.PayeeProvince.Name!='请选择收款方银行省市'?'greyInput':'notGreyInput']">{{ $store.state.transferSubmitData.PayeeProvince.Name }}</text>
                                <text class="greyInput" v-if="$store.state.transferSubmitData.PayeeCity.Name">-</text>
                                <text :class="[$store.state.transferSubmitData.PayeeCity.Name!='请选择收款方银行省市'?'greyInput':'notGreyInput']" v-if="$store.state.transferSubmitData.PayeeCity.Name">{{ $store.state.transferSubmitData.PayeeCity.Name }}</text>
                            </div>
                        </div>
                        <image :src="rightarrowSrc" class="list_item_img" />
                    </div>
                    <!-- 跨行展示 -->
                    <div class="list_item190" v-if="$store.state.transferSubmitData.BankNodeFlag=='Y'" @click="ChooseNetName" >
                        <text class="list_item_title">网点名称</text>
                        <div class="list_item_box">
                            <div>
                                <text :class="[$store.state.transferSubmitData.PayeeNetName.Name!='请选择收款方银行网点名称'?'greyInput':'notGreyInput']" style="margin-bottom:20px;">{{$store.state.transferSubmitData.PayeeNetName.Name}}</text>
                                <text class="greyInput" v-if="$store.state.transferSubmitData.PayeeNetName.Value">{{ $store.state.transferSubmitData.PayeeNetName.Value}}</text>
                            </div>
                        </div>
                        <image :src="rightarrowSrc" class="list_item_img"/>
                    </div>
                    <div class="list_item">
                        <text class="list_item_title">转账用途</text>
                        <div class="list_item_box">
                            <input type="text" maxlength="20" v-model="$store.state.transferSubmitData.transferUse" :class="[$store.state.transferSubmitData.transferUse?'input1RightText':'input1']" placeholder="请选择或输入转账用途(必输)" class="input1" />
                        </div>
                        <div class="list_item_img_box" @click="chooseTransUse">
                            <image :src="rightarrowSrc" style="width:14px;height:24px;" />
                        </div>
                    </div>
                    <text class="text_blue" @click="openSmsNotification">短信通知收款人</text>
                </div>
            </div>
            <SubmitBtn @click.native="submit" btntext="提交" />
            <!-- 网点省市选择 -->
            <wxc-popup popup-color="white" :show="isBottomShow" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom" height="819">
                <div class="select_city">
                    <div class="select_city_header">
                        <text class="district-title">地区选择</text>
                        <image :src="cancelImgSrc" class="cancelImg" @click="cancel" />
                    </div>
                    <div class="hasSelectedTitle">
                        <text class="hasSelectedTitleText" :class="[showChooseCity=='0'?'activeSelectedTitle':'']" @click="showSelePro">{{ellipsis(selectedProText,6)}}</text>
                        <text class="hasSelectedTitleText" :class="[showChooseCity=='1'?'activeSelectedTitle':'']" @click="showSeleCity" v-if="showChooseCity=='1'">{{ellipsis(selectedCityText,6)}}</text>
                    </div>
                    <div class="select_city_content">
                        <list class="select_city_list" v-if="showChooseCity=='0'">
                            <cell v-for="(item, index) in provinceList" :key="index" class="select_city_item" @click="selectprovince(item)">
                                <text class="select_city_item_text">{{ item.Name }}</text>
                            </cell>
                        </list>
                        <list class="select_city_list" v-if="showChooseCity=='1'">
                            <cell v-for="(sub, index) in cityList" :key="index" class="select_city_item" @click="selectcity(sub)">
                                <text class="select_city_item_text">{{ sub.Name }}</text>
                            </cell>
                        </list>
                    </div>
                </div>
            </wxc-popup>
            <!-- 输入短信通知收款人 -->
            <wxc-popup popup-color="white" :show="mesNotPhone" @wxcPopupOverlayClicked="mesNotPhoneBottomClick" pos="bottom" height="640">
                <div class="mesNotPhoneBox">
                    <image src="./imgs/cancelMsgIcon.png" class="cancelMsgIcon" @click="mesNotPhoneBottomClick"/>
                    <text>短信通知收款人（免费）</text>
                    <div class="mesPhoneInputBox">
                        <!-- <input type="tel" class="mesPhoneInput" placeholder="请输入手机号码(选填)" v-model="$store.state.transferSubmitData.mobilePhone" maxlength=11 /> -->
                        <price-input class="mesPhoneInput" :textValue="$store.state.transferSubmitData.mobilePhone" @onChange="formatPhone" placeholder="请输入手机号码(选填)" :stringRegex="stringRegexPhone" 
                   type="number"></price-input>
                        <image src="./imgs/choosePayeeIcon.png" class="chosePhoneIcon" @click="getPhone"/>
                    </div>
                    <SubmitBtn @click.native="confirmInputMsg" btntext="确认" class="confirmBtntext"/>
                </div>
            </wxc-popup>
        </scroller>
    </div>
</template>
<script>
    import NavBar from "../../components/titlebar_component.vue";
    import { WxcPopup } from "weex-ui";
    import SubmitBtn from "../../components/submitBtn.vue";
    const wjalert = weex.requireModule("weex-alert");
    const picker = weex.requireModule("weex-picker");
    const weexContacts = weex.requireModule("weex-contacts");//获取通讯录联系电话
    const context = weex.requireModule("context");
    const stream = weex.requireModule("stream");
    const modal = weex.requireModule("modal");
    import { WxcMask } from "weex-ui";
    export default {
        components: { NavBar, WxcPopup, WxcMask ,SubmitBtn  },
        data() {
            return {
                choosePayeeIconSrc:'./imgs/choosePayeeIcon.png',
                rightarrowSrc: "./imgs/greyRightArrow.png",
                cancelImgSrc:this.$store.state.imgBaseUrl+'cancelImg.png',
                // 网点省市
                province: {},
                city: {},
                // 网点名称
                // 转账用途
                isBottomShow: false,//选择城市浮层是否展示
                mesNotPhone:false,//输入短信浮层是否展示
                showChooseCity:0,//展示选择省或者市的展示的flag
                show: false,
                isFalse: false,
                noticeImg: "./imgs/camera@3x.png",
                provinceList: [],
                cityList: [],
                selectedProText:'请选择',
                selectedCityText:'请选择',
                transUseIndex:0,
                transUseList:['往来款','货款','采购款','工资','借款','还款','差旅费','保证金','运费'],
                stringRegex:'^[1]\\d{0,10}$',
                refreshNetNameByCityCode:false,//当在本页切换城市时变为true再刷新
                stringRegexPhone:'^[1]\\d{0,10}$',
                // showMobilePhone:''
            };
        },
        created() {
            this.$store.state.transferSubmitData.transferUse='往来款';
            this.transUse();
            //获取省市列表
            this.getProvinceList();
            context.sessionSetString('TransferPreFlag','');
            if(context.sessionGetString('updateBankInnerFlag')=='update'){
                this.checkBankInner(this.$store.state.transferSubmitData.PayeeAcNo);
            }
            context.sessionSetString('updateBankInnerFlag','');
        },
        mounted(){},
        watch:{
            '$store.state.cityCode':{
                handler(newV,oldV){
                    if(this.refreshNetNameByCityCode){
                        this.$store.state.transferSubmitData.PayeeNetName={Name:'请选择收款方银行网点名称',Value:''};
                    }
                }
            },
            // '$store.state.transferSubmitData.PayeeAcNo':{
            //     handler(newV,oldV){
            //         this.$store.state.transferSubmitData.PayeeAcNo=this.divieBanks(this.$store.state.transferSubmitData.PayeeAcNo);//将账号格式化为四位一分隔
            //     }
            // },
        },
        methods: {
             //只用来查询网银是否新增用途   后期优化
            transUse() {
                this.post("/eweb/TransferPre.do", {}, response => {
                    var TrspurposeList = response.data.TrspurposeList;//网银是否新增用途
                    if(TrspurposeList.length>0){
                        for(let i=0;i<TrspurposeList.length;i++){
                            this.transUseList.push(TrspurposeList[i].PurposeMsg);
                        }
                    }
                });
            },
            checkAndDivide(){
                this.checkBankInner(this.$store.state.transferSubmitData.PayeeAcNo);
                this.$store.state.transferSubmitData.PayeeAcNo=this.divieBanks(this.$store.state.transferSubmitData.PayeeAcNo);//将账号格式化为四位一分隔
            },
            //选择用途
            chooseTransUse(){
                picker.pick(
                    {
                        index: this.transUseIndex,
                        items: this.transUseList
                    },event => {
                        if (event.result === "success") {
                            this.transUseIndex = event.data;
                            this.$store.state.transferSubmitData.transferUse=this.transUseList[this.transUseIndex];
                        }
                    }
                );
            },
            //跳转到收款人账户管理
            payeeAccountManagement() {
                context.sessionSetString("enterBookFlag","0");//进入收款人管理簿的标识，0（转账进入）
                context.launchStage('main.transferBook');
            },
            //获取省列表
            getProvinceList() {
                this.post("/eweb/ProvinceListQry.do", {}, response => {
                    this.provinceList = response.data.ProvinceList;
                });
            },
            //获取市列表
            getCityList(ProvinceCode) {
                let params={};
                params.ProvinceCode=ProvinceCode;
                this.post("/eweb/CityListQry.do", params, response => {
                    this.cityList = response.data.CityList;
                    // this.city = (this.cityList[0]) ? this.cityList[0] : '';
                    // this.$store.state.cityCode=this.city.Value;
                });
            },
            showSelePro(){
                this.showChooseCity='0';
            },
            showSeleCity(){
                this.showChooseCity='1';
            },
            // 选择省改变市
            selectprovince(item) {
                this.province = item;
                this.showChooseCity='1';
                this.$store.state.transferSubmitData.PayeeProvince=item;
                this.selectedProText=item.Name;
                // 默认选第一个数据
                this.getCityList(item.Value);
            },
            // 选择市
            selectcity(item) {
                this.refreshNetNameByCityCode=true;
                this.city = item;
                this.$store.state.transferSubmitData.PayeeCity=item;
                this.$store.state.cityCode=item.Value;
                this.selectedCityText=item.Name;
                this.isBottomShow = false;
            },
            submit() {
                if(!this.$store.state.transferSubmitData.PayeeBankName||this.$store.state.transferSubmitData.PayeeBankName=='请选择收款方银行'){
                    wjalert.alert("请选择收款方银行",'确定',data=>{});
                }else if(!this.$store.state.transferSubmitData.transferUse){
                    wjalert.alert("请输入转账用途",'确定',data=>{});
                }else if(this.$store.state.transferSubmitData.BankNodeFlag=='Y'){
                    if(this.$store.state.transferSubmitData.PayeeProvince.Name=='请选择收款方银行省市'||!this.$store.state.transferSubmitData.PayeeCity.Name){
                        wjalert.alert("请选择收款方银行省市",'确定',data=>{});
                    }else if(!this.$store.state.transferSubmitData.PayeeNetName.Value){
                        wjalert.alert("请选择收款方网点名称",'确定',data=>{});
                    }else{
                        this.submitMain();
                    }
                }else{
                    this.submitMain();
                }
            },
            //转账交易公共部分
            submitMain(){
                    let params={
                        PayerAcNo:this.$store.state.transferSubmitData.PayerAcNo,   //付款账号
                        PayerAcName:this.$store.state.transferSubmitData.PayerAcName,   //付款户名
                        PayeeAcNo:this.$store.state.transferSubmitData.PayeeAcNo.replace(/[\s]/g,''),   //收款账号
                        PayeeAcName:this.$store.state.transferSubmitData.PayeeAcName,   //收款户名
                        PayerCurrency:this.$store.state.transferSubmitData.PayerCurrency,   //币种    
                        Currency:this.$store.state.transferSubmitData.PayerCurrency,   //币种    
                        ImmediatelyFlag:this.$store.state.transferSubmitData.ImmediatelyFlag,//是否是实时转账
                        Amount:this.$store.state.transferSubmitData.Amount,  //金额
                        AcctBookFlag:this.$store.state.transferSubmitData.PayerOpenFlag=='Y'?'Y':'',//多级账簿送Y
                        BankCode:this.$store.state.transferSubmitData.BankNodeFlag=='Y'?this.$store.state.transferSubmitData.PayeeNetName.Value:this.$store.state.transferSubmitData.BankCode,   //行外是收款行网点行号，行内则是银行总行行号
                    }
                    this.post("/eweb/TransferConfirm.do",params,response=>{
                        this.$store.state.transferSubmitData.Fee=response.data.Fee;//手续费
                        this.$store.state.transferSubmitData.PreferAmt=response.data.PreferAmt;//手续费优惠费用
                        this.$store.state.transferSubmitData.Postage=response.data.Postage;//邮电费
                        this.$store.state.transferSubmitData.TransferPath=response.data.TransferPath;//支付渠道代码
                        if(response.data.McertToastFlag=='Y'){
                            wjalert.confirm("该客户当日累计转账金额已到100W元，是否继续转账？","确定","取消",data=>{
                                if(data == "Y") {
                                    this.jump({ path: "/TransferConfirm"});
                                }
                            });
                        }else{
                            this.jump({ path: "/TransferConfirm"});
                        }
                    });
            },
            // 选择网点省市
            chooseCity() {
                this.isBottomShow = true;
            },
            // 选择银行
            chooseBank() {
                context.launchStage('main.bankSearch?bankFlag=0');
            },
            // 选择网点名称
            ChooseNetName() {
                //选择网点前需先选择银行
                if(this.$store.state.transferSubmitData.PayeeBank){
                    this.jump({
                        name:'ChooseNetName'
                    });
                }else{
                    wjalert.alert("请先选择银行","确定",data=>{});
                }
            },
            // 关闭弹层
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            mesNotPhoneBottomClick() {
                this.mesNotPhone = false;
            },
            // 确定选择
            comfirm() { 
                this.isBottomShow = false; 
            },
            cancel() {
                this.isBottomShow = false;
            },
            // 打开短信通知人弹层
            openSmsNotification() {
                this.mesNotPhone=true;
            },
            formatPhone(event){
                // this.showMobilePhone=event.value;
                this.$store.state.transferSubmitData.mobilePhone=event.value;
            },
            getPhone(){
                weexContacts.requestContactAuthor(data=>{
                    // this.showMobilePhone=JSON.parse(data).phone;
                    this.$store.state.transferSubmitData.mobilePhone=JSON.parse(data).phone;
                });
            },
            confirmInputMsg(){
                if(this.$store.state.transferSubmitData.mobilePhone.length!=11){
                    this.alertMsg("输入手机号位数不足");
                }else{
                    this.mesNotPhone=false;
                }
            }
        }
    };
</script>
<style scoped>
    input{
        outline: none;
    }
    .mesNotPhoneBox{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        padding:30px;
    }
    .chosePhoneIcon{
        width: 48px;
        height: 48px;
    }
    .mesPhoneInputBox{
        width:690px;
        height:90px;
        border-radius:8px;
        border-width: 1px;
        margin-top: 30px;
        border-color: rgba(221,221,221,1);
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .mesPhoneInput{
        width: 550px;
        height: 80px;
        font-size:28px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(170,170,170,1);
    }
    .cancelMsgIcon{
        width: 36px;
        height:36px;
        align-self: flex-end;
        margin-top: 10px;
        margin-bottom:40px;
    }
    .cityModal{
        /* width: 750px;
        height:600px; */
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .mainText{
        position:absolute;
        bottom:0px;
        height: 600px;
        width: 750px;
    }
    .scroller{
        position:fixed;
        bottom:0px;
        width:750px;
    }
    .wrapper{
        flex-direction: row;
        margin: 40px 0;
    }
    .list_item {
        background-color: #ffffff;
        height: 144px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
        justify-content: center;
        padding-top: 10px;
    }
    .list_item190 {
        background-color: #ffffff;
        height: 190px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
        justify-content: center;
        padding-top: 10px;
    }
    .wrapper_title_one{
      font-size:48px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(230,2,44,1);
      line-height:48px;
  }
  .wrapper_title_two{
      font-size:33px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(230,2,44,1);
      line-height:48px;
  }
  .wrapper_title_text {
    font-size:48px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:48px;
    margin-left: 40px;
  }
    .list_item_box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .input1 {
        height: 50px;
        width: 550px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(170,170,170,1);
    }
    .input1RightText{
        height: 50px;
        width: 550px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(102,102,102,1);
    }
    .notGreyInput{
        height: 50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(170,170,170,1);
    }
    .greyInput{
        height: 50px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(102,102,102,1);
    }
    .input2,
    .input3 {
        height: 50px;
        width: 200px;
    }

    .choosePayeeIcon{
        position: absolute;
        top: 48px;
        right: 30px;
        width: 48px;
        height: 48px;
    }
    .list_item_img_box{
        justify-content: center;
        align-items: flex-end;
        position: absolute;
        top: 0px;
        height: 144px;
        width:50px;
        right: 30px;
    }
    .list_item_img{
        position: absolute;
        top: 60px;
        right: 30px;
        width: 14px;
        height: 24px;
    }
    .notice_img {
        width: 34px;
        height: 34px;
    }

    .list_item_title {
        font-size:30px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-bottom: 15px;
    }

    .province_city {
        display: flex;
        flex-direction: row;
    }

    .text_blue {
        text-align: right;
        color: rgba(74,137,252,1);
        font-size: 32px;
        margin: 20px;
    }

    .submit {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .submit_title {
        width: 500px;
        height: 80px;
        background-color: gray;
        text-align: center;
        line-height: 80px;
        margin: 40px 0;
    }

    .select_city {
        /* height: 600px; */
        position:absolute;
        top: 0px;
        bottom:0px;
        width: 750px;
        background-color: #fff;
    }

    .select_city_header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100px;
        line-height: 100px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
    }
    .district-title{
        font-size:36px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .cancelImg{
        width: 28px;
        height: 28px;
        position: absolute;
        right: 30px;
        top: 36px;
    }
    .hasSelectedTitle{
        flex-direction: row;
        align-items:flex-end;
        height: 100px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
        padding-left: 40px;
        padding-right: 40px;
    }
    .hasSelectedTitleText{
        text-align: center;
        height: 100px;
        line-height: 100px;
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-right: 40px;
        /* background-color: red; */
    }
    .activeSelectedTitle{
        border-bottom-width: 6px;
        border-bottom-color: #F3395B;
    }
    .select_city_content {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 30px;
    }

    .select_city_item {
        width: 690px;
        height: 80px;
        text-align: left;
        line-height: 80px;
    }
    .select_city_item_text{
        width: 690px;
        height: 70px;
        text-align: left;
        line-height: 70px;
    }
    .select_city_list {
        width: 690px;
        height: 619px;
        margin-right: 40px;
    }

    .cityCheckedtype {
        border-bottom-width: 1px;
        border-top-width: 1px;
    }

    .SmsNotification {
        padding: 20px;
    }

    .SmsNotification_box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 20px;
    }

    .SmsNotification_title {
        margin: 0 19px;
    }
    .confirmBtntext{
        position: absolute;
        bottom: 50px;
        left: 40px;
    }
</style>