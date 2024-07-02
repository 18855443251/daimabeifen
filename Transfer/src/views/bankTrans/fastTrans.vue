<template>
    <div class="payeeInfo">
        <nav-bar title="转账汇款" :showpayee="showpayee" rightTitle="转账记录" @rightClick="rightClick()"></nav-bar>
        <scroller>
            <div class="container">
                <div class="list">
                    <div class="list_item">
                        <text class="list_item_title">收款方</text>
                        <div class="list_item_box" @click="chooseBank">
                            <image :src="imgdata($store.state.transferSubmitData.PayeeBank,$store.state.transferSubmitData.PayeeBankName)" class="logo_img" />
                            <div class="payeeNameRight">
                                <div class="payeeNameTop">
                                    <text class="PayeeAcNameText">{{ellipsis($store.state.transferSubmitData.PayeeAcName,12)}}</text>
                                    <text class="bankname" v-if="$store.state.transferSubmitData.PayeeBankName">{{$store.state.transferSubmitData.PayeeBankName}}</text>
                                </div>
                                <div class="payeeNameTop">
                                    <text class="payeeAcNo" style="line-height: 50px">{{$store.state.transferSubmitData.PayeeAcNo|AccountNoFormat}}</text>
                                    <image :src="imgarrow" class="account_box_img"  style="margin-right:50px;"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SplitDiv />
                    <div class="money">
                        <text class="list_item_title" style="padding-left:30px;margin-bottom:0px;">转账金额</text>
                        <div class="list_item_box_inputmoney">
                            <text style="font-size: 54px">¥</text>
                            <price-input isTS="true" type="number" :textValue="transferMoney" @onChange="getTranMoney" placeholder="请输入转账金额" :stringRegex="stringRegex" 
                             class="transferMoneyInput" ></price-input>
                            <text class="formatunit">{{changeAmountUnit($store.state.transferSubmitData.Amount)}}</text>
                        </div>
                        <text class="upperCaseAmount">大写金额:{{$store.state.transferSubmitData.Amount|changeMoneyToChinese}}</text>
                    </div>
                    <SplitDiv />
                    <div class="account">
                        <div class="accountTop" @click="jumpToChooseAcct">
                            <div class="account_box">
                                <text class="list_item_title">付款方</text>
                                <div>
                                    <text class="account_box_input">{{$store.state.transferSubmitData.PayerAcName}}</text>
                                    <text class="account_box_input" v-if="!$store.state.accountProtect">{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat}}</text>
                                    <text class="account_box_input" v-else>{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat(6,-4)}}</text>
                                </div>
                            </div>
                            <image :src="imgarrow" class="account_box_img"  style="margin-right:30px;"/>
                        </div>
                        <div style="flex-direction:row;align-items:center;">
                            <text class="account_box_title">可用余额：</text>
                            <text class="avaliableBalText">¥{{$store.state.transferSubmitData.PayerAcAvailBal| NumFormat}}</text>
                        </div>
                    </div>
                    <SplitDiv />
                    <div class="account" v-if='$store.state.transferSubmitData.PayerOpenFlag == "Y"' @click="selectBooks">
                        <div class="accountTop">
                            <div class="account_box">
                                <text class="list_item_title">账簿号/账簿名</text>
                                <text class="account_box_input" v-if="!$store.state.transferSubmitData.selectAcctBookItem">请选择账簿</text>
                                <text class="account_box_input" v-else>{{$store.state.transferSubmitData.selectAcctBookItem.AsAcno}}/{{$store.state.transferSubmitData.selectAcctBookItem.AsAcname}}</text>
                            </div>
                            <image :src="imgarrow" class="account_box_img" style="margin-right:30px;"/>
                        </div>
                    </div>
                    <div class="account">
                        <div class="accountTop" @click="isBottomShow = true" v-if="$store.state.transferSubmitData.BankNodeFlag=='Y'">
                            <div class="account_box">
                                <text class="list_item_title">网点省市</text>
                                <div class="province_city">
                                    <text class="netWorkProCity">{{ $store.state.transferSubmitData.PayeeProvince.Name }}</text>
                                    <text class="netWorkProCity" v-if="$store.state.transferSubmitData.PayeeCity.Name">-</text>
                                    <text class="netWorkProCity" v-if="$store.state.transferSubmitData.PayeeCity.Name">{{ $store.state.transferSubmitData.PayeeCity.Name }}</text>
                                </div>
                            </div>
                            <image :src="imgarrow" class="account_box_img" style="margin-right:30px;"/>
                        </div>
                        <div class="accountTop" @click="ChooseNetName" v-if="$store.state.transferSubmitData.BankNodeFlag=='Y'">
                            <div class="account_box">
                                <text class="list_item_title">网点名称</text>
                                <div>
                                    <text class="account_box_input">{{$store.state.transferSubmitData.PayeeNetName.Name}}</text>
                                    <text class="account_box_input">{{$store.state.transferSubmitData.PayeeNetName.Value}} </text>
                                </div>
                            </div>
                            <image :src="imgarrow" class="account_box_img" style="margin-right:30px;"/>
                        </div>
                        <div class="accountTop">
                            <div class="account_box">
                                <text class="list_item_title">转账用途</text>
                                <div class="province_city">
                                    <input type="text" style="height:40px;" maxlength="20" v-model="$store.state.transferSubmitData.transferUse" placeholder="请选择或输入转账用途(必输)" class="account_box_input" />
                                </div>
                            </div>
                            <div class="transuseImgBox" @click="chooseTransUse">
                                <image :src="imgarrow" class="transuseImg" />
                            </div>
                        </div>
                        <div class="accountTop">
                            <div class="account_box">
                                <text class="list_item_title">短信通知收款人（免费）</text>
                                <div class="province_city">
                                    <!-- <input type="text"  v-model="$store.state.transferSubmitData.mobilePhone" placeholder="请选择或输入短信通知收款人(选填)" class="account_box_input" /> -->
                                    <price-input class="account_box_input_phone" style="height:40px;" :textValue="$store.state.transferSubmitData.mobilePhone" @onChange="formatPhone" placeholder="请输入手机号码(选填)" :stringRegex="stringRegexPhone" 
                                    type="number"></price-input>
                                </div>
                            </div>
                            <image :src="choosePayeeIcon" style="width:48px;height:48px;margin-right:20px;" @click="getPhone"/>
                        </div>
                    </div>
                    <div class="list_item_box">
                        <text class="text_blue" @click="isBottomShow3 = true">{{transType}}</text>
                    </div>
                    <SubmitBtn @click.native="submit" btntext="下一步" />
                </div>
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
                <!-- 到账方式 -->
                <wxc-popup popup-color="white" :show="isBottomShow3" @wxcPopupOverlayClicked="isBottomShow3=false" pos="bottom" height="530">
                    <!--  150  286  464  -->
                    <!-- <list class="transferWay"> -->
                    <div class="transferWay_item">
                        <div class="transferWay_item_box" @click="checkTransType(0,'实时到账')">
                        <div class="box_img">
                            <text class="transferWay_desc1" :style="$store.state.transferSubmitData.ImmediatelyFlag == 0?redFont:''">实时到账</text>
                        </div>
                        <text class="transferWay_desc">交易成功，实时转出</text>
                        </div>
                        <image v-if="$store.state.transferSubmitData.ImmediatelyFlag == 0" :src="successImg" class="success_img" />
                    </div>
                    <div class="transferWay_item">
                        <div class="transferWay_item_box" @click="checkTransType(1,'普通到账')">
                        <div class="box_img">
                            <text class="transferWay_desc1" :style="$store.state.transferSubmitData.ImmediatelyFlag == 1?redFont:''">普通到账</text>
                        </div>
                        <text class="transferWay_desc">交易受理，2小时后转出，2小时内可撤销</text>
                        </div>
                        <image v-if="$store.state.transferSubmitData.ImmediatelyFlag == 1" :src="successImg" class="success_img" />
                    </div>
                    <div class="transferWay_item" style="border-width:0px;">
                        <div class="transferWay_item_box" @click="checkTransType(2,'次日到账')">
                        <div class="box_img">
                            <text class="transferWay_desc1" :style="$store.state.transferSubmitData.ImmediatelyFlag == 2?redFont:''">次日到账</text>
                        </div>
                        <text class="transferWay_desc">交易受理，下一工作日10:00后转出，下一工作日10:00之前可撤销</text>
                        </div>
                        <image v-if="$store.state.transferSubmitData.ImmediatelyFlag == 2" :src="successImg" class="success_img" />
                    </div>
                    <SplitDiv/>
                    <div class="cancelBtnBox" @click="isBottomShow3=false">
                        <text class="cancelBtn">取消</text>
                    </div>
                    <!-- </list> -->
                </wxc-popup>
            </div>
        </scroller>
    </div>
