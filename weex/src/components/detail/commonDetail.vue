<template>
  <div class="list_wrapper">
    <div class="list_content" v-for="(ticket,idx) in ticketList" :key="idx" :id_IdNb="ticket.IdNb">
      <div class="content_wrapper">
        <div class="image_wrapper">
          <image :src="smsImgUrl" class="iconImg"></image>
        </div>
      <div class="detail_box">
        <text class="account_num">{{ticket.IdNb}}</text>
        <text class="account_tit" v-if="showTit">{{ticket.DraftStsNm}}</text>
        <div class="date-wrapper"  v-if="showTit">
            <text class="due">到期日：</text>
            <!-- <text class="due" v-if="ticket.DueDt && detailHide">到期日：</text> -->
            <text class="account_date" v-if="ticket.DueDt">{{ticket.DueDt}}</text>
          </div>
      </div>
      <div class="arr_wrapper">
        <!-- <text class="amount" >¥{{ticket.Amount | fomatMoney}}</text> -->
        <div class="arrow" v-if="showFlod"  @click="foldCoupon(ticket,idx)">
          <text class="fold_style">{{ticket.foldFlag ? '收起' :'详情'}}</text>
          <image :src="ticket.foldFlag ? upImgUrl : downImgUrl" class="downType"></image>
        </div>  
      </div>
      </div>
      <div class="fold_wrapper"   v-if="ticket.foldFlag" >
        <div class="collapse_content" v-for="(fold,index) in ticket.foldList" :key="index">
          <text class="collapse_name" >{{fold.name1}}</text>  
          <text class="collapse_data" >{{fold.text1}}</text>  
        </div> 
      </div>
    </div>
  </div> 
</template>
<style scoped>
.collapse_content {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
}
.collapse_name {
  /* height: 26px; */
  line-height: 26px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.collapse_data {
  /* height: 26px; */
  line-height: 26px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
  width: 480px;
  text-align: right;
}
.downType {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}
.list_wrapper {
  /* padding-top: 30px; */
}
.image_wrapper {
  justify-content: space-between;
  margin-right: 16px;
}
.list_content {
  width: 690px;
  padding-right: 22px;
  padding-left: 22px;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(245, 245, 245);
  border-radius: 12px;
  margin-top: 0px;
  margin-bottom: 30px;
}
.content_wrapper {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 98px;
}
.detail_box {
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}
.fold_wrapper {
  padding-top: 30px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgb(234, 234, 234);
}
.fold_style {
  margin-right: 4px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
}
.account_num {
  margin-bottom: unset;
}
.typeImg.weex-el.weex-image {
  margin-top: 0px;
  margin-right: 14px;
  margin-bottom: 0px;
  margin-left: 0px;
  align-self: flex-start;
}

.arrow {
  flex-direction: row;
}
.iconImg {
  width: 64px;
  height: 64px;
}
</style>
<script>
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
export default {
  props: {
    ticketList: {
      type: Array
    },
    showTit: {
      // 是否显示到期日和签收
      type: true
    },
    showFlod: {
      // 是否显示展开收起
      default: true
    }
  },
  data() {
    return {
      smsImgUrl: this.$store.state.imgBaseUrl + "/Internetpaymentlock@2x.png",
      downImgUrl: this.$store.state.imgBaseUrl + "/drop-down@2x.png",
      upImgUrl: this.$store.state.imgBaseUrl + "/drop-up@2x.png"
    };
  },
  created() {},
  computed: {},
  methods: {
    // poll(ticket) {
    //   // 点击单条数据事件
    //   this.$emit("singleData", ticket);
    // },
    foldCoupon(ticket, index) {
      // 展开收起
      ticket.foldFlag = !ticket.foldFlag;
    }
  },
};
</script>