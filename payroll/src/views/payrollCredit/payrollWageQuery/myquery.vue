<template>
  <div>
    <nav-bar title="代发工资查询"></nav-bar>
    <div class="query">
      <div class="nav_box">
        <div
          v-for="(item, index) in navData"
          class="nav_item"
          :key="index"
          @click="clickType(index)"
        >
          <text :class="[bgBol == index ? 'checked' : 'nochecked']">{{
            item.name
          }}</text>
          <div v-if="bgBol == index" class="block">
            <div class="block1"></div>
          </div>
        </div>
      </div>
      <payrollwagequeryhome v-if="bgBol == 0"></payrollwagequeryhome>
      <queryBatchNum v-if="bgBol == 1"></queryBatchNum>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import payrollwagequeryhome from "./payrollWageQueryHome.vue";
import queryBatchNum from "./queryBatchNum.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, payrollwagequeryhome, queryBatchNum },
  data() {
    return {
      navData: [{ name: "按日期查询" }, { name: "按批次号" }],
      bgBol: 0
    };
  },
  methods: {
    clickType(index) {
      this.bgBol = index;
    },
  
  }
};
</script>
<style scoped>
.query {
  background-color: rgba(255, 255, 255, 1);
}
.nav_box {
  height: 90px;
  margin-top: 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eaeaea;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.nav_item {
  width: 375px;
  height: 90px;
  justify-content: center;
  align-items: center;
}
.checked {
  font-size: 34px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(230, 2, 44, 1);
}
.nochecked {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(85, 85, 85, 1);
}
.block {
  bottom: 0px;
  left: 120px;
  position: absolute;
  align-items: center;
  justify-content: space-around;
}
.block1 {
  width: 140px;
  height: 6px;
 background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
}
</style>
