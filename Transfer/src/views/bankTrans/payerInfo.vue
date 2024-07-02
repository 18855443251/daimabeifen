<template>
  <div class="payerInfo">
    <nav-bar title="转账汇款"></nav-bar>
    <!-- 填写付款方信息 -->
    <scroller>
      <div>
        <div style="padding-left:30px;padding-right:30px;">
            <div class="wrapper">
              <text class="wrapper_title_one">1</text>
              <text class="wrapper_title_two">/2</text>
              <text class="wrapper_title_text">填写付款方信息</text>
            </div>
            <div class="account" style="height:144px;" @click="jumpToChooseAcct">
                <text class="account_title">付款方账号</text>
                <div class="account_box">
                  <text class="account_box_input" v-if="!$store.state.accountProtect">{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat}}</text>
                  <text class="account_box_input" v-else>{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat(6,-4)}}</text>
                </div>
                <image :src="imgarrow" class="account_box_img"/>
            </div>
            <div class="avaliableBal">
                <text class="account_box_title">可用余额:¥</text>
                <text class="avaliableBalText">{{$store.state.transferSubmitData.PayerAcAvailBal | NumFormat}}</text>
            </div>
            <div class="payeeNameBox">
              <text class="payeeNameTitle">付款方名称</text>
              <text class="name_title1">{{$store.state.transferSubmitData.PayerAcName}}</text>
            </div>
        </div>
        <SplitDiv/>

        <div style="padding-left:30px;padding-right:30px;">
            <div style="border-bottom-width:1px;border-bottom-color:rgba(234,234,234,1);padding-top:10px;padding-bottom:10px;" @click="selectBooks" v-if='$store.state.transferSubmitData.PayerOpenFlag == "Y"'>
                <text class="account_title" style="margin-top:15px;">账簿号/账簿名</text>
                <text class="actbookClass" v-if="!$store.state.transferSubmitData.selectAcctBookItem">请选择账簿</text>
                <text class="actbookClass" v-else>{{$store.state.transferSubmitData.selectAcctBookItem.AsAcno}}/{{$store.state.transferSubmitData.selectAcctBookItem.AsAcname}}</text>
                <image :src="imgarrow" class="account_box_img" />
            </div>
            <div class="money">
                <text class="account_title" style="margin-top:30px;">转账金额</text>
                <div class="list_item_box" style="padding-top:30px">
                  <text style="font-size: 60px">¥</text>
                  <!-- stringRegex传入的正则  使用onChange获取值，不能使用 v-model 自定义字体颜色使用#ffffff格式,其他格式字体可能显示不出来-->
                  <!-- isTS = "true" 不传或者false代表   不格式化    金额格式化  加逗号 2,000.00;disabled:传字符串true或者false    true为不可输入   false或者无这个属性是可输入  -->
                  <price-input isTS = "true" :textValue="transferMoney" @onChange="getTranMoney" placeholder="请输入转账金额" :stringRegex="stringRegex" 
                  class="transferMoneyInput" type="number"></price-input>
                  <text class="formatunit">{{changeAmountUnit($store.state.transferSubmitData.Amount)}}</text>
                </div>
                <text class="name_title">大写金额:{{$store.state.transferSubmitData.Amount|changeMoneyToChinese}}</text>
            </div>
            <text class="text_blue" @click="openTransferWay">{{$store.state.transTypeList[immediatelyFlag]}}</text>
        </div>
        <div class="next">
            <SubmitBtn @click.native="next" btntext="下一步" />
        </div>
      </div>
      <wxc-popup popup-color="white" :show="isBottomShow" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom" height="530">
        <!--  150  286  464  -->
        <!-- <list class="transferWay"> -->
          <div class="transferWay_item">
            <div class="transferWay_item_box" @click="checkTransType(0,'实时到账')">
              <div class="box_img">
                  <text class="transferWay_desc1" :style="immediatelyFlag == 0?redFont:''">实时到账</text>
              </div>
              <text class="transferWay_desc">交易成功，实时转出</text>
            </div>
            <image v-if="immediatelyFlag == 0" :src="successImg" class="success_img" />
          </div>
          <div class="transferWay_item">
            <div class="transferWay_item_box" @click="checkTransType(1,'普通到账')">
              <div class="box_img">
                <text class="transferWay_desc1" :style="immediatelyFlag == 1?redFont:''">普通到账</text>
              </div>
              <text class="transferWay_desc">交易受理，2小时后转出，2小时内可撤销</text>
            </div>
            <image v-if="immediatelyFlag == 1" :src="successImg" class="success_img" />
          </div>
          <div class="transferWay_item">
            <div class="transferWay_item_box" @click="checkTransType(2,'次日到账')">
              <div class="box_img">
                <text class="transferWay_desc1" :style="immediatelyFlag == 2?redFont:''">次日到账</text>
              </div>
              <text class="transferWay_desc">交易受理，下一工作日10:00后转出，下一工作日10:00之前可撤销</text>
            </div>
            <image v-if="immediatelyFlag == 2" :src="successImg" class="success_img" />
          </div>
          <SplitDiv/>
          <div class="cancelBtnBox" @click="popupOverlayBottomClick">
              <text class="cancelBtn">取消</text>
          </div>
        <!-- </list> -->
      </wxc-popup>
    </scroller>
  </div>
