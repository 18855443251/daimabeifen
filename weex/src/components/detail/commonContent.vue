<template>
  <div class="detail_wrapper">
    <div class="detail_content" 
    :key_index="(index)" :key_len="(contentList.length-1)"
    :style="[
    {'border-bottom-width':(contentList.length-1) == index ? 'unset' : '1px'},
    {'border-bottom-style':(contentList.length-1) == index ? 'unset' : 'solid'},
    {'border-bottom-color':(contentList.length-1) == index ? 'unset' : 'rgba(51, 51, 51, 0.08)'},
    ]" v-for="(list, index) in contentList" :key="index">
      <text class="detail_tit">{{list.name1}}</text>
      <input  v-if="list.showInput" test-id="input-obj" ref="range" class="detailInput" type="text" placeholder="请输入贴现利率" @input="eventInput" @change="onChange" @focus="onFocus" @blur="onBlur" @keyboard="onKeyBoard"></input>
      <text v-else class="detail_text">{{list.text1}}</text>
    </div>
  </div>
</template>

<style scoped>
.detail_text {
  flex: 1;
  text-align: right;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(124, 124, 124, 1);
}
.detail_tit {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.detail_content {
  height: 92px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const getphoneInfo = weex.requireModule("getPhoneInfo");
export default {
  props: {
    contentList: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
      //  contentList:[
      //    {
      //      name1: '背书人名称：',
      //      text1: '吴江市天海进出口有限公司'
      //    },
      //    {
      //      name1: '背书人账号：',
      //      text1: '070667******0298'
      //    }
      //  ]
      state: "",
      keyboard_state: ""
    };
  },
  created() {
    //获取手机标识码
    // getphoneInfo.getPhoneInfo(data =>{
    //   this.machineOS=JSON.parse(data).machineOS;
    // })
  },
  methods: {
    goto(id) {
      if (this.machineOS == "Android") {
        this.$store.state.Devflag = false;
      }
      context.launchStage(id);
    },
    eventInput(e) {
      this.$emit("inputFocus", e);
    },
    onChange: function(e) {
      this.state = "change: " + JSON.stringify(e);
    },
    onFocus: function(e) {
      this.state = "focus: " + JSON.stringify(e);
    },
    onBlur: function(e) {
      this.$emit("inputOnBlur", e);
    },
    onKeyBoard: function(e) {
      this.keyboard_state = "\n onkeyboard: " + JSON.stringify(e);
    }
  }
};
</script>