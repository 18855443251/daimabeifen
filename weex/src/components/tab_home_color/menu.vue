<template>
  <div class="tab">
    <div class="menuItem" :style="{width:itemWidth}" v-for="(item,key) in commonMenuList" :key="key" @click="JumpTo(item)">
      <image class="image" :src="item.src" :style="{width:imgWidth+'px',height:imgHeight+'px',marginBottom:ImgMarginBottom+'px'}"></image>
      <text class="title">{{item.name}}</text>
    </div>
  </div>
</template>
<style scoped>
.tab {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 30px;
  width: 690px;
  height: 300px;
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
}

.title {
  font-size: 28px;
  color: #404561;
}
</style>

<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const commonMenu = weex.requireModule("common_menu");

export default {
  props: ["jsonurl"],
  data() {
    return {
      tabWidth: 690,
      menu_columns: 4,
      menuList: [],
      imgWidth: "58",
      imgHeight: "58",
      ImgMarginBottom: "22",
      endMenu: [],
      tempMenulist: [],
      allmenuList: [],
      commonMenuList: [],
      allmenuUrl: "./json/allmenu/allmenuTheme.json"
    };
  },
  computed: {
    itemWidth: function() {
      return this.tabWidth / this.menu_columns;
    }
  },
  created() {
    this.getMenu();
  },
  methods: {
    JumpTo(item) {
      var url = item.url;
      if (item.isNotRecord) {
        this.gotoStage(url, true);
      } else {
        this.gotoStage(url);
      }
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
            this.menuList = tmp.menuList;
            this.endMenu.push(this.menuList[this.menuList.length - 1]);
            if (tmp.imgSize) {
              this.imgWidth = tmp.imgSize.imgWidth;
              this.imgHeight = tmp.imgSize.imgHeight;
            }
            if (tmp.ImgMarginBottom) {
              this.ImgMarginBottom = tmp.ImgMarginBottom;
            }
            this.getAllmenuJson();
          }
        }
      );
    },
    //获取全部菜单
    getAllmenuJson() {
      this.httpGet(this.allmenuUrl, response => {
        this.tempMenulist = response.data.data.allmenuList;
        this.RefactorAllmenu();
      });
    },
    //整理合并全部菜单
    RefactorAllmenu() {
      this.allmenuList = [];
      for (let val of this.tempMenulist) {
        let menuList = val.menuList;
        this.allmenuList = [...this.allmenuList, ...menuList];
      }
      this.getRecordMenu();
    },
    //获取客户端菜单点击数目，并根据全部菜单整理
    getRecordMenu() {
      commonMenu.getMenuNum(this.$store.state.mobiel, val => {
        if (val) {
          var val = JSON.parse(val);
          this.commonMenuList = [];
          for (let recordObj of val) {
            for (let menuObj of this.allmenuList) {
              if (menuObj.url == recordObj.menuName) {
                this.commonMenuList.push(menuObj);
              }
            }
          }
          this.RefactorcommonMenu();
        } else {
          this.commonMenuList = this.menuList;
        }
      });
    },
    //整理获取常用8个菜单
    RefactorcommonMenu() {
      let otherMenuList = JSON.parse(JSON.stringify(this.menuList));
      let commonList = this.commonMenuList.map(commomObj => {
        for (let i = 0; i < otherMenuList.length; i++) {
          if (commomObj.url == otherMenuList[i].url) {
            let menuObj = JSON.parse(JSON.stringify(otherMenuList[i]));
            otherMenuList.splice(i, 1);
            return menuObj;
          }
        }
        return commomObj;
      });
      let commonListLength = commonList.length;
      if (commonListLength >= 7) {
        let sliceArr = commonList.slice(0, 7);
        this.commonMenuList = [...sliceArr, ...this.endMenu];
      } else {
        let otherMenu = otherMenuList.slice(0, 7 - commonListLength);
        this.commonMenuList = [...commonList, ...otherMenu, ...this.endMenu];
      }
    }
  },
  watch: {
    "$store.state.mobiel"() {
      this.getAllmenuJson();
    }
  }
};
</script>
