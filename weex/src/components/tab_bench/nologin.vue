<template>
    <div class="container">
        <div class="content" @click="toLogin">
            <image class="bench-img" :src="url"></image>
            <text class="bench-text" >{{text}}</text>
        </div>
    </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
}
.content {
  width: 750px;
  /* height: 900px; */
  /* min-height: 81vh; */
  /* position: relative; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 150px;
}
.bench-img {
    width: 220px;
    height: 220px;
    margin-bottom: 36px;
    /* margin: 100px 0 50px 0; */
}
.bench-text {
    width: 390px;
    text-align: center;
    line-height: 48px;
    font-size: 30px;
    color: #333333;
}
.sign-out-text {
  width: 690px;
  height: 96px;
  line-height: 96px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  border-width: 1px;
  border-color: #bec9db;
  font-size: 32px;
  color: #98a9c2;
  margin-top: 50px;
  /* margin-left: 30px; */
  /* margin: 50px 50px 0 0; */
}
</style>

<script>
const context = weex.requireModule("context");
    export default {
    data() {
        return {
            url: './imgs/tab_bench/nologin@3x.png',
            text: '登录企业手机银行，查看您的有权限的功能服务'
        };
    },
    computed: {},
    methods: {
        toLogin(){
            context.launchStage("main.login");
        }
    },
    created() {}
    };
</script>
