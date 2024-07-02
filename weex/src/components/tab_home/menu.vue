<template>
  <div class="tab">
    <div class="menuItem" v-for="item in menuList" :key="item.name" @click="JumpTo(item)">
      <image class="image" :src="item.src"></image>
      <text class="title">{{item.name}}</text>
    </div>
  </div>
</template>
<style scoped>
.tab {
  width: 692px;
  height: 328px;
  background-color: #ffffff;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 40px;
  position: absolute;
  top: 180px;
  left: 28px;
  /* box-shadow: 0 0 14px 2px ; */
  border-radius: 24px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style:solid;
}
.menuItem {
  align-items: center;
  padding-bottom: 40px;
  width: 171px;
}
.image {
  width: 54px;
  height: 54px;
  margin-bottom: 15px;
}

.title {
  font-size: 26px;
  color: #555555;
  text-align: center;
  line-height: 26px;
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
      // tabWidth: 690,
      // menu_columns: 4,
      menuList: [],
      endMenu: [],
      tempMenulist: [],
      allmenuList: [],
      commonMenuList: [],
      allmenuUrl: "./json/allmenu/allmenu.json"
    };
  },
  created() {
    this.getMenu();
  },
  // computed: {
  //   itemWidth: function() {
  //     return this.tabWidth / this.menu_columns;
  //   }
  // },
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
