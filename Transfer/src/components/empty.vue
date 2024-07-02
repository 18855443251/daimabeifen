<template>
  <div class="emptycontainer">
    <image class="resulticon" :src="emtypUrl"/>
    <text class="titlesp">{{title}}</text>
    <text class=" hintsp">{{hint}}</text>

  </div>
</template>

<script >
export default {
  props: {
    title: {
      tyle: String,
      default: "当前查询无记录"
    },

    hint: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      emtypUrl:this.$store.state.imgBaseUrl + "empty.png",
    };
  },
  methods: {}
};
</script>

<style scoped>
.emptycontainer {
  background-color: #ececec;
  width: 750px;
  height: 540px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.resulticon {
  width: 220px;
  height: 230px;
}
.titlesp {
  font-size: 30px;
  color: #222222;
  margin-top: 10px;
}
.hintsp {
  font-size: 30px;
  color: #999999;
  margin-top: 10px;
}
</style>