</template>
<script>
    import NavBar from "../../components/titlebar_component.vue";
    import SplitDiv from "../../components/splitDiv.vue";
    import SubmitBtn from "../../components/submitBtn.vue";
    import { WxcPopup } from "weex-ui";
    const context = weex.requireModule("context");
    const stream = weex.requireModule("stream");
    const modal = weex.requireModule("modal");
    const weexContacts = weex.requireModule("weex-contacts");//获取通讯录联系电话
    const picker = weex.requireModule("weex-picker");//下拉框
    import { WxcMask } from "weex-ui";
    const wjalert = weex.requireModule("weex-alert");
    export default {
        components: { NavBar, WxcPopup, WxcMask ,SplitDiv,SubmitBtn},
        data() {
            return {
                showpayee:true,
                bankLogoimg: "./imgs/gslo.png",
                imgarrow: "./imgs/greyRightArrow.png",
                choosePayeeIcon: "./imgs/choosePayeeIcon.png",
                cancelImgSrc:this.$store.state.imgBaseUrl+'cancelImg.png',
                showChooseCity:0,
                redFont:{
                    color:'#E6022C'
                },
                // 网点省市
                province: "",
                city: "",
                // 网点名称
                transType:"实时到账",//转账方式(实时，普通，次日)
                isBottomShow: false,//省市选择
                isBottomShow3: false,//到账方式选择
                show: false,
                transferMoney:'',
                hasAnimation: true,
                successImg: "./imgs/redGou.png",
                provinceList: [],
                cityList: [],
                // Holiday4Tomorrow: false,
                // NormalTranfer4Today: false,
                // immediatelyFlag:'0',
                selectedProText:'请选择',
                selectedCityText:'请选择',
                transUseIndex:0,
                transUseList:['货款','采购款','工资','借款','往来款','还款','差旅费','保证金','运费'],
                stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$",
                stringRegexPhone:'^[1]\\d{0,10}$',
                refreshNetNameByCityCode:false,//当在本页切换城市时变为true再刷新
            };
        },
        created() {
            this.$store.state.transferSubmitData.transferUse='往来款';
            this.SingleActBalQry();
            // this.immediatelyFlag=this.$store.state.transferSubmitData.ImmediatelyFlag?this.$store.state.transferSubmitData.ImmediatelyFlag:this.immediatelyFlag;
            this.transferMoney=this.$store.state.transferSubmitData.Amount?this.$store.state.transferSubmitData.Amount:'';//转账金额
            this.transType=this.$store.state.transType?this.$store.state.transType:this.transType;//到账方式
            //获取扫一扫存在session里的数据用于转账
            let transflag=context.getParam('flag');//判断从哪个入口进入的快捷转账标识
            let fastTransferFlag=context.sessionGetString('fastTransferFlag');//从收款人登记簿进入快捷转账
            if(transflag=='scan'&&context.sessionGetString('TransferPreFlag')!='0'){
                let tansferdata=JSON.parse(context.sessionGetString("tansferdata"));
                this.$store.state.transferSubmitData.PayeeAcNo = tansferdata.AcNo;//转账-收款方账号
                this.$store.state.transferSubmitData.PayeeAcName = tansferdata.AcName;//转账-收款方名称
                this.$store.state.transferSubmitData.PayeeBankName=tansferdata.DeptName;//转账-收款方开户行
                this.$store.state.transferSubmitData.PayeeBank=tansferdata.DeptId;//这是收款方开户行号
                this.$store.state.transferSubmitData.SysFlag=tansferdata.SysFlag;//收款人管理簿标识网点省市，网点名称是否可用（1可用）
            }
            //从再转一笔或者修改转账信息(transAgain)，或者收款人登记簿（transferBook）入口进入快捷转账
            if((transflag=='transAgain'||fastTransferFlag=='transferBook')&&context.sessionGetString('TransferPreFlag')!='0'){
                let payeeDetail=JSON.parse(context.sessionGetString("payeeDetail"));
                this.$store.state.transferSubmitData.PayeeAcNo = payeeDetail.PayeeAcNo;//转账-收款方账号
                this.$store.state.transferSubmitData.PayeeAcName = payeeDetail.PayeeAcName;//转账-收款方名称
                this.$store.state.cityCode = payeeDetail.ProCity;//转账-收款人城市码（用于查询网点名称列表）
                this.$store.state.transferSubmitData.PayeeProvince.Name=payeeDetail.ProvinceName;//收款人省份名称
                this.$store.state.transferSubmitData.PayeeCity.Name=payeeDetail.CityName;//收款人城市名称
                this.$store.state.transferSubmitData.PayeeNetName.Name=payeeDetail.LName;//收款人网点名称
                this.$store.state.transferSubmitData.PayeeNetName.Value=payeeDetail.BankCode;//网点号
                this.$store.state.transferSubmitData.PayeeBankName = payeeDetail.BankName;//转账-收款方银行名称
                this.$store.state.transferSubmitData.PayeeBank = payeeDetail.PayeeBank;//转账-收款方银行序列号
                this.$store.state.transferSubmitData.mobilePhone=payeeDetail.Phone?payeeDetail.Phone:'';
                this.$store.state.transferSubmitData.SysFlag=payeeDetail.SysFlag;//收款人管理簿标识网点省市，网点名称是否可用（1可用）
                context.sessionSetString('fastTransferFlag','');
                context.sessionSetString('payeeDetail','');
            }
             //获取省市列表
            this.getProvinceList();
            this.transUse();
            //当不是从选择账户页面或者网点名称选择页面返回时，默认查询TransferPre.do交易(TransferPreFlag==0是从选择账户页面)
            if(context.sessionGetString('TransferPreFlag')!='0'){
                this.TransferPre();
            }
            context.sessionSetString('TransferPreFlag','');
        },
        watch:{
            //付款方账号变化时查询相应余额
            '$store.state.transferSubmitData.PayerAcNo':{
               handler(newV,oldV){
                    this.SingleActBalQry();
                    this.getAcctBookQry(this.$store.state.transferSubmitData.PayerAcNo);
               },
                // immediate: true
            },
            //选择城市变化后查询相应网点列表
            '$store.state.cityCode':{
                handler(newV,oldV){
                    if(this.refreshNetNameByCityCode){
                        this.$store.state.transferSubmitData.PayeeNetName={Name:'请选择收款方银行网点名称',Value:''};
                    }
                },
            },
            //当checkBankInner测算是否显示网点和城市的标识所需的3个参数任意一个变化时均需重新测算
            '$store.state.transferSubmitData.PayeeAcNo':{
                handler(newV,oldV){
                    this.checkBankInner(this.$store.state.transferSubmitData.PayeeAcNo);
                },
                immediate: true,
                deep:true
            }
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
            formatPhone(event){
                this.$store.state.transferSubmitData.mobilePhone=event.value;
            },
            //查询付款账户信息
            TransferPre() {
                var supportType=['01','02','03','08'];
                this.post("/eweb/TransferPre.do", {}, response => {
                    this.$store.state.transferPayerAcctList = response.data.AcNoList;//本客户下可操作的账户列表

                    //过滤掉非人民币及不能转账的账户
                    this.$store.state.transferPayerAcctList=this.$store.state.transferPayerAcctList.filter(item=>{
                        return item.Currency=='CNY'&&supportType.includes(item.BankAcType);
                    });
                    if(this.$store.state.transferPayerAcctList.length!=0){
                        this.$store.state.transferSubmitData.PayerAcNo = this.$store.state.transferPayerAcctList[0].AcNo;
                        this.$store.state.transferSubmitData.PayerAcName = this.$store.state.transferPayerAcctList[0].AcName;
                        this.$store.state.transferSubmitData.PayerCurrency=this.$store.state.transferPayerAcctList[0].Currency;
                    }else{
                        wjalert.alert("暂无可操作账户","确定",data=>{});
                    }  
                    // var TrspurposeList = response.data.TrspurposeList;//网银是否新增用途
                    // if(TrspurposeList.length>0){
                    //     for(let i=0;i<TrspurposeList.length;i++){
                    //         this.transUseList.push(TrspurposeList[i].PurposeMsg);
                    //         this.$store.state.transUseList.push(TrspurposeList[i].PurposeMsg)
                    //     }
                    // }
                    // this.$store.state.transferSubmitData.PayerOpenFlag = response.data.AcNoList[0].OpenFlag;//多级账簿开通标志
                    // this.$store.state.transferSubmitData.AcSeq = response.data.AcNoList[0].AcSeq;//账户序号
                    
                    // this.Holiday4Tomorrow = (response.data.Holiday4Tomorrow == 0 ? true : false);
                    // this.NormalTranfer4Today = (response.data.NormalTranfer4Today == 0 ? true : false);
                });
            },
            //查询余额
            SingleActBalQry(){
                if(this.$store.state.transferSubmitData.PayerAcNo){
                    this.post('/eweb/CommonActBalQry.do',{AcNo:this.$store.state.transferSubmitData.PayerAcNo},response=>{
                        this.$store.state.transferSubmitData.PayerAcAvailBal=response.data.AvailBal;
                    });
                }
            },
            // 选择网点名称
            ChooseNetName() {
                // this.$store.state.transferSubmitData.ImmediatelyFlag = this.immediatelyFlag;
                this.$store.state.transType = this.transType;//到账方式
                this.jump({
                    name:'ChooseNetName'
                });
            },
            //跳转到实体账户
            jumpToChooseAcct(){
                // this.$store.state.transferSubmitData.ImmediatelyFlag = this.immediatelyFlag;
                this.$store.state.transType = this.transType;//到账方式
                this.jump('/ChooseAcct');
            },
            getTranMoney(event){
                this.$store.state.transferSubmitData.Amount=event.value;
            },
            // 选择转账方式
            checkTransType(flag, type) {
                this.transType = type;
                this.$store.state.transferSubmitData.ImmediatelyFlag = flag;
                this.isBottomShow3=false;
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
                    this.city = (this.cityList[0]) ? this.cityList[0] : '';
                    this.$store.state.cityCode=this.city.Value;
                });
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
                this.city = item;
                this.$store.state.transferSubmitData.PayeeCity=item;
                this.$store.state.cityCode=item.Value;
                this.selectedCityText=item.Name;
                this.isBottomShow = false;
            },
            showSelePro(){
                this.showChooseCity='0';
            },
            showSeleCity(){
                this.showChooseCity='1';
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
            submit() {
                if(!this.$store.state.transferSubmitData.PayeeBankName||this.$store.state.transferSubmitData.PayeeBankName=='请选择收款方银行'){
                    wjalert.alert("请选择收款方银行",'确定',data=>{});
                    return;
                }if (this.isEmpty(this.$store.state.transferSubmitData.Amount)) {
                    wjalert.alert("请输入转账金额",'确定',data=>{});
                    return;
                }else if(Number(this.$store.state.transferSubmitData.Amount)>Number(this.$store.state.transferSubmitData.PayerAcAvailBal)){
                    wjalert.alert("可用余额不足",'确定',data=>{});
                    return;
                }else if(Number(this.$store.state.transferSubmitData.Amount)==0){
                    wjalert.alert("转账金额不能为0",'确定',data=>{});
                    return;
                }else if(!this.$store.state.transferSubmitData.transferUse){
                    wjalert.alert("请输入转账用途",'确定',data=>{});
                    return;
                }else if(this.$store.state.transferSubmitData.PayerOpenFlag == "Y"&&!this.$store.state.transferSubmitData.selectAcctBookItem){
                    wjalert.alert("请至少选中一个账簿进行转账",'确定',data=>{});
                    return;
                }
                this.submitMain();
            },
            //转账交易公共部分
            submitMain(){
                    // this.$store.state.transferSubmitData.ImmediatelyFlag = this.immediatelyFlag;
                    this.$store.state.transType = this.transType;//到账方式
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
                        BankCode:this.$store.state.transferSubmitData.BankNodeFlag=='Y'?this.$store.state.transferSubmitData.PayeeNetName.Value:this.$store.state.transferSubmitData.BankCode //行外是收款行网点行号，行内则是银行总行行号
                    }
                    this.post("/eweb/TransferConfirm.do",params,response=>{
                        this.$store.state.transferSubmitData.Fee=response.data.Fee;//手续费
                        this.$store.state.transferSubmitData.PreferAmt=response.data.PreferAmt;//手续费优惠费用
                        this.$store.state.transferSubmitData.Postage=response.data.Postage;//邮电费
                        this.$store.state.transferSubmitData.TransferPath=response.data.TransferPath;//支付渠道代码
                        if(response.data.McertToastFlag=='Y'){
                            wjalert.confirm("该客户当日累计转账金额已到100W元，是否继续转账？","确定","取消",data=>{
                                if(data == "Y") {
                                    context.sessionSetString('enterResultFlag','fastTrans');
                                    this.jump({ path: "/TransferConfirm"});
                                }
                            })
                        }else{
                            context.sessionSetString('enterResultFlag','fastTrans');
                            this.jump({ path: "/TransferConfirm"});
                        }
                    });
            },
            getPhone(){
                weexContacts.requestContactAuthor(data=>{
                    this.$store.state.transferSubmitData.mobilePhone=JSON.parse(data).phone;
                });
            },
            //选择账簿
            selectBooks() {
                this.$router.push({
                    path:'/chooseAcctBook',
                    query:{
                        backflag:'back'
                    }
                })
            },
            // 选择网点省市
            chooseCity() {
                this.isBottomShow = true;
            },
            // 选择银行
            chooseBank() {
                context.launchStage('main.bankSearch?bankFlag=0');
            },
            // 关闭弹层
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            // 确定选择
            comfirm() { 
                this.isBottomShow = false; 
            },
            // 打开短信通知人弹层
            openSmsNotification() {
                this.show = true;
                this.hasAnimation = true;
            },
            cancel() {
                this.isBottomShow = false;
            },
            wxcMaskSetHidden() {
                this.show = false;
            },
            rightClick(){
                this.$router.push({
                    path:'/otherRecordList',
                    query:{
                        PyeAcctNo:this.$store.state.transferSubmitData.PayeeAcNo.replace(/[\s]/g,'')
                    }
                });
            }
        }
    };
