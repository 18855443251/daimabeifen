<template>
  <div class="containter">
    <title :jsonurl="jsonTitle"></title>
    <scroller>
      <menu :jsonurl="jsonurl"></menu>
    </scroller>
  </div>
</template>

<style scoped>
.containter {
  background-color: rgb(247,247,247);
}
</style>

<script>
const context = weex.requireModule("context");

import Title from "../components/allmenu/title";
import Menu from "../components/allmenu/menu";
export default {
  components: { Title, Menu },
  data() {
    return {
      jsonurl: "allmenu.json",
      jsonTitle: "title.json"
    };
  },
  created() {
    this.judgeTheme();
  },
  methods: {
    //判断主题
    judgeTheme() {
      var colorTheme = context.secureGetString("colorTheme");
      if (colorTheme) {
        if (colorTheme == "smple") {
          this.jsonurl = "allmenuSimple.json";
          this.jsonTitle = "title.json";
        } else if (colorTheme == "standard") {
          this.jsonurl = "allmenu.json";
        }else{
          this.jsonurl = "allmenuTheme.json";
        }
      }
    }
  }
};
</script>



