<template>
  <div class="loading">
    <image class="bottom-img" :src="bottomhImg"></image>
    <image class="loading-img" :src="loadingImg"></image>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bottomhImg: "./imgs/templet/bottom/bottom-img.png",
      loadingImg: "./imgs/templet/bottom/loading.gif"
    };
  }
};
</script>

<style scoped>
.loading {
  width: 750px;
  height: 200px;
  justify-content: center;
  align-items: center;
  position: relative;
}
.bottom-img {
  width: 750px;
  height: 160px;
}
.loading-img {
  width: 450px;
  height: 186px;
  position: absolute;
  top: 7px;
  left: 150px;
}
</style>
