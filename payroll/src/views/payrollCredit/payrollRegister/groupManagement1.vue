<template>
  <div>
    <nav-bar title="分组管理"></nav-bar>
    <div class="groupManagement1">
      <div class="section">
        <text class="boldtext">分组名称</text>
        <input
          type="text"
          placeholder="请输入分组名称"
          v-model="groupName"
          class="input1"
        />
      </div>
      <div class="section">
        <text class="boldtext">组内成员({{ groupDetail1Number }}人)</text>
        <text class="group_btn" @click="addMembers1">添加组员</text>
      </div>
      <div class="text_gray"></div>
      <list
        class="info"
        :style="{ top: this.getPosiScrollerTop() + 200 + 'px' }"
      >
        <cell
          v-for="(item, index) in $store.state.groupManagement1"
          :key="index"
          class="info_item"
          @click="deleteGroupMember(item)"
        >
          <div class="info_item_left">
            <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
          </div>
          <div class="info_item_right">
            <div class="info_item_box_text">
              <text>{{ ellipsis(item.AcName, 17) }}</text>
              <text class="text_acno">{{ divieBanks(item.AcNo) }}</text>
            </div>
            <div>
              <image :src="deleteImg" class="delete_img" />
            </div>
          </div>
        </cell>
      </list>
      <div class="section_bottom">
        <div class="btn">
          <text class="dissolution" @click="dissolution">解散分组</text>
          <text class="save"  @click="save">保存</text>
        </div>
      </div>
      <deletegroup></deletegroup>
      <deleteGroupMeber></deleteGroupMeber>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import deletegroup from "../../../components/deleteGroup.vue";
import deleteGroupMeber from "../../../components/deleteGroupMeber.vue";
import { WxcMask } from "weex-ui";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, WxcMask, deletegroup, deleteGroupMeber },
  data() {
    return {
      deleteImg: this.$store.state.imgBaseUrl + "21.png",
      // 分组名字
      groupName:"",
      BankId: "9999",
    };
  },
  created() {
    //用于代发名册页选中的收款人带到分组管理页去重
    var newArr = [];
    var newObj = {};
    var newArr1 = [];
    var newObj1 = {};
    for (var i = 0; i < this.$store.state.groupManagement1.length; i++) {
      if (!newObj1[this.$store.state.groupManagement1[i].AcNo]) {
        newArr1.push(this.$store.state.groupManagement1[i]);
        newObj1[this.$store.state.groupManagement1[i].AcNo] = true;
      }
    }
    this.$store.state.groupManagement1 = newArr1;
    // 用于代发名册页传过来的新选的收款人传给后台
    for (var i = 0; i < this.$store.state.newgroupManagement.length; i++) {
      if (!newObj[this.$store.state.newgroupManagement[i].AcNo]) {
        newArr.push(this.$store.state.newgroupManagement[i]);
        newObj[this.$store.state.newgroupManagement[i].AcNo] = true;
      }
    }
    this.$store.state.newgroupManagement = newArr;
    this.groupName=this.$store.state.GGroupName;
    // this.$refs.abc.blur();
  },
  computed: {
    // 组内成员
    groupDetail1Number() {
      var sum = 0;
      sum = this.$store.state.groupManagement1.length;
      return sum;
    }
  },
  methods: {
    // 跳转到代发名册页
    addMembers1() {
       if (!this.groupName) {
        wjalert.alert("分组名称不能为空", "确定", data => {});
        return;
      }else if(this.groupName.length>10){
       wjalert.alert("分组名称最多10位", "确定", data => {});
        return;
      }else{
      this.$store.state.GGroupName = this.groupName;
      this.jump("/addMembers1");
      }
    },
    // 保存分组
    save() {
      if (!this.groupName) {
        wjalert.alert("分组名称不能为空", "确定", data => {});
        return;
      }else if(this.groupName.length>10){
       wjalert.alert("分组名称最多10位", "确定", data => {});
        return;
      }else if (this.$store.state.groupManagement1.length == 0) {
        wjalert.alert("请至少添加一位分组成员", "确定", data => {});
        return;
      }else if (this.groupName != this.$store.state.oldGGroupName) {
        for (let i in this.$store.state.group) {
          if (this.groupName == this.$store.state.group[i].GroupName) {
            wjalert.alert("分组名称已存在,请重新输入", "确定", data => {});
            return;
          }
        }
        this.modify();
      } else {
        this.modify();
      }
    },
    modify() {
      this.post(
        "/eweb/UPActAccess.do",
        {
          // 分组ID
          GroupId: this.$store.state.GroupId,
          // 旧的分组名字
          OldGroupName: this.$store.state.oldGGroupName,
          // 新的分组名字
          NewGroupName: this.groupName,
          List: this.$store.state.newgroupManagement
        },
        response => {
          if (response.data.Flag == "1") {
            this.$store.state.bgBolG = 1;
            this.$store.state.newgroupManagement = [];
            wjalert.alert("保存成功", "确定", data => {
              this.jump("/myPayrollRegister");
            });
          } else {
            wjalert.alert("保存失败", "确定", data => {});
          }
        }
      );
    },
    // 解散分组
    dissolution() {
      this.$store.state.isshowGroup = true;
    },
    // 删除分组成员
    deleteGroupMember(item) {
      this.$store.state.isshowGroupMerber = true;
      this.$store.state.deleteGroupMemberItem = item;
    }
  }
};
</script>
<style scoped>
.groupManagement1 {
  background-color: rgba(255, 255, 255, 1);
}
.info {
  position: fixed;
  bottom:88px;
  left: 0;
  right:0;
}
.section {
  height: 90px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.boldtext {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.input1 {
  width: 550px;
  height: 80px;
  text-align: right;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(124, 124, 124, 1);
}
.group_btn {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}
.info_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
   background-color: rgba(255, 255, 255, 1);
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.dissolution {
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
 background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  opacity: 0.5;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.save {
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
 background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.gray{
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.section_bottom{
  position: fixed;
  bottom:0px;
  left:0;
  right:0;
}
</style>
