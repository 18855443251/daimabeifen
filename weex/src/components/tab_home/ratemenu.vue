<template>
  <div class="main">
    <div class="container" v-for="(item,key) in rateList" :key="key" @click="RateClick(item)">
      <image class="bgStyle" :src="item.src"></image>
      <div class="my-text">
        <text class="ratetitle">{{item.name}}</text>
        <div class="ratediv">
          <text class="destext">{{item.des}}</text>
          <text class="ratetext" :style="{color:item.color}">{{item.rate}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 750px;
  flex-direction: row;
  /* padding-top: 27px; */
  padding-bottom: 16px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: rgb(239, 239, 244);
  justify-content: space-between;
}
.container {
  width: 332px;
  height: 215px;
  position: relative;
}
.bgStyle {
  width: 334px;
  height: 217px;
  position: absolute;
}
.my-text {
  margin-left: 31px;
}
.ratetitle {
  font-size: 32px;
  color: #222222;
  margin-top: 35px;
}
.ratediv {
  flex-direction: row;
  margin-top: 17px;
}
.destext {
  font-size: 26px;
  color: #7d7d7d;
}
.ratetext {
  font-size: 26px;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule('modal');
export default {
  props: ["jsonurl"],
  data() {
    return {
      rateList: []
    };
  },
  created() {
    this.getRateList();
  },
  methods: {
    RateClick(item) {
      this.gotoStage(item.url);
    },
    getRateList(){
      stream.fetch({
          method: 'POST',
          url: '/eweb/ewjrcb.ExRateQry.do',
          type:'json',
          body: {Date:"2019-03-27"},
          headers:{ "Content-Type":'application/json',
                "Accept":'text/mobjson'}
      },response => {
        this.rateList=response.data.List;
    }); 
    },
    getJsonData() {
      stream.fetch(
        {
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        res => {
          this.rateList = res.data.data;
        }
      );
    },
    getFinancialProduct() {
      let UserId = context.secureGetString("idNumber") || "";
      // this.goJson("/refacmob/InvestProListQry.do", { UserId }, res => {
      //   let MaxModelComment = res.data.MaxModelComment;
      //   if (MaxModelComment) {
      //     this.rateList[0].rate = MaxModelComment;
      //     this.$set(this.rateList);
      //   }
      // });
    }
  },
  watch: {
    // "$store.state.mobiel"() {
    //   // this.getFinancialProduct();
    // }
  }
};
</script>
