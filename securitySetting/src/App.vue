<template>
  <div @clickbackitem="goBack"  @viewappear="viewappear">
    <!--主界面-->
    <router-view style="flex:1;background-color: #fff"></router-view>
  </div>
</template>

<script>
  const context = weex.requireModule('context')
  export default {
    data () {
      return {}
    },
    created(){
      this.viewappear();
    },
    methods:{
      viewappear(){
          this.$store.state.isgoBack = context.sessionGetString('isgoBack');
        },
    }

  }
</script>
<style>
body{
  margin: 0;
  padding: 0;
}
</style>

