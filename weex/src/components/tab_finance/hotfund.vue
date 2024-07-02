<template>
  <div class="container">
    <div class="banker-center">
      <text class="banker-center-left">基金投资</text>
      <text class="banker-center-right" @click="gotoStage('main.fund')">全部</text>
    </div>
    <div class="banker-middle-box" v-for="(item,key) in fundList" :key="key" @click="JumpTo(item)">
      <div class="banker-middle">
        <div class="banker-middle-text">
          <div class="banker-middle-left">
            <div class="per_box">
              <text class="loanamount">{{item.rate}}</text>
              <text class="small_text">%</text>
            </div>
            <text class="loanndes">近{{item.year}}个月最高</text>
          </div>
          <div class="banker-middle-right">
            <div class="per_box">
              <text class="loantype">{{item.type}}</text>
              <!-- <image v-if="item.ishot=='yes'" class="img" :src="hotimg"></image> -->
            </div>
            <text class="immediatelyMoney">{{item.name}}</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 750px;
  background-color: #ffffff;
  margin-top: 16px;
}
.banker-center {
  height: 116px;
  flex-direction: row;
  padding-left: 26px;
  padding-right: 26px;
  justify-content: space-between;
  align-items: center;
}
.banker-center-left {
  font-size: 38px;
  font-weight: 600;
  color: #222222;
}
.banker-center-right {
  font-size: 25px;
  color: #888a97;
}
.banker-middle-box {
  padding-left: 26px;
  padding-right: 26px;
}
.banker-middle {
  border-top-color: #dddddd;
  border-top-width: 1px;
}
.banker-middle-text {
  height: 176px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.banker-middle-left {
  height: 176px;
  padding-left: 17px;
  flex-direction: column;
  justify-content: center;
}
.banker-middle-right {
  height: 176px;
  padding-right: 19px;
  flex-direction: column;
  justify-content: center;
}
.loanname {
  font-size: 30px;
  color: #313131;
}
.loanamount {
  font-size: 52px;
  color: #d00113;
  font-weight: bold;
  padding-bottom: 11px;
}
.loanndes {
  font-size: 25px;
  color: #999999;
  font-weight: 200;
  padding-top: 11px;
}
.loantype {
  font-size: 30px;
  font-weight: bold;
  color: #222222;
}
.immediatelyMoney {
  margin-top: 19px;
  font-size: 26px;
  color: #777777;
  width: 361px;
}

.per_box {
  flex-direction: row;
  align-items: center;
}
.small_text {
  font-size: 30px;
  color: #d00113;
  margin-top: 16 px;
}
.img {
  width: 108px;
  height: 32px;
  margin-left: 27px;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
export default {
  props: ["jsonurl"],
  data() {
    return {
      fundList: [],
      hotimg: "./imgs/tab_finance/hot/hot.png"
    };
  },
  mounted() {
    // this.getFinance();
  },
  methods: {
    JumpTo(item) {
      context.sessionSetString("fundProduct", JSON.stringify(item));
      this.gotoStage("main.fundInfo", true);
    },
    getFunds() {
      stream.fetch(
        {
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            this.fundList = response.data.data;
            this.getFinance();
          }
        }
      );
    },
    getFinance() {
      var params = {
        PrdAttr: "1,3,4",
        RiskLevel: "5,3,1"
      };
      this.goJson("/refacmob/FundProdListQryV2.do", params, res => {
        this.rebuildData(res.data.List);
      });
    },
    rebuildData(resList) {
      let tmpArr = resList.map(val => {
        val.rate = val.NAV.toString().substring(0, 4);
        val.type = val.RiskName + " " + val.PrdAttrName.substring(0, 3);
        val.name = val.PrdName;
        val.year = "6";
        val.ishot = "no";
        if (val.RiskLevel == "5") {
          val.year = "3";
        }
        if (val.RiskLevel == "1") {
          val.ishot = "yes";
        }
        return val;
      });
      this.fundList = tmpArr;
    }
  }
};
</script>
