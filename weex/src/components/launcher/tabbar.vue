<template>
  <div class="wrapper">
    <embed v-for="(item , index) in tabItems" :src="item.src" :key="index" type="weex" :style="{ visibility: item.visibility }" class="content"></embed>
    <div class="tabbar" :style="{paddingBottom : paddingBottom + 'px', height : height+'px' }" append="tree">
      <tabitem v-for="(item , index) in tabItems" :key="index" :index="index" :icon="item.icon" :title="item.title" :titleColor="item.titleColor" @tabItemOnClick="tabItemOnClick">
      </tabItem>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 750px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.tabbar {
  flex-direction: row;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top-width: 1px;
  border-top-color: rgb(230, 230, 230);
  border-top-style:solid;
}
</style>

<script>
import tabitem from "./tabitem.vue";
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
module.exports = {
  props: {
    tabItems: { default: [] },
    selectedColor: { default: "" },
    unselectedColor: { default: "" }
  },
  data() {
    return {
      selectedIndex: 0,
      tabLength: 3,
      paddingBottom: this.isipx() ? 50 : 0,
      height: this.isipx() ? 100 + 50 : 100
    };
  },
  components: { tabitem },
  mounted() {
    // this.initState();
  },
  methods: {
    initState() {
      this.tabLength = this.tabItems.length;
      for (let i = 0; i < this.tabLength; i++) {
        if (this.tabItems[i].visibility == "visible") {
          this.selectedIndex = i;
          break;
        }
      }
      this.select(this.selectedIndex);
    },
    tabItemOnClick(e) {
      this.$store.state.launcherTabbarTimes++;
      context.sessionSetString('launcherTabbarTimes',this.$store.state.launcherTabbarTimes);
      this.selectedIndex = e.index;
      if (this.selectedIndex == 2) {
        if (this.$store.state.isLogin != "y") {
          context.sessionSetString("nextScenes", "");
          context.launchStage("main.login");
          return;
        }
      }
      this.select(e.index);
      this.$emit("tabBarOnClick", e);
    },
    select(index) {
      for (let i = 0; i < this.tabLength; i++) {
        var tabItem = this.tabItems[i];
        if (i == index) {
          tabItem.icon = tabItem.selectedImage;
          tabItem.titleColor = this.selectedColor;
          tabItem.visibility = "visible";
        } else {
          tabItem.icon = tabItem.image;
          tabItem.titleColor = this.unselectedColor;
          tabItem.visibility = "hidden";
        }
      }
    }
  },
  watch: {
    tabItems() {
      this.initState();
    },
    "$store.state.isLogin"(val) {
      if (this.selectedIndex == 2) {
        if (val === "y") {
          this.select(2);
        } else {
          this.select(0);
        }
      }
    },
    // "$store.state.sevenTransfer"() {
    //   if(this.$store.state.sevenTransfer == 0) {
    //     this.select(1);
    //   }
    // }
  }
};
</script>
