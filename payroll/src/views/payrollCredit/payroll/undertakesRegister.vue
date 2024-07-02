<template>
  <div>
     <div class="text_gray"></div>
    <list class="info" :style="{ top: this.getPosiScrollerTop()+250 +'px' }">
      <cell v-for="(item,index) in $store.state.undertakesRegister" :key="index" class="item">
        <div class="info_item">
          <text class="info_title">{{item.GroupName}}&nbsp;&nbsp;&nbsp;({{item.FZQrySize}}人)</text>
          <div @click="select(index)">
            <image :src="selectImg" class="start_img" v-if="item.select==true" />
            <image :src="noSelectImg" class="start_img" v-if="item.select==false" />
          </div>
        </div>
        <div class="detail_item" @click="groupsDetail(item)">
          <div class="detail_item_box_left" v-for="(sub,index2) in item.FZQry" :key="index2">
            <div class="logo" v-if="index2<=3">
              <image :src="logoImg" class="logo_img" />
              <text class="text_state">{{ellipsis(sub.AcName,4)}}</text>
            </div>
          </div>
          <div class="detail_item_box_right">
            <image :src="arrowImg1" class="arrow_img1" />
          </div>
        </div>
         <div class="text_gray"></div>
      </cell>
    </list>
    <div class="next">
      <text class="next_btn" @click="confirm">确认</text>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
import { WxcPopup } from "weex-ui";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar, WxcPopup },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      logoImg: this.$store.state.imgBaseUrl + "24.png",
      jiaImg: this.$store.state.imgBaseUrl + "17.png",
      arrowImg: this.$store.state.imgBaseUrl + "5.png",
      arrowImg1: this.$store.state.imgBaseUrl + "25.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      // 选择当前项的索引
      curIndex: "-1"
    };
  },
  created() {
    this.getGroupInfo();
  },
  methods: {
     getGroupInfo() {
      //输入户名和账号查询代发分组
      this.post(
        "/eweb/DFActAccessQry.do",
        { LikeName:""},
        response => {
          // 分组列表
          this.$store.state.undertakesRegister = response.data.FZQryList;
          for (let i in this.$store.state.undertakesRegister) {
            // 给数组添加select字段
             this.$set(this.$store.state.undertakesRegister[i], "select", false);
          }
        }
      );
    },
    // 选择复选框
    select(index) {
      this.$store.state.undertakesRegister[index].select = !this.$store.state
        .undertakesRegister[index].select;
         for(let i in this.$store.state.undertakesRegister){
          if(i!=index){
            this.$store.state.undertakesRegister[i].select=false;
          }
        }
      this.$store.state.undertakesRegister.splice(
        index,
        1,
        this.$store.state.undertakesRegister[index]
      );
      if( this.$store.state.undertakesRegister[index].select==false){
       this.curIndex='-1'
      }else{
         this.curIndex = index;
      }
    },
    // 带回代发录入页
    confirm() {
       if(this.$store.state.undertakesRegister.length==0){
        return;
      }else if (this.curIndex=='-1') {
       wjalert.alert("请至少选择一个分组", "确定", data => {});
      } else {
        this.jump("/payrollEntry");
      }
      if (this.$store.state.undertakesRegister[this.curIndex].select == true) {
        for (let i in this.$store.state.undertakesRegister[this.curIndex]
          .FZQry) {
          var obj = {
            PayeeAcName: this.$store.state.undertakesRegister[this.curIndex]
              .FZQry[i].AcName,
            PayeeAcNo: this.$store.state.undertakesRegister[this.curIndex]
              .FZQry[i].AcNo,
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
       // 带到分组详情页
    groupsDetail(item) {
      var arr1 = [];
      for (let i in item.FZQry) {
        var obj1 = {
          AcName: item.FZQry[i].AcName,
          AcNo: item.FZQry[i].AcNo,
          Remark: "添加备注",
          Amount: "",
          select: false
        };
        arr1.push(obj1);
      }
      // 分组详情列表
      this.$store.state.groupsDetail = arr1;
      // 分组名字
      this.$store.state.UGroupName = item.GroupName;
      this.jump("/groupsDetail");
    }
  }
};
</script>
<style scoped>
.info{
   position: fixed;
  bottom:88px;
  left:0;
  right:0;
   background-color: rgba(250, 250, 250, 1);
}
.item {
  height: 256px;
 background-color: rgba(255, 255, 255, 1);
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
.arrow_img1 {
  width: 14px;
  height: 24px;
}
.detail_item_box_left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.detail_item_box_right {
  position: absolute;
  top:50px;
  right: 37px;
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
  height: 88px;
   position: fixed;
  bottom:0px;
  left:0;
  right:0;
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
</style>


