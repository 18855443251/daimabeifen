<template>
  <div>
    <nav-bar title="选择账户"></nav-bar>
    <scroller class="scroller" :style="getPosiScrollerTop">
      <div v-for="(item,index) in filterListFun" :key="index" class="listItem" @click="selectAcct(item)">
          <div class="listTop">
              <text class="txtLeft">{{ellipsis(item.AcName,14)}}</text>
              <text class="txt2">{{ellipsis($store.state.BankAcTypeNameList[item.BankAcType],4)}}</text>
          </div>
          <div class="listBot">
              <text class="txtLeft1" v-if="!$store.state.accountProtect">{{item.AcNo|AccountNoFormat}}</text>
              <text class="txtLeft1" v-else>{{item.AcNo|AccountNoFormat(6,-4)}}</text>
              <text class="txt3">{{item.Currency | currency}}</text>
          </div>
      </div>
    </scroller>
  </div>
</template>
<script>
  import NavBar from "../../components/titlebar_component.vue";
  const context = weex.requireModule("context");
  const modal = weex.requireModule("modal");
  export default {
    components: { NavBar, },
    data() {
      return {
        
      };
    },
    created() {
      this.TransferPre();
      context.sessionSetString('TransferPreFlag','0');//这个标识回到填写付款方页面时不再查询TransferPre.do交易
    },
    computed: {
        //过滤掉非人民币及不能转账的账户
        filterListFun(){
          var supportType=['01','02','03','08'];
          return this.$store.state.transferPayerAcctList.filter(item=>{
              return item.Currency=='CNY'&&supportType.includes(item.BankAcType);
          });
        }
    },
    mounted() {},
    methods: {
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
                        // this.$store.state.transferSubmitData.PayerAcNo = this.$store.state.transferPayerAcctList[0].AcNo;
                        // this.$store.state.transferSubmitData.PayerAcName = this.$store.state.transferPayerAcctList[0].AcName;
                        // this.$store.state.transferSubmitData.PayerCurrency=this.$store.state.transferPayerAcctList[0].Currency;
                    }else{
                        wjalert.alert("暂无可操作账户","确定",data=>{});
                    }
                    // this.$store.state.transferSubmitData.PayerOpenFlag = response.data.AcNoList[0].OpenFlag;//多级账簿开通标志
                    // this.$store.state.transferSubmitData.AcSeq = response.data.AcNoList[0].AcSeq;//账户序号
                    
                    // this.Holiday4Tomorrow = (response.data.Holiday4Tomorrow == 0 ? true : false);
                    // this.NormalTranfer4Today = (response.data.NormalTranfer4Today == 0 ? true : false);
                });
            },
      selectAcct(item) {
          this.$store.state.transferSubmitData.PayerAcNo = item.AcNo;
          this.$store.state.transferSubmitData.PayerAcName = item.AcName;
          this.$store.state.transferSubmitData.PayerCurrency = item.Currency;
          this.getAcctBookQryAlone();
            // this.$store.state.transferSubmitData.PayerOpenFlag = item.OpenFlag;//多级账簿开通标志
            // this.$store.state.transferSubmitData.AcSeq = item.AcSeq;//账户序号
          
          this.$store.state.transferSubmitData.isCheckBankInner='disable';
      },
      getAcctBookQryAlone() {
          var params={
              PayerAcNo:this.$store.state.transferSubmitData.PayerAcNo,
          }
          this.post("/eweb/TransferAcctBookQry.do",params, response => {
              if(response.data.List&&response.data.List.length!=0){
                  // this.$store.state.transferSubmitData.transferPayerAcctBookList=response.data.List;
                  this.$store.state.transferSubmitData.PayerOpenFlag='Y';
              }else{
                  // this.$store.state.transferSubmitData.transferPayerAcctBookList=[];
                  this.$store.state.transferSubmitData.PayerOpenFlag='';
              }
              if (this.$store.state.transferSubmitData.PayerOpenFlag == 'Y') {//开通了现金管理的选完后 跳转到账簿选择页面
                  this.jump('/ChooseAcctBook');
              } else {//否则跳转到原页面
                  this.goBack();
              }
          });
      },
    }
  };
</script>
<style scoped>
  .scroller{
    position: fixed;
    bottom: 0;
    width: 750px;
    background-color:rgba(250,250,250,1);
  }
  .listItem {
      width: 690px;
      margin: 30px 30px 0 30px;
      padding: 20px;
      justify-content: space-around;
      border-color: rgba(245,245,245,1);
      background-color: #fff;
      border-width: 1px;
      border-radius:12px;
  }

  .listTop {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .listBot {
    flex-direction: row;
    justify-content: space-between;
  }
  .txtLeft {
    width: 450px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .txtLeft1 {
    width: 450px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .txt2 {
    width: 140px;
    text-align: center;
    background-color:rgba(74,137,252,1);
    border-radius:6px;
    padding: 10px;
    font-size:24px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
  .txt3 {
    width: 140px;
    text-align: center;
    font-size:26px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
  }
</style>