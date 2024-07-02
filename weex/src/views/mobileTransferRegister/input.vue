<template>
  <div class="container">
    <title-bar title="绑定手机号"></title-bar>
    <scroller>
    <div class="content">
      <div class="cellList">
        <div class="cellItem border-bottom">
          <text class="itemLeft">绑定手机号：</text>
          <text class="itemRight">{{mobilePhone|blurMobilePhone}}</text>
        </div>
        <div class="cellItem border-bottom">
          <text class="itemLeft">证件类型：</text>
          <text class="itemRight">{{IDinfor[IdType]}}</text>
        </div>
        <div class="cellItem">
          <text class="itemLeft">证件信息：</text>
          <text class="itemRight">{{IDCardC}}</text>
        </div>
      </div>
      <div class="cellList">
        <div @click="selectAccount" class="cellItem space-between border-bottom">
          <div class="cellLeft">
            <text class="itemLeft">绑定账户：</text>
            <text class="itemRight">{{accountNumC}}</text>
          </div>
          <div class="cellRight">
            <div class="arrow-wrapper">
              <image class="arrow" :src="arrow"></image>
            </div>
          </div>
        </div>
        <div class="cellItem border-bottom">
          <text @click="showDetail" class="itemLeft">默认账户：</text>
          <!-- <image class="instructions_img" :src="instructionsUrl"></image> -->
          <!-- <div class="itemRightClick" @click="checkDefaultAccount">
            <image class="check-img" :src="checkSrc" v-if="defaultAccount"></image>
            <image class="check-img" :src="uncheckSrc" v-if="!defaultAccount"></image>
          </div> -->
          <wjSwitch class="switch_right_sms" @onChange="checkDefaultAccount" ref="switchS" :status="vals"></wjSwitch>
        </div>
        <div class="cellItem space-between border-bottom">
            <text class="market">营销人员编号：</text>
            <input v-model="marketId" class="marketId" ref="inputMarket" placeholder="请输入营销人员编号（选填）" @change="queryOperIdName" maxlength="5" type="number" />
        </div>
        <div class="cellItem" v-if="marketName!=null&&marketName!=undefined&&marketName!=''">
            <text class="market">营销人员姓名：</text>
            <text class="itemRight" style="margin-left:21px;">{{marketName}}</text>
        </div>
        <div class="cellLeft">
          <image :src="checkSrc" class="check-img" @click="radioBtns" v-if="radioHidd"></image>
          <image :src="uncheckSrc" class="check-img" @click="radioBtns" v-else></image>
          <text class="black" @click="radioBtns">我已经阅读</text>
          <text class="blue" @click="agreement">《手机号支付注册协议》</text>
          <text class="black" @click="radioBtns">同意其中所有</text>
        </div>
        <text class="black" style="margin-left:53px;" @click="radioBtns">条款，愿意承担相应风险。</text>
      </div>
    </div>
    <div class="bottom">
      <text @click="toConfirm" class="bottom-button bottom-button-text">确认</text>
    </div>
    <text class="text_title">温馨提示:</text>
    <text class="example_top" v-for="(item,index) in textData" :key="index">{{item.top}}</text>
    </scroller>
    <wxc-popover ref="wxc-popover" :textStyle="textStyle" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition"></wxc-popover>
    <popup :isTrue="isTrue" :popupData="popupData" :orderType="orderType" :paramsPopup="paramsPopup" @closePopup="closePopup"></popup>
  </div>

</template> 

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const picker = weex.requireModule("weex-picker");
const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
import TitleBar from "@/components/templet/titlebar";
import Popup from "@/components/templet/popup";
import { WxcPopover } from "weex-ui";

