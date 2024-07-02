<template>
  <div class="">
    <div class="setcontainer">
      <div class="wrapper" v-for="(item,key) in listData" :key="key"  @click="JumpTo(item.url)" >
        <!-- <div class="banker banker_20" @click="JumpTo(item.url)" v-if="item.name == '安全设置'">
          <image :src="item.src" class="icon"></image>
          <text class="title">{{item.name}}</text>
          <image class="logal" :src="rightimg"></image>
        </div> -->
        <div class="banker">
          <image :src="item.src" class="icon"></image>
          <text class="title">{{item.name}}</text>
          <image class="logal" :src="rightimg"></image>
        </div>
      </div>
      
      <!-- <text class="logintime">上次登录：{{userinfo.LastLoginTime}}</text> -->

    </div>
    <div class="">
      <text class="logintime">上次登录：{{userinfo.LastLoginTime}}</text>
    </div>
  </div>
</template>

<style scoped>
.logintime{
  width: 690px;
  text-align: center;
  margin-top: 54px;
  font-size: 24px;
  color: #aaa;
}
.red{
  background-color: red;
  position: absolute;
  top:20px;
  left:150px;
  border-radius: 100%;
  color:#ffffff;
  width: 32px;
  height: 32px;
  font-size: 26px;
  line-height: 32px;
  text-align: center;
}
.setcontainer {
  width: 690px;
  background-color: #ffffff;
  margin-top: 150px;
  margin-left: 30px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style:solid;
}
.wrapper {
  width: 690px; 
  /* padding-left: 30px; */
  /* padding-right: 30px; */
  /* margin-left: 30px; */
  justify-content: space-between;
  
}
.banker {
  height: 90px;
  flex-direction: row;
  padding-left: 30px;
  align-items: center;
}
 .icon{
  height: 36px;
  width: 36px;
  margin-right: 20px;
}
.banker_20{
  border-bottom: 20px solid rgb(239, 239, 244);
}
.title {
  font-size: 30px;
  color: #1a263f;
}

.logal {
  width: 14px;
  height: 24px;
  position: absolute;
  right: 60px;
  top: 35px;
}
</style>
<script>
//理财类型： hot、black、presale 、setUp、soldOut
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');

export default {
  props: ['jsonurl','num'],
  created() {
    this.getData();
    this.itemer =  setTimeout(data=>{
      this.userinfo = this.$store.state.userinfo;
      },200)
  },
  data() {
    return {
      listData: [],
      itemer:"",
      userinfo:{},
      rightimg: './imgs/tab_user/user/more.png'
    };
  },
  methods: {
    JumpTo(url) {
      // context.launchStage(url);
      this.gotoStage(url);
    },
    getData() {
      stream.fetch(
        {
          method: 'GET',
          url: './json/' + this.jsonurl,
          type: 'json'
        },
        res => {
          this.listData = res.data.data;
        }
      );
    }
  },
  beforeDestroy(){
    clearTimeout(this.itemer)
  }
};
</script>