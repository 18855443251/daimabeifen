<template>
  <div class="container" :style="{ paddingBottom:paddingBottom+'px'}">
    <image class="bottom-img" :src="src"></image>
  </div>
</template>
<style scoped>
.container {
  justify-content: center;
  align-items: center;
}
.bottom-img {
  width: 750px;
  height: 160px;
}
</style>
<script>
export default {
  data() {
    return {
      src: "./imgs/templet/bottom/bottom-img.png",
      paddingBottom: this.isipx() ? 100 + 50 : 100
    };
  }
};
</script>
