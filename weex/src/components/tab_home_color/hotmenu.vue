<template>
  <div class="tab">
    <image class="bg-src" :src="bgSrc" v-if="bgSrc"></image>
    <div class="container">
      <div class="menuItem" :style="{width:itemWidth}" v-for="(item,key) in menuList" :key="key" @click="JumpTo(item.url)">
        <image class="image" :src="item.src" :style="{width:imgWidth+'px',height:imgHeight+'px'}"></image>
        <text class="title" :style="{color:fontColor}">{{item.name}}</text>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab {
  width: 750px;
  height: 300px;  
}
.bg-src {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.container {
  height: 250px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 4px;
  padding-left: 19px;
  padding-right: 19px;
}
.menuItem {
  align-items: center;
  width: 2.3rem;
  padding-top: 30px;
  padding-bottom: 30px;
}

.image {
  width: 62px;
  height: 62px;
  margin-bottom: 22px;
}

.title {
  font-size: 28px;
  color: #f6f6f6;
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
      tabWidth: 710,
      menu_columns: 4,
      menuList: [],
      bgSrc: "",
      fontColor: "#f6f6f6",
      imgWidth: "66",
      imgHeight: "66"
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
      this.gotoStage(url, true);
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
            this.bgSrc = tmp.bgImg;
            this.menu_columns = tmp.columns;
            this.menuList = tmp.menuList;
            if (tmp.fontColor) {
              this.fontColor = tmp.fontColor;
            }
            if (tmp.imgSize) {
              this.imgWidth = tmp.imgSize.imgWidth;
              this.imgHeight = tmp.imgSize.imgHeight;
            }
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
