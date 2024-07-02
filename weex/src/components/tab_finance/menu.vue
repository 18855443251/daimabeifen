<template>
  <div class="tab">
    <div class="menuItem" :style="{width:itemWidth}" v-for="(item,key) in menuList" :key="key" @click="JumpTo(item)">
      <image class="image" :src="item.src"></image>
      <text class="title">{{item.name}}</text>
    </div>
  </div>
</template>
<style scoped>
.tab {
  width: 750px;
  background-color: #ffffff;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 47px;
  padding-bottom: 52px;
}

.menuItem {
  align-items: center;
  width: 187.5px;
}

.image {
  width: 64px;
  height: 64px;
  margin-bottom: 25px;
}

.title {
  font-size: 28px;
  color: #222222;
}
</style>

<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");

export default {
  props: ["jsonurl"],
  data() {
    return {
      tabWidth: 750,
      menu_columns: 4,
      menuList: []
    };
  },
  computed: {
    itemWidth: function() {
      return this.tabWidth / this.menu_columns;
    }
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
