<template>
  <div class="tab">
    <div class="menuItem" :style="{width:itemWidth}" v-for="(item,key) in menuList" :key="key" @click="JumpTo(item.url)">
      <image class="image" :src="item.src" :style="{width:imgWidth+'px',height:imgHeight+'px',marginBottom:ImgMarginBottom+'px'}"></image>
      <text class="title">{{item.name}}</text>
    </div>
  </div>
</template>
<style scoped>
.tab {
  width: 690px;
  height: 328px;
  background-color: #ffffff;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  margin-left: 30px;
}

.menuItem {
  align-items: center;
  width: 172.5px;
  padding-bottom: 30px;
}

.image {
  width: 58px;
  height: 58px;
  margin-bottom: 15px;
}

.title {
  font-size: 26px;
  color: #404561;
  text-align: center;
  line-height: 26px;
}
</style>

<script>
const context = weex.requireModule('context');
const stream = weex.requireModule('stream');

export default {
  props: ['jsonurl'],
  data() {
    return {
      tabWidth: 690,
      menu_columns: 4,
      menuList: [],
      imgWidth: '58',
      imgHeight: '58',
      ImgMarginBottom: '22'
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
      this.gotoStage(url,true);
    },
    getMenu() {
      stream.fetch(
        {
          method: 'GET',
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: 'json'
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;
            this.menu_columns = tmp.columns;
            this.menuList = tmp.menuList;
            if (tmp.imgSize) {
              this.imgWidth = tmp.imgSize.imgWidth;
              this.imgHeight = tmp.imgSize.imgHeight;
            }
            if (tmp.ImgMarginBottom) {
              this.ImgMarginBottom = tmp.ImgMarginBottom;
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
