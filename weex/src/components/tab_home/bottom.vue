<template>
  <div class="container">
    <image class="bottom-img" :src="src"></image> 
  </div>
</template>
<style scoped>
.container {
  padding-bottom: 98px;
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
      src: './imgs/tab_home/bottom/bottom-img.png'
    };
  }
};
</script>