export default {
  components: {
    TitleBar,
    Popup,
    WxcPopover
  },
  created() {
    this.ActMsgGet();
  },
  mounted() {
    this.getSession();
    this.$refs.switchS.onChange("true");
  },
  data() {
    return {
      arrow: "./imgs/mobileTransferRegister/arrow.png",
      checkSrc: "./imgs/mobileTransferRegister/check.png",
      uncheckSrc: "./imgs/mobileTransferRegister/uncheck.png",
      mobilePhone: "",
      IDCard: "",
      radioHidd:true,
      accountNum: "",
      accountNumC: "",
      defaultAccount: true,
      vals:"true",
      defaultPiker: 0,
      aliasAccountItems: [],
      bindAccountItems: [],
      payerAcNoList:[],
      cardDeptId:"",
      IdType: "101",
      textData:[
        {top:"1、默认账户：是指您注册的手机号通过多家银行与多个账户绑定时，手机号转账系统在业务处理时优先关联的账户。"},
        {top:"2、绑定账户：目前我行仅支持状态正常的银行卡结算账户一类户和二类户，三类户暂不支持此业务。一类户可以付款和收款业务，二类户由于限额限制只支持付款业务。"}
      ],
      IDinfor: {
        "101": "身份证",
        "102": "军人证",
        "103": "武警证",
        "104": "外国护照",
        "105": "港澳居民往来内地通行证",
        "107": "台湾居民往来大陆通行证",
        "109": "临时身份证"
      },
      //第一个参
      popupData: {
        title: "绑定手机号",
        url: "ActMsgReg",
        smsUrl: "ActMsgReg",
        after: "ActMsgRegAfter",
        resultPath: "/MTRegisterResult"
      },
      orderType: [],
      paramsPopup: {},
      isTrue: false,
      btns: [
        {
          icon: "",
          text:
            "一个手机号可以绑定不同银行的银行账号。但只能绑定一个默认账户，手机号转账如果不选择收/付款银行时，收/付款账户就是默认账户。",
          key: "key"
        }
      ],
      popoverPosition: { x: 180, y: 566 },
      popoverArrowPosition: { pos: "left", x: 100 },
      textStyle: {
        width: "400px",
        height: "280px",
        fontSize: "28px",
        lineHeight: "55px"
      },
      marketId:"",
      marketName:""
    };
  },
  computed: {
    IDCardC() {
      if (!this.IDCard) {
        return "";
      } else if (this.IdType == "101") {
        return this.IDCard.substr(0, 6) + " ****** " + this.IDCard.substr(-4);
      } else {
        return this.IDCard;
      }
    }
  },
  methods: {
    // 查询营销人员姓名
    queryOperIdName() {
      const params = {
        OperId: this.marketId,
        BizType: 12,
        cardDeptId:this.cardDeptId
      };
      stream.fetch({
        method: "POST",
        url: "/refacmob/queryOperIdName.do",
        type: "json",
        timeout: 60000,//60s
        body: JSON.stringify(params),
        headers: { "Content-Type": 'application/json' }
      },
      response => {
        if(response.status==200 && response.data){
          if(response.data._RejCode == "000000") {
            this.marketName = response.data.OperName;
          }else{
            this.marketName = "";
            if(this.marketName==""&&this.marketId!=""){
              wjalert.alert("营销人员编号不存在", "确定", data => {
                this.marketId="";
                this.marketName = "";
              });
              return;
            }
          }
        } else {
          this.marketName = "";
          modal.toast({
            message: "网络通讯异常请稍后再试"
          })
          return;
        }
      });
    },
    agreement(){//查看协议
      context.launchStage("main.phoneAgreement?AcNo="+this.accountNum);
    },
    radioBtns(){
      this.radioHidd = !this.radioHidd;
    },
    getSession() {
      this.mobilePhone = context.secureGetString("Mobiel"); //手机号
      this.IdType = context.secureGetString("IdType"); //证件类型
      this.IDCard = context.secureGetString("idNumber"); //身份证号码
      this.refactorData();
    },
    refactorData() {},
    //获取注册信息
    ActMsgGet() {
      this.goJson("/refacmob/ActMsgGet.do", {}, response => {
        var res = response.data;
        if (res.State == "0") {
          wjalert.confirm(
            "您已注册手机号转账，是否进行变更?",
            "确定",
            "取消",
            data => {
              if (data == "Y") {
                context.replaceStage("main.MTChangerInput");
              } else if (data == "N") {
                context.finish();
              }
            }
          );
        } else {
          this.bankInnerTransferPre();
        }
      });
    },
    //获取账号
    bankInnerTransferPre() {
      this.bindAccountItems = [];
      this.aliasAccountItems = [];
      this.goJson("/refacmob/BankInnerTransferPre.do", {}, response => {
        this.payerAcNoList = response.data.CommonPayerAcNoList;
        for (let val of this.payerAcNoList) {
          let BankAcType = val.BankAcType;
          if (
            BankAcType == "03" ||
            BankAcType == "e" ||
            BankAcType == "s" ||
            BankAcType == "BB"
          ) {
            this.bindAccountItems.push(val.No);
            this.aliasAccountItems.push(
              this.acnoRun(val.No) + "/" + val.aliasName
            );
          }
        }
        this.accountNumC = this.aliasAccountItems[0];
        this.accountNum = this.bindAccountItems[0];
        this.cardDeptId=this.payerAcNoList[0].cardDeptId;
      });
    },
    selectAccount() {
      picker.pick(
        {
          index: this.defaultPiker,
          items: this.aliasAccountItems
        },
        event => {
          if (event.result === "success") {
            var index = event.data;
            this.accountNumC = this.aliasAccountItems[index];
            this.accountNum = this.bindAccountItems[index];
            this.cardDeptId=this.payerAcNoList[index].cardDeptId;
            this.defaultPiker = index;
          }
        }
      );
    },
    showDetail() {
      this.$refs["wxc-popover"].wxcPopoverShow();
    },
    checkDefaultAccount() {
      if(this.defaultAccount){
          this.$refs.switchS.onChange("false");
          this.defaultAccount = false;
      }else{
          this.$refs.switchS.onChange("true");
          this.defaultAccount = true;
      }
    },
    acnoRun(str) {
      return str.substr(0, 4) + " **** " + "**** " + str.substr(-4);
    },
    toConfirm() {
      this.$refs.inputMarket.blur();
      if(this.marketName==""&&this.marketId!=""){
        return;
      }
      if(!this.radioHidd){
          wjalert.alert("请详细阅读并勾选手机号支付注册协议", "确定", data => {});
      }else{
          this.goJson(
            "/refacmob/ActMsgRegConfirm.do",
            {
              AcNo: this.accountNum
            },
            response => {
              this.orderType = response.data.TypeList;
              this.orderType.map((ele, index) => {
                if (ele.value == 4) {
                  ele.text = "云盾";
                  ele.txetPlace = "请输入云盾密码";
                  ele.title = "云盾密码";
                } else if (ele.value == 2) {
                  ele.text = "令牌";
                  ele.txetPlace = "请输入动态口令";
                  ele.title = "动态口令";
                } else if (ele.value == 1) {
                  ele.text = "短信";
                  ele.txetPlace = "请输入短信验证码";
                  ele.title = "短信验证码";
                }
              });
              const paramsPopup = {
                //传给弹框的参数
                AcNo: this.accountNum,
                mobilePhone: this.mobilePhone,
                DftAccType: this.defaultAccount ? "DFLT" : "NDFT",
                _tokenName: response.data._tokenName,
                saleno:this.marketId,
                salename:this.marketName
              };
              this.paramsPopup = paramsPopup;
              this.isTrue = true;
            },
            err => {
              var errmsg = err.data.errmsg || "";
              if (err.data._RejCode == "validation.acno.opendate.error") {
                wjalert.confirm(errmsg, "确定", "退出", data => {
                  if (data == "N") {
                    context.finish();
                  } else if (data == "Y") {
                    // context.replaceStage("main.bankinnertrans");
                    // context.finish();
                  }
                });
              } else {
                wjalert.alert(errmsg, "确定", data => {});
              }
            }
          );
      }
    },
    closePopup() {
      this.isTrue = false;
    },
    next() {
      this.$router.push("/MTRegisterResult");
    }
  }
};
</script> 

