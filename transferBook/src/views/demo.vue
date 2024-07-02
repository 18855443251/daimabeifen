<template>
  <div>
    <nav-bar :title="title"></nav-bar>
    <!-- <nav-bar title="新建分组"></nav-bar> -->
    <div class="newGroup">
      <div class="section">
        <text class="boldtext">分组名称</text>
        <input
          type="text"
          v-model="newGroupName"
          placeholder="请输入分组名称"
          class="input1"
          maxlength="10"
            @focus="onFocus"
            @blur="onBlur"
        />
      </div>
      <div class="section">
        <text class="boldtext">分组名称</text>
        <input type="text"  class="input1" @focus="onFocus1">
      </div>
      
      <div>
        <div class="section" @click="addMembers2">
          <text class="boldtext">组内成员({{newGroupNumber}}人)</text>
          <text class="group_btn">添加组员</text>
        </div>
        <list
          class="info"
          :style="{ top: this.getPosiScrollerTop() + 340 + 'px' }"
        >
          <cell
            v-for="(item, index) in $store.state.newGroup"
            :key="index"
            class="info_item"
            @click="deleteGroupMember(item)"
          >
            <div class="info_item_left">
              <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
              <image v-else :src="newBankImg" class="bank_img" />
            </div>
            <div class="info_item_right">
              <div class="info_item_box_text">
                <text>{{ item.Acname }}</text>
                <!-- <text class="text_acno">{{ "divieBanks(item.AcNo)" }}</text> -->
              </div>
              <div>
                <image :src="deleteImg" class="delete_img" />
              </div>
            </div>
          </cell>
        </list>
      </div>
      <div class="section_bottom">
        <div  :class="[isShow==true?'save':'gray']" @click="save">
          <text class="next_btn">保存</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../components/NavBar.vue"
// import NavBar from "../../../components/titlebar_component.vue";
// import deletegroup from "../../../components/deleteGroup.vue";
// import deleteNewGroupMeber from "../../../components/deleteNewGroupMeber.vue";
import { WxcMask } from "weex-ui";
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: {  NavBar,WxcMask},
  data() {
    return {
      deleteImg: this.$store.state.imgBaseUrl + "21.png",
      BankId: "9999",
      addImg: this.$store.state.imgBaseUrl + "17.png",
      newGroupName:this.$store.state.newGroupName,
      isShow:true,
      inputFlag:0
    };
  },
  created() {
     // "central_url":"http://10.1.33.190:9088/preview/central.dat",
    // var newArr1 = [];
    // var newObj1 = {};
    // for (var i = 0; i < this.$store.state.newGroup.length; i++) {
    //   if (!newObj1[this.$store.state.newGroup[i].AcNo]) {
    //     newArr1.push(this.$store.state.newGroup[i]);
    //     newObj1[this.$store.state.newGroup[i].AcNo] = true;
    //   }
    // }
    // this.$store.state.newGroup = newArr1;
  },
  computed: {
    newGroupNumber() {
      var sum = 0;
      sum = "1";
      return sum;
    },
  },
  methods: {
     changeGroupName(event){
       this.newGroupName = event.value;
    },
     onFocus(){
      // if (weex.config.env.platform != 'iOS') {
      //   if(this.inputFlag == 0||this.inputFlag==1){
      //   this.inputFlag++; 
      //  return;
      // }
      // }
      modal.alert({
        message:this.isShow+"1111"
      })
     this.isShow=false;
    },
    onFocus1(){
        modal.alert({
        message:"2222"
      })
    },
    // 输入框失去焦点
    onBlur(){
    this.isShow=true;
    },
    addMembers2() {
      for (let i in this.$store.state.group) {
        // 分组名字一样
        if (
          this.newGroupName == this.$store.state.group[i].GroupName
        ) {
          wjalert.alert("分组名称已经存在,请重新输入", "确定", data => {});
          return;
        }
      }
      if (!this.newGroupName) {
        wjalert.alert("分组名称不能为空", "确定", data => {});
        return;
      } else {
         this.$store.state.newGroupName=this.newGroupName;
        this.jump("/addMembers2");
      }
    },
    // 删除分组成员;
    deleteGroupMember(item) {
        this.$store.state.isshowNewGroupMerber= true;
          this.$store.state.deleteNewGroupMemberItem=item;
    },
    // 保存按钮
    save() {
        if(this.isShow==false){
         return;
      }
        for (let i in this.$store.state.group) {
        // 分组名字一样
        if (
          this.newGroupName == this.$store.state.group[i].GroupName
        ) {
          wjalert.alert("分组名称已经存在,请重新输入", "确定", data => {});
          return;
        }
      }
      if(!this.newGroupName){
          wjalert.alert("分组名称不能为空", "确定", data => {});
        return;
      }else if (this.$store.state.newGroup.length == 0) {
         wjalert.alert("请至少添加一位分组成员", "确定", data => {});
        return;
      }else {
        this.post(
          "/eweb/DFActAccess.do",
          {
            GroupName: this.newGroupName,
            List: this.$store.state.newGroup
          },
          response => {
            if (response.data.DFAFlag == "1") {
              this.$store.state.bgBolG = 1;
              wjalert.alert("保存成功", "确定", data => {
                this.jump("/myPayrollRegister");
              });
            } else {
              wjalert.alert("分组名称已经存在,请重新输入", "确定", data => {});
              wjalert.alert("保存失败", "确定", data => {});
            }
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.newGroup {
  background-color: rgba(250, 250, 250, 1);
}
.graybg{
  position: fixed;
  /* top:426px; */
  bottom:88px;
  left: 0;
  right:0;
  background-color: rgba(250, 250, 250, 1);
}
.section {
  height: 110px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  /* margin-left: 30px; */
  background-color: rgba(255, 255, 255, 1);
}
.boldtext {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.input1 {
  width: 500px;
  height: 100px;
  text-align: right;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
}
.add {
  background-color: rgba(255, 255, 255, 1);
  height: 110px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(234, 234, 234, 1);
  border-radius: 12px;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 30px;
}
.add_img {
  width: 32px;
  height: 32px;
  margin-right: 24px;
}
.add_title {
 font-size:28px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color: rgba(170, 170, 170, 1);
}
.group_btn {
 font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}
.info {
  position: fixed;
  bottom:88px;
  left: 0;
  right:0;
  background-color: rgba(255, 255, 255, 1);
}
.info_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.info_item_left {
  width: 118px;
  height: 142px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bank_img {
  width: 64px;
  height: 64px;
}
.info_item_right {
  width: 632px;
  height: 142px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
}
.delete_img {
  width: 30px;
  height: 30px;
}
.text_acno {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-top: 15px;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
}
.btn2 {
  display: flex;
  justify-content: center;
  align-items: center;
}
.section_bottom{
 position: fixed;
  left: 0;
  right: 0;
  bottom:0;
}
.gray {
  height: 88px;
  /* background-color: rgba(210, 209, 209, 0.56); */
   background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
  display: flex;
  justify-content: center;
  align-items: center;
}
.save {
  height: 88px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
  display: flex;
  justify-content: center;
  align-items: center;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.next_btn {
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
</style>
