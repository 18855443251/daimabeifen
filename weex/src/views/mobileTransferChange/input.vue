<template>
  <div class="container">
    <title-bar title="手机号转账变更"></title-bar>
    <div>
      <div class="tab">
        <div v-for="(item , key) in tabs" :key="key" class="tabItem" @click="tabSelect(key)">
          <text :class="[activeTab==key?'tab-seleted':'tab-seleteds']">{{item}}</text>
          <!-- <div class="line" v-if="activeTab==key"></div> -->
        </div>
      </div>
      <div class="tabContent" :style="{ left: activeTab * -750 + 'px'}">
        <bind-account-change :activeTab="activeTab"></bind-account-change>
        <default-account-change :activeTab="activeTab"></default-account-change>
        <logout-mobile-transfer :activeTab="activeTab"></logout-mobile-transfer>
      </div>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");

import TitleBar from "@/components/templet/titlebar";
import BindAccountChange from "@/components/mobileTransferChange/bindAccountChange";
import DefaultAccountChange from "@/components/mobileTransferChange/defaultAccountChange";
import LogoutMobileTransfer from "@/components/mobileTransferChange/logoutMobileTransfer";

export default {
  components: {
    TitleBar,
    BindAccountChange,
    DefaultAccountChange,
    LogoutMobileTransfer
  },
  created() {},
  mounted() {
    this.init();
  },
  data() {
    return {
      tabs: ["绑定账户变更", "默认账户变更", "注销手机转账"],
      activeTab: null
    };
  },
  methods: {
    init() {
      let Page = context.getParam("Page");
      if (Page) {
        this.activeTab = Page;
      } else {
        this.activeTab = 0;
      }
    },
    tabSelect(param) {
      if (this.activeTab != param) {
        this.activeTab = param;
      }
    }
  }
};
</script> 

<style scoped>
.container {
  background-color: #ececec;
}
.tab {
  width: 750px;
  height: 96px;
  flex-direction: row;
  justify-content: space-around;
  background-color: #ffffff;
  align-items: center;
}
.tabItem {
  /* margin-top: 26px; */
  flex-direction: column;
  align-items: center;
}
/* .tab-unseleted {
  font-size: 32px;
  color: rgb(34, 34, 34);
} */
.tab-seleted {
  color: #ffffff;
  background-color: rgb(193, 153, 101);
  width: 200px;
  height: 66px;
  line-height: 66px;
  text-align: center;
  border-radius: 10px;
}
.tab-seleteds {
  color: rgb(34,34,34);
  width: 200px;
  height: 66px;
  line-height: 66px;
  text-align: center;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(236,236,236);
  background-color:rgb(236,236,236);
  border-radius: 10px;
}
.line {
  margin-top: 14px;
  width: 90px;
  height: 6px;
  border-radius: 3px;
  background-color: rgb(193, 153, 101);
}
.tabContent {
  /* position: relative; */
  width: 2250px;
  flex-direction: row;
  transition: left 0.2s ease-in-out;
}
</style>
