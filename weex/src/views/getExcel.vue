<template>
<!-- 透明场景什么都不需要加 -->
    <div class="container">
    </div>
</template>

<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const uploadFile = weex.requireModule("weex-UploadFile");
export default {
  components: {
  },
  data() {
    return {
    };
  },
    mounted(){
        context.finish();
       
        // setTimeout(() => {
            //  uploadFile.getStage();
            context.launchStage("main.payrollEntry");
        // }, 200);
      
    },
  methods: {
  }
};
</script>

<style scoped>

</style>