<style scoped>
.text_title{
  font-size:26px;
  color:rgb(102,102,102);
  margin-left:30px;
  margin-top:40px;
}
.example_top{
  color:rgb(102,102,102);
  font-size:26px;
  line-height:40px;
  margin-top:50px;
  margin-left:30px;
}
.container {
  background-color: #ececec;
}
.border-bottom {
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
}
.space-between {
  justify-content: space-between;
}
.cellList {
  width: 750px;
  margin-top: 16px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffffff;
}
.cellItem {
  height: 96px;
  flex-direction: row;
  align-items: center;
}
.itemLeft {
  width: 182px;
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.market{
  width: 210px;
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.marketId{
  width: 460px;
  font-size: 28px;
  placeholder-color: rgb(218,218,218);
  height: 96px;
  line-height: 96px;
}
.itemRight {
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.cellLeft {
  flex-direction: row;
  align-items: center;
}
.itemRightClick {
  height: 96px;
  width: 96px;
  flex-direction: row;
  align-items: center;
}
.arrow-wrapper {
  height: 96px;
  width: 96px;
  flex-direction: row-reverse;
  align-items: center;
}
.arrow {
  width: 26px;
  height: 26px;
}
.check-img {
  width: 32px;
  height: 32px;
}
.bottom {
  margin-top: 40px;
  padding-left: 30px;
  padding-right: 30px;
}
.bottom-button {
  width: 690px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  background-color: rgb(238, 63, 35);
  border-radius: 8px;
}
.bottom-button-text {
  color: #ffffff;
  font-size: 32px;
}
.instructions_img{
  width: 30px;
  height: 30px;
  position: absolute;
  top:33px;
  right: 0px;
}
.switch_right_sms{
    width:102px;
    height:62px;
    position: absolute;
    right: 0px;
    top:  24px;
}
.black{
  color:rgb(102,102,102);
  font-size: 26px;
  line-height: 48px;
  margin-left: 20px;

}
.blue{
  color:rgb(44,151,241);
  font-size: 26px;
  line-height: 48px;
  margin-left: 20px;
}
</style>
