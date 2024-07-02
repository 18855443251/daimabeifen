<template>
  <div class="home">
      <NavBar :title="title"></NavBar>
      <list class="list_info">
        <cell>
          <div class="allcontents" v-for="(item,index) in checkResultInfo" :key="index">
            <div class="details">
              <text class="details_type">{{item.TransName}}</text>
              <text class="details_amt" v-if="item.Amount">¥{{money(item.Amount)}}</text>
            </div>
            <div class="details">
              <text class="details_trstime">{{item.TransTime}}</text>
              <div v-if="item._TrsStatus=='0'">
                  <text class="details_status" v-if="!item._RejCode||item._RejCode=='000000'">交易成功</text>
                  <text class="details_status" v-else>交易失败</text>
              </div>
              <text class="details_status" v-else>审核拒绝</text>
            </div>
          </div>
          <div class="p"></div>
        </cell>
      </list>
  </div>
</template>
<style scoped>
.p {
  height: 120px;
  width: 750px;
}
.list_info {
  width: 750px;
  /* position: fixed;
  top: 190px; */
  /* height: 750px; */
}
.allcontents {
  width: 690px;
  height: 150px;
  margin-top: 20px;
  margin-left: 30px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style: solid;
  border-radius: 12px;
  flex-direction: column;
  align-items: center;
}
.details {
  margin-left: 24px;
  flex-direction: row;
  justify-content: space-between;
  width: 642px;
  height: 75px;
  align-items: center;
}

.details_trstime {
  font-size: 24px;
  color: #aaaaaa;
  line-height: 75px;
  margin-bottom: 20px;
}
.details_status {
  font-size: 28px;
  color: #7c7c7c;
  line-height: 75px;
  margin-bottom: 20px;
}
.details_type {
  font-size: 30px;
  color: #333333;
  line-height: 75px;
  margin-top: 30px;
}
.details_amt {
  font-size: 32px;
  color: #333333;
  line-height: 75px;
  margin-top: 30px;
}
.home {
  width: 750px;
}
</style>
<script>
import NavBar from "@/components/templet/titlebar";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: {
    NavBar
  },
  data() {
    return {
      title: "审核结果",
      checkResultInfo:'',
      checkResultInfo: [
        // {TransName:"转账汇款",Amount:'1565256',TransTime:'15:52:45',_JnlStatus:'2'},
      ],
    };
  },
  created() {
    this.checkResultInfo=this.$route.query.checkResultInfo;
  },
  mounted() {},
  methods: {
    
  }
};
</script>



