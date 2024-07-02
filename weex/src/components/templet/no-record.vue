<template>
  <div class="container">
    <image :src="noRecordUrl" class="no-record"></image>
    <text class="no-record-text">{{recordText}}</text>
  </div>
</template>

<script>
export default {
  props: {
    recordText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      noRecordUrl: "./imgs/templet/common/noRecord.png"
    };
  }
};
</script>

<style scoped>
.container {
  width: 750px;
  align-items: center;
  margin-top: 226px;
}
.no-record {
  width: 156px;
  height: 145px;
}
.no-record-text {
  margin-top: 55px;
  font-size: 32px;
  color: rgb(153, 153, 153);
}
</style>
