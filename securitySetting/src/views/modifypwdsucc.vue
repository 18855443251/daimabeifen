<template>
    <div class="container">
      <nav-bar :title="title"></nav-bar>
         <div class="content">
            <image :src="complete" class="complete"/>
             <text class="esucc1">修改成功！</text>
             <text class="esucc">您好，您的登录密码已经修改成功</text>
             <text class="esucc">下次登录请使用新的密码</text>
         </div>
         <div class="btn">
              <text class="btntext" @click="next">完成</text>
        </div>

   </div>
</template>
<style scoped>
.container{
    width: 750px;
    height: 1334px;
    background-color: #ececec;
}
.content{
    width: 750px;
    height: 360px;
    justify-content: center;
    align-content: center;
    align-items: center;
    background-color: #ffffff;
}
.complete{
    width: 90px;
    height: 90px;
}
.esucc{
  font-size: 24px;
  color: rgb(153,153,153);
  margin-top: 20px;
}
.esucc1{
  font-size: 32px;
  color: rgb(0,0,0);
  margin-top: 20px;
}
.eaccount{
  font-size: 24px;
  color: rgb(153,153,153);
  margin-top: 10px;
}
.btn {
  flex-direction: row;
  margin-top: 50px;
  justify-content: space-around;
}

.btntext {
  width: 690px;
  height: 90px;
  color: #fff;
  font-size: 32px;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(247,80,46);
  border-radius: 10px;
}
</style>
<script>
  import NavBar from "../components/titlebar_component.vue"
  const modal = weex.requireModule('modal')
  const stream = weex.requireModule('stream')
  const context = weex.requireModule('context')
  const picker = weex.requireModule("picker")
  const wjalert = weex.requireModule("weex-alert")
  export default {
    components: { NavBar },
    data () {
      return {
          title:"注册成功",
          complete:this.$store.state.imgBaseUrl + "results@3x.png",
       }
    },
    methods:{
        next(){
           this.jump('/logintype');
        }
    }
}
</script>