</template>
<script>
  const picker = weex.requireModule("weex-picker");
  const context = weex.requireModule("context");
  const wjalert = weex.requireModule("weex-alert");
  const modal = weex.requireModule("modal");
  import NavBar from "../../components/titlebar_component.vue";
  import SplitDiv from "../../components/splitDiv.vue";
  import SubmitBtn from "../../components/submitBtn.vue";
  import { WxcPopup } from "weex-ui";
  export default {
    components: { NavBar, WxcPopup ,SplitDiv,SubmitBtn},
    data() {
      return {
        // 付款方账户
        PayerAcNo: '',//付款账号
        PayerAcName: '',//付款账户名
        PayerAcAvailBal: '',//付款账号可用余额
        PayerAcctBookNo: '',
        PayerAcctBookName: '',
        //  转账金额
        transferMoney: "",
        showTransferMoney: "",//这个是用来千分位格式化的金额变量
        // transType: '实时到账',
        imgarrow: "./imgs/greyRightArrow.png",
        isBottomShow: false,
        successImg: "./imgs/redGou.png",
        // Holiday4Tomorrow: false,
        // NormalTranfer4Today: false,
        immediatelyFlag: 0,
        redFont:{
          color:'#E6022C'
        },
        stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$"
      };
    },
    created() {
        this.SingleActBalQry();
        this.immediatelyFlag=this.$store.state.transferSubmitData.ImmediatelyFlag?this.$store.state.transferSubmitData.ImmediatelyFlag:this.immediatelyFlag;
        this.transferMoney=this.$store.state.transferSubmitData.Amount?this.$store.state.transferSubmitData.Amount:'';//转账金额
        // this.transType=this.$store.state.transType?this.$store.state.transType:this.transType;//到账方式
        let transflag=context.getParam('flag');//判断从哪个入口进入的快捷转账标识
        //账户余额跳转进入转账,获取缓存中的付款方信息
        if(transflag=='AccountQuery'){
            let accountData=JSON.parse(context.sessionGetString("accountData"));
            this.$store.state.transferSubmitData.PayerAcAvailBal = accountData.AvailBal;//余额
            this.$store.state.transferSubmitData.PayerAcNo = accountData.AcNo;
            this.$store.state.transferSubmitData.PayerAcName = accountData.AcName;
            this.$store.state.transferSubmitData.PayerCurrency = accountData.Currency;
            // this.$store.state.transferSubmitData.PayerBankName = accountData.DeptName;
            //下面2个参数暂无
            // this.$store.state.transferSubmitData.PayerOpenFlag = response.data.AcNoList[0].OpenFlag;//多级账簿开通标志
            // this.$store.state.transferSubmitData.AcSeq = response.data.AcNoList[0].AcSeq;//账户序号
        }
        if(context.sessionGetString('TransferPreFlag')!='0'&&transflag!='AccountQuery'){
            this.TransferPre();
        }
        context.sessionSetString('TransferPreFlag','');
    },
    watch:{
       '$store.state.transferSubmitData.PayerAcNo':{
            handler(newV,oldV){
                this.SingleActBalQry();
                this.getAcctBookQry(this.$store.state.transferSubmitData.PayerAcNo);
            },
            // immediate: true
        }
    },
    computed: {
      // 选择账簿
        transferPayerAcctBook() {
          return this.$store.state.PayerAcctBookNo;
        },
    },

    methods: {
      //获取过滤器方法
      NumFormat(value){
        let NumFormat=Vue.filter('NumFormat');
        return NumFormat(value);
      },
      getTranMoney(event){
          this.$store.state.transferSubmitData.Amount=event.value;
      },
      //跳转到实体账户
      jumpToChooseAcct(){
        this.jump('/ChooseAcct');
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
             var TrspurposeList = response.data.TrspurposeList;
                    if(TrspurposeList.length>0){
                        for(let i=0;i<TrspurposeList.length;i++){  //网银是否新增用途
                            this.$store.state.transUseList.push(TrspurposeList[i].PurposeMsg)
                        }
                    }
              // this.$store.state.transferSubmitData.PayerOpenFlag = response.data.AcNoList[0].OpenFlag;//多级账簿开通标志
              // this.$store.state.transferSubmitData.AcSeq = response.data.AcNoList[0].AcSeq;//账户序号
              // this.Holiday4Tomorrow = (response.data.Holiday4Tomorrow == 0 ? true : false);
              // this.NormalTranfer4Today = (response.data.NormalTranfer4Today == 0 ? true : false);
              // this.$store.state.transferSubmitData.PayerBankName=response.data.AcNoList[0].BankName;
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
      next() {
            if (this.isEmpty(this.$store.state.transferSubmitData.Amount)) {
                wjalert.alert("请输入转账金额",'确定',data=>{});
                return;
            }else if(Number(this.$store.state.transferSubmitData.Amount)==0){
                wjalert.alert("转账金额不能为0",'确定',data=>{});
                return;
            }else if(Number(this.$store.state.transferSubmitData.Amount)>Number(this.$store.state.transferSubmitData.PayerAcAvailBal)){
                wjalert.alert("可用余额不足",'确定',data=>{});
                return;
            }else if(this.$store.state.transferSubmitData.PayerOpenFlag == "Y"&&!this.$store.state.transferSubmitData.selectAcctBookItem){
                wjalert.alert("请至少选中一个账簿进行转账",'确定',data=>{});
                return;
            }
            this.$store.state.transferSubmitData.ImmediatelyFlag = this.immediatelyFlag;
            // this.$store.state.transType = this.transType;//到账方式
            //enterResultFlag这个flag用来表明是从正常转账主页（payerIndex）进入的还是从快捷转账（fastTransfer）进入的,决定在转账失败页面
            //的"修改转账信息"返回跳转方法不同
            context.sessionSetString('enterResultFlag','payerIndex');
            this.jump({ path: "/PayeeInfo" });
      },
      openTransferWay() {
        this.isBottomShow = true;
      },
      // 关闭弹层
      popupOverlayBottomClick() {
        this.isBottomShow = false;
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

      // 选择
      checkTransType(flag, type) {
        // this.transType = type;
        this.immediatelyFlag = flag;
        this.popupOverlayBottomClick()
      }
    }
  };
</script>
<style scoped>
  input{
    outline: none;
  }
  .account_box_input {
    width: 550px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    line-height:30px;
  }
  .scroller{
    position:fixed;
    bottom:0px;
    width:750px;
  }
  .cancelBtnBox{
    height:120px;
    position: absolute;;
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
  .payeeNameBox{
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .payeeNameTitle{
      font-size:30px;
      line-height: 60px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
  }
  .payeeName{
      font-size:30px;
      line-height: 60px;
      font-family:PingFang-SC-Medium,PingFang-SC;
      font-weight:500;
      color:#7C7C7C;
  }
  .wrapper{
    flex-direction: row;
    margin: 40px 0;
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

  .account{
    padding-top: 20px;
    padding-bottom: 10px;
    background-color: #ffffff;
    justify-content: space-around;
    border-bottom-width:1px;
    border-bottom-color:rgba(234,234,234,1);
  }
  .account_title{
    font-size:30px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:35px;
    margin-bottom: 20px;
  }
  .actbookClass{
    line-height:50px;
    width:550px;
    font-size:30px;
    color:rgba(124,124,124,1);
  }
  .account_box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .avaliableBal{
    flex-direction: row;
    height: 50px;
    line-height:50px;
    margin-top:10px;
  }
  .avaliableBalText{
    font-size:30px;
    line-height: 50px;
    margin-left: 10px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(248,124,54,1);
  }
  .account_box_title {
    font-size:30px;
    line-height: 50px;
    font-weight:500;
    color:rgba(170,170,170,1);
  }

  .account_box_img {
    position: absolute;
    top: 60px;
    right: 30px;
    width: 14px;
    height: 24px;
  }

  .name_title {
    padding-top: 30px;
    padding-bottom: 30px;
    color:rgba(102,102,102,1);
    font-size: 30px;
  }

  .name_title1 {
    font-family: PingFangSC-Medium;
    font-size: 30px;
    color: #7C7C7C;
    letter-spacing: 0;
  }

  .text_blue {
    text-align: right;
    color: rgba(74,137,252,1);
    font-size: 30px;
    margin: 20px 20px;
  }

  .next {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .next_btn {
    width: 500px;
    height: 80px;
    background-color: gray;
    text-align: center;
    line-height: 80px;
    margin: 40px 0;
  }

  .list_item_box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234,234,234,1);
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
  .transferMoneyInput {
    width: 600px;
    height: 80px;
    background-color: #fff;
    color: #999999;
    font-size:48px;
  }
  input::-webkit-input-placeholder{
    color:rgba(170,170,170,1);
  }
</style>