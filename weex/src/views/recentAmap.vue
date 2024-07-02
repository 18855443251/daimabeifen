<template>
  <div class="container">
    <div>
      <weex-amap ref="map" class="map_div" id="map2017" :sdkKey="sdkKey" :compass="false" :zoom="13" :center="params.pos" :geolocation="true" :myLocationEnabled="true" :showMyLocation="true">
        <div v-for="(item,key) in params.bankList" :key="key"></div>
        <weex-amap-marker :position="[item.Lon, item.Lat]"></weex-amap-marker>
      </weex-amap>
    </div>

  </div>
</template>
<style scoped>
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #ffffff;
}
.map_div {
  height: 1;
  flex: 1;
}
</style>
<script>
const nav_map = weex.requireModule('nav-map');
export default {
  props: ['jsonurl'],
  data() {
    return {
      sdkKey: {
        ios: '219946f347c3217f3f071909c6a079ab',
        // 442130dd2ab50da0321a2a5f3177227e
        android: '2514b7b987b5a0859769665df4a27389'
      },
      params: this.$route.params
    };
  },
  methods: {},
  created() {},
  mounted() {
    
  }
};
</script>
