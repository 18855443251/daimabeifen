<template>
  <div class="container">
    <text class="menutitle">{{menutitle}}</text>
    <div class="tab">
      <template v-for="(item,key) in menuList">
        <div class="menuItem" :style="{width:itemWidth}" :key="key" @click="JumpTo(item.url)" v-if="item.platform=='all'||item.platform==platform">
          <image class="image" :src="item.src"></image>
          <text class="title">{{item.name}}</text>
        </div>
      </template>
    </div>
  </div>
</template>    

<style scoped>
.container {
  background-color: #ffffff;
  margin-top: 16px;
  padding-bottom: 16px;
}
.menutitle {
  height: 110px;
  line-height: 110px;
  padding-left: 30px;
  font-size: 36px;
  color: #222222;
  font-weight: 600;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
}
.tab {
  width: 750px;
  background-color: #ffffff;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.menuItem {
  align-items: center;
  width: 187.5px;
  padding-top: 35px;
  padding-bottom: 12px;
}

.image {
  width: 64px;
  height: 64px;
  margin-bottom: 26px;
}

.title {
  font-size: 28px;
  color: #222222;
}
</style>

<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");

export default {
  props: ["jsonurl"],
  data() {
    return {
      menutitle: "常用功能",
      tabWidth: 750,
      menu_columns: 4,
      menu_title: "",
      menuList: [],
      platform: WXEnvironment.platform.toLowerCase()
    };
  },
  computed: {
    itemWidth: function() {
      return this.tabWidth / this.menu_columns;
    }
  },
  methods: {
    JumpTo(url) {
      // context.launchStage(url);
      this.gotoStage(url);
    },
    getMenu() {
      stream.fetch(
        {
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;

            this.menu_columns = tmp.columns;
            this.menu_title = tmp.menu_title;
            this.menuList = tmp.menuList;
          }
        },
        () => {}
      );
    }
  },
  created() {
    this.getMenu();
  }
};
</script>