</script>
<style scoped>
    input:focus{
        outline: none;
    }
    .bankname{
        font-size:20px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(230,2,44,1);
        margin-right: 40px;
        line-height: 40px;
        background-color: rgba(254,240,238,1);
        border-radius:4px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .payeeAcNo{
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(124,124,124,1);
    }
    .upperCaseAmount{
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        padding-left: 30px;
        margin-top: 20px;
    }
    .wrapper {
        background-color: rgb(64, 64, 64);
    }

    .wrapper_title {
        color: #ffffff;
        font-size: 32px;
        padding: 40px 20px 20px;
    }
    .cancelBtnBox{
        height:120px;
        position:absolute;
        justify-content: center;
        align-items: center;
        bottom:0px;
        width:750px;
    }
  .cancelBtn{
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(156,156,156,1);
  }
    .list_item {
        background-color: #ffffff;
        padding: 10px 20px;
        /* margin-top: 3px; */
    }

    .list_item_box {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .list_item_box_inputmoney{
        flex-direction: row;
        /* justify-content: space-between; */
        align-items: center;
        border-bottom-width:1px;
        border-bottom-color:rgba(234,234,234,1);
        padding-top:30px;
        padding-left:30px;
    }
    .input1 {
        height: 50px;
        width: 550px;
    }
    .input5 {
        height: 50px;
        width: 550px;
        font-weight: bold;
        font-size:34px;
        color: rgb(96, 123, 209);
    }

    .input2,
    .input3 {
        height: 50px;
        width: 200px;
    }

    .list_item_img,
    .notice_img {
        width: 34px;
        height: 34px;
    }

    .logo_img {
        width: 64px;
        height: 64px;
        margin-right: 20px;
    }
    .payeeNameRight{
        width: 650px;
        height:132px;
        justify-content:center;
    }
    .payeeNameTop{
        flex-direction:row;
        line-height: 60px;
        justify-content:space-between;
        align-items: center;
        margin-bottom:10px;
    }
    .PayeeAcNameText{
        width:400px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }

    .list_item_title {
        margin: 20px 0;
        font-size:30px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:30px;
    }

    .province_city {
        display: flex;
        flex-direction: row;
    }

    .text_blue {
        text-align: right;
        color: rgba(74,137,252,1);
        font-size: 30px;
        margin: 20px 20px;
        margin-left: 30px;
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
    .select_city_list {
        width: 690px;
        height: 619px;
        margin-right: 40px;
    }
    .select_city_item_text{
        width: 690px;
        height: 70px;
        text-align: left;
        line-height: 70px;
    }
    .select_city_item {
        width: 690px;
        height: 80px;
        text-align: left;
        line-height: 80px;
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

    .money {
        background-color: #ffffff;
        margin: 20px 0;
    }
    .transferMoneyInput {
        width: 600px;
        height: 80px;
        background-color: #fff;
        color: #999999;
        font-size:48px;
        margin-left: 20px;
    }
    .formatunit{
        position: absolute;
        top: 0px;
        left: 140px;
        font-size:24px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(170,170,170,1);
        line-height:24px;
        padding-left: 10px;
        border-left-width: 1px;
        border-left-color: rgba(170,170,170,1);
    }
     .avaliableBalText{
        font-size:30px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(248,124,54,1);
    }
    .account {
        background-color: #ffffff;
        padding-left: 30px;
    }
    .account_box {
        justify-content: space-between;
        margin-top: 20px;
    }
    .accountTop{
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
        border-bottom-width: 1px;
        border-bottom-color: rgb(234, 234, 234);
    }
    .account_box_title {
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(170,170,170,1);
        line-height:30px;
        margin:20px 0px;
    }
    .account_box_img {
        width: 14px;
        height: 24px;
    }
    .transuseImgBox{
        width: 50px;
        height: 90px;
        align-items: center;
        justify-content: center;
    }
    .transuseImg{
        width: 14px;
        height: 24px;
        margin-right:30px;
    }

    .account_box_input {
        width: 550px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:rgba(124,124,124,1);
        margin-bottom: 20px;
    }
    .account_box_input_phone{
        width: 550px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        color:#7C7C7C;
        margin-bottom: 20px;
    }
    .netWorkProCity{
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        /* font-weight:500; */
        color:rgba(124,124,124,1);
        margin-bottom: 20px;
    }

    .transferWay_item {
        height: 130px;  
        justify-content: center;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-color: rgba(234,234,234,1);
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 10px;
    }

    .transferWay_item_box {
        justify-content: center;
        align-items: center;
    }

    .box_img {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .transferWay_desc1 {
        color: #333;
        font-weight:500;
        font-size: 36px;
        margin-top: 20px;
    }
    .transferWay_desc {
        flex-direction: row;
        color: #999;
        font-size: 24px;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 10px;
    }

    .success_img {
        width: 48px;
        height: 32px;
        position: absolute;
        right: 30px;
        top: 30px;
    }

    .success_img_temp {
        width: 36px;
        height: 36px;
        margin-top: 20px;
        margin-right: 10px;
    }
</style>