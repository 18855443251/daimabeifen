<template>
  <div>
    <nav-bar :title="title"></nav-bar>
    <scroller class="wrap">
      <div class="content">
        <div
          class="content_detail"
          v-for="(item, index) in aciList"
          :key="index"
          @click="chooseAccout(item)"
        >
          <div class="AcInfo">
            <text class="AcName">{{ellipsis(item.name,14)}}</text>
            <text class="AcName margin24"  v-if="$store.state.accountProtect">{{ AccountNoFormat(item.id,6,-4)}}</text>
             <text class="AcName margin24" v-else>{{AccountNoFormat(item.id)}}</text>
          </div>
          <div class="AcInfo1">
              <text class="AcType">{{ellipsis($store.state.BankAcTypeNameList[item.bankAcType],4)}}</text>
            <text class="Currency margin17">{{ banknotes(item.currency.id) }}</text>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
export default {
  components: { NavBar },
  data() {
    return {
      title: "选择账户",
      // 选择账户列表
      aciList: [],
      // 选择账薄列表
      acbList: [],
    };
  },
  created() {
    this.queryAccountInfo() ;
  },
  methods: {
     queryAccountInfo() {
      this.post(
        "/eweb/MobileTransferAcNoQry.do",
        {
         
        },
        response => {
          // 选择账户列表
          this.aciList= response.data.List;
        }
      );
    },
    chooseAccout(item) {
      // 代发录入页付款方账号
      this.$store.state.AcNo1 = item.id;
      this.$store.state.AcName1 = item.name;
      // 代发录入页可用余额
      this.$store.state.AvailBal=item.AvailBal;
      // 跳转到代发录入页
      this.jump("/selectpaymentAccount");
    },
  }
};
</script>
<style scoped>
.wrap {
  background-color: rgba(250, 250, 250, 1);
}
.content{
  padding-left:30px;
  padding-right: 30px;
}
.content_detail {
  height: 142px;
  background-color: rgba(255, 255, 255, 1);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(245, 245, 245, 1);
  border-radius: 12px;
  margin-top: 30px;
  padding-left: 24px;
  padding-right: 24px;
  flex-direction: row;
}
.AcInfo {
  width: 500px;
  justify-content: center;
}
.AcInfo1 {
  width: 190px;
  align-items: center;
  justify-content: center;
}
.Currency {
  font-size: 26px;
  color: rgba(124, 124, 124, 1);
}
.AcType {
  width: 116px;
  height: 42px;
  background-color: rgba(74, 137, 252, 1);
  border-radius: 6px;
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 42px;
}
.AcName {
  font-size: 30px;
  color: rgba(51, 51, 51, 1);
}
.margin24 {
  margin-top: 24px;
}
.margin17 {
  margin-top: 17px;
}
</style>
