<template>
  <div class="list_wrapper">
    <div
      class="list_content"
      v-for="(ticket, idx) in ticketList"
      :key="idx"
      :id_IdNb="ticket.IdNb"
    >
      <div class="content_wrapper" @click="foldCoupon(ticket, idx)">
        <div class="image_wrapper">
          <image :src="smsImgUrl" class="iconImg"></image>
        </div>
        <div class="detail_box">
          <text class="account_num">{{ ticket.IdNb | bankNum }}</text>
          <text class="account_tit" v-if="showTit">{{ ticket.DraftSts }}</text>
          <div class="date-wrapper" v-if="showTit">
            <text class="due">到期日：</text>
            <text class="account_date" v-if="ticket.DueDt">{{
              ticket.DueDt | YearMonthDayFormat
            }}</text>
          </div>
        </div>
        <div class="arr_wrapper">
          <div class="arrow" v-if="showFlod">
            <text class="fold_style">{{
              ticket.foldFlag ? "收起" : "详情"
            }}</text>
            <image
              :src="ticket.foldFlag ? upImgUrl : downImgUrl"
              class="downType"
            ></image>
          </div>
        </div>
      </div>
      <div class="fold_wrapper" v-if="ticket.foldFlag">
        <div
          class="collapse_content"
          v-for="(fold, index) in ticket.foldList"
          :key="index"
        >
          <text class="collapse_name">{{ fold.name1 }}</text>
          <text class="collapse_data">{{ fold.text1 }}</text>
        </div>
        <div class="collapse_content" v-if="showLV">
          <text class="collapse_name">贴现利率(%)</text>
          <input
            v-if="ticket.statusStr == '01' || ticket.statusStr == '02' || ticket.statusStr == '04'"
            ref="interateStr"
            type="number"
            v-model="ticket.interate"
            maxlength="7"
            @input="inputFun(idx,ticket.interate)"
            placeholder="输入利率"
            class="edit_input_line"
            :class="{ red: Number(ticket.interate) !== Number(oldList[idx]) }"
            :style="[
              {
                color:
                  Number(ticket.interate) == Number(oldList[idx])
                    ? 'rgb(124, 124, 124)'
                    : 'rgba(230, 2, 44, 1)'
              }
            ]"
          />
            
          <text  ref="interateStr" class="collapse_name" v-if="!(ticket.statusStr == '01' || ticket.statusStr == '02' || ticket.statusStr == '04')">{{ticket.interate}}</text>
        </div>
        <div class="collapse_content" v-if="showLV">
          <text class="collapse_name_finish">条件检测结果:</text>
          <text
          v-if="!(ticket.statusStr == '02' || ticket.statusStr == '04') && !ticket.upFlag"
            class="collapse_data_finish"
            :style="[
              {
                color:
                  ticket.statusStr == '02' || ticket.statusStr == '04'
                    ? 'rgb(95, 156, 212)'
                    : 'rgba(156, 156, 156, 1)'
              },
              {
                'text-decoration':
                  ticket.statusStr == '02' || ticket.statusStr == '04'
                    ? 'underline'
                    : 'unset'
              }
            ]"
            > {{ ticket.statusStrText}}</text>
             <text
            v-if="(ticket.statusStr == '02' || ticket.statusStr == '04') && !ticket.upFlag"
            class="collapse_data_finish"
            :style="[
              {
                color:
                  ticket.statusStr == '02' || ticket.statusStr == '04'
                    ? 'rgb(95, 156, 212)'
                    : 'rgba(156, 156, 156, 1)'
              },
              {
                'text-decoration':
                  ticket.statusStr == '02' || ticket.statusStr == '04'
                    ? 'underline'
                    : 'unset'
              }
            ]"
            @click="upload(ticket, idx)"
            >{{ ticket.statusStrText}}</text>
            <text class="collapse_data" v-if="ticket.upFlag" >{{ticket.statusStrText}}</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.edit_input_line {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgb(124, 124, 124);
  height: 40px;
  line-height: 20px;
  width: 200px;
  border-width: 1px;
  border-style: solid;
  border-color: #eee;
  padding-left: 10px;
}
.red {
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(230, 2, 44, 1);
  height: 40px;
  line-height: 20px;
  width: 200px;
  border-width: 1px;
  border-style: solid;
  border-color: #eee;
  padding-left: 10px;
}
.collapse_content {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
}
.collapse_name {
  height: 26px;
  line-height: 26px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.collapse_name_finish{
  height:32px;
  line-height: 32px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.collapse_data {
  height: 26px;
  line-height: 26px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.collapse_data_finish{
  flex: 1;
  line-height: 32px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgb(95, 156, 212);
  text-decoration: underline;
  word-wrap: break-word;
  word-break: normal;
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
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
}
.account_num {
  margin-bottom: unset;
  color: #333333;
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
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云盾
const loading = weex.requireModule("wxEncryption");
const wjalert = weex.requireModule("weex-alert");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  props: {
    ticketList: {
      type: Array
    },
    oldList: {
      // 存储老数组，进行和新数组比较，爆红
      type: Array
    },
    showTit: {
      // 是否显示到期日和签收
      type: true
    },
    showFlod: {
      // 是否显示展开收起
      default: true
    },
    showLV: {
      // 是否显示利率
      default: false
    }
  },
  data() {
    return {
      smsImgUrl: this.$store.state.imgBaseUrl + "/Internetpaymentlock@2x.png",
      downImgUrl: this.$store.state.imgBaseUrl + "/drop-down@2x.png",
      upImgUrl: this.$store.state.imgBaseUrl + "/drop-up@2x.png",
      stringRegex: "^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,2}(([.]\\d{0,4})?)))?$",
      oldDiscountCheck: this.$store.state.DiscountApplyCheck // 上个接口返回的所有数据，
    };
  },
  created() {},
  computed: {},
  methods: {
    upload(msg, idx) {
      this.$store.state.imgIdNb = msg; //点击时的当前数据
      this.$store.state.imgIndex = idx; // 点击时的index
      this.$emit("jumpImage");
    },
    foldCoupon(ticket, index) {
      // 展开收起
      ticket.foldFlag = !ticket.foldFlag;
    },
    inputFun(index, val) {
      this.$emit("inputChange", index, val);
    }
  }
};
</script>
