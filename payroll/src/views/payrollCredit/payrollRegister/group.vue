<template>
  <div>
    <div class="add_bg">
      <div class="add" @click="newGroup">
        <div class="add_box">
          <image :src="jiaImg" class="arrow_img1" />
          <text class="add_title">新建分组</text>
        </div>
        <image :src="arrowImg" class="arrow_img" />
      </div>
    </div>
    <list class="info" :style="{ top: this.getPosiScrollerTop()+338+'px' }">
      <cell
        v-for="(item, index) in $store.state.group"
        :key="index"
        class="item"
      >
        <div class="info_item">
          <text class="info_title"
            >{{ item.GroupName }}&nbsp;&nbsp;&nbsp;({{
              item.FZQrySize
            }}人)</text
          >
          <div @click="select(index)">
            <image
              :src="selectImg"
              class="start_img"
              v-if="item.select == true"
            />
            <image
              :src="noSelectImg"
              class="start_img"
              v-if="item.select == false"
            />
          </div>
        </div>
        <div class="detail_item" @click="groupDetail1(item)">
          <div
            class="detail_item_box_left"
            v-for="(sub, index2) in item.FZQry"
            :key="index2"
          >
            <div class="logo" v-if="index2 <= 3">
              <image :src="logoImg" class="logo_img" />
              <text class="text_state">{{ ellipsis(sub.AcName, 4) }}</text>
            </div>
          </div>
          <div class="detail_item_box_right">
            <image :src="arrowImg1" class="arrow_img" />
          </div>
        </div>
        <div class="text_gray"></div>
      </cell>
    </list>
    <div class="next">
      <text class="next_btn" @click="comfirm">立即代发</text>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import { WxcPopup } from "weex-ui";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar, WxcPopup },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      logoImg: this.$store.state.imgBaseUrl + "24.png",
      jiaImg: this.$store.state.imgBaseUrl + "17.png",
      arrowImg: this.$store.state.imgBaseUrl + "27.png",
      arrowImg1: this.$store.state.imgBaseUrl + "25.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      curIndex: "-1",
    };
  },
  created() {
    this.$store.state.newGroup=[];
    this.$store.state.isshowAdd=true;
    this.$store.state.newGroupName="";
    this.getGroupInfo();
  },
  methods: {
    getGroupInfo() {
      this.post(
        "/eweb/DFActAccessQry.do",
        { LikeName: ""},
        response => {
          this.$store.state.group = response.data.FZQryList;
          for (let i in this.$store.state.group) {
            this.$set(this.$store.state.group[i], "select", false);
          }
        }
      );
    },
    // 选择复选框
    select(index) {
      this.$store.state.group[index].select = !this.$store.state.group[index]
        .select;
      for (let i in this.$store.state.group) {
        if (i != index) {
          this.$store.state.group[i].select = false;
        }
      }
      this.$store.state.group.splice(index, 1, this.$store.state.group[index]);
      if( this.$store.state.group[index].select==false){
       this.curIndex='-1'
      }else{
         this.curIndex = index;
      }
    },
    // 带回代发录入页
    comfirm() {
      // 复选框选中的时候
       if(this.$store.state.group.length==0){
        return;
       }else if (this.curIndex=='-1') {
       wjalert.alert("请至少选择一个分组", "确定", data => {});
      } else {
        this.jump("/payrollEntry");
      }
      if (this.$store.state.group[this.curIndex].select == true) {
        for (let i in this.$store.state.group[this.curIndex].FZQry) {
          var obj = {
            PayeeAcName: this.$store.state.group[this.curIndex].FZQry[i].AcName,
            PayeeAcNo: this.$store.state.group[this.curIndex].FZQry[i].AcNo,
            Amount:"",
            Remark:"",
            select: true,
            hideShow: "1",
            errorMsg: "金额不能为空",
            flag:"2"
          };
         this.$store.state.payrollEntry.push(obj);
        }
      }
      
    },
    // 跳转到新建分组页
    newGroup() {
      this.$store.state.newGroup = [];
      this.jump("/newGroup");
    },
    // 带到分组详情页
    groupDetail1(item) {
      var arr1 = [];
      for (let i in item.FZQry) {
        var obj1 = {
          AcName: item.FZQry[i].AcName,
          AcNo: item.FZQry[i].AcNo,
          Amount: "",
          Remark: "添加备注",
          select: false,
        };
        arr1.push(obj1);
        // 分组ID
        this.$store.state.GroupId = item.FZQry[i].GroupId;
      }
      this.$store.state.groupDetail1 = arr1;
      // 分组名字
      this.$store.state.GGroupName = item.GroupName;
       this.$store.state.oldGGroupName = item.GroupName;
      this.jump("/groupDetail1");
    }
  }
};
</script>
<style scoped>
.add_bg{
    background-color: rgba(250, 250, 250, 1);
}
.add {
  height: 88px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: rgba(234, 234, 234, 1);
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 24px;
  margin-left: 30px;
  margin-right: 30px;
  background-color: rgba(255, 255, 255, 1);
}
.add_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.arrow_img {
  margin-right: 20px;
  width: 14px;
  height: 24px;
}
.arrow_img1 {
  margin-right: 20px;
  width: 26px;
  height: 26px;
}
.info {
   position: fixed;
  /* top:426px; */
  bottom:88px;
  left: 0;
  right:0;
  background-color: rgba(250, 250, 250, 1);
}
.item {
  background-color: rgba(255, 255, 255, 1);
  height: 256px;
}
.info_item {
  height: 96px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.detail_item {
  height: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-color: gray;
  padding-left: 50px;
  position: relative;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.start_img {
  width: 30px;
  height: 30px;
}
.info_title {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.detail_item_box_left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.detail_item_box_right {
  position: absolute;
  top: 50px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 130px;
  height: 140px;
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.logo_img {
  width: 64px;
  height: 64px;
}
.text_state {
  width: 130px;
  height: 26px;
  font-size: 26px;
  text-align: center;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(85, 85, 85, 1);
  line-height: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 20px;
}

.next {
  position: fixed;
  bottom:0;
  left: 0;
  right:0;
  height: 88px;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
}
.next_btn {
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.add_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
</style>
