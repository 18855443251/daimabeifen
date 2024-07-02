<template>
  <div class="container" :style="{ paddingBottom:paddingBottom+'px'}"></div>
</template>
<style scoped>
.container {
  justify-content: center;
  align-items: center;
  background-color: red;
}
</style>
<script>
export default {
  data() {
    return {
      paddingBottom: this.isipx() ? 100 + 50 : 100
    };
  }
};
</script>
