<template>
    <div  class="contain">
      <nav-bar title="服务协议"></nav-bar>
      <!-- <scroller> -->
      <!-- 协议编译成web页面  读取本地的html页面 
      为了适配安卓机 在线word转成的html加上<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />-->
       <web src="./imgs/message.html" :style="getTop" class="ht"></web>
       <!-- </scroller> -->
      <!-- <scroller> -->
        <!-- <weex-document class="document" :style="{'height':fileHeight+'px'}" :src="fileSrc" :filename="fileName" :filetype="fileType" save=false></weex-document> -->
        <!-- <div class="textMes">
            <text class="mesTop">云盾数字证书服务协议</text>
            <text class="mesTop1">本协议包含用户与CFCA的权利与义务以及CFCA的免责条款</text>
            <text class="mesTop1">请认真阅读，尤其是粗体字内容</text>
            <div class="rowMes">
                <text class="border">云盾：</text>
                <text class="noboder">是由“中金金融认证中心有限公司” (即中国金融认证中心，简称“CFCA”)通过数字证书注册机构（以下简称“RA”）向移动用户发放的数字证书，为用户在移动终端的交易上提供信息安全保障</text>
            </div>
             <div class="rowMes">
                <text class="border">中金金融认证中心有限公司:</text>
                <text class="noboder">是经国家有关管理机关审批设立的电子认证服务的权威的第三方安全认证机构。</text>
            </div>
        </div> -->
      <!-- </scroller> -->
    </div>
</template>
<style scoped>
.ht{
    position: fixed;
    bottom: 0px;
    width: 750px;
    /* height: 1334px; */
}
.border{
    font-size: 28px;
    font-weight: bold;
}
.noboder{
    font-size: 26px;
}
.rowMes{
    flex-direction: row;
}
.contain{
    background-color: rgb(255, 255, 255);
    height: 1334px;
     width: 750px;
}
  .document{
    width: 750px;
  }
.mesTop{
    width: 750px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
}
.mesTop1{
    width: 750px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
}

</style>
<script>
import NavBar from "../components/NavBar.vue";
const modal = weex.requireModule("modal");
const weexConfig = weex.requireModule("weex-config");//ios状态栏
const context = weex.requireModule('context')
export default {
  components: { NavBar },
  data() {
    return {
      fileSrc:"./yundunManage/imgs/message.docx",   //yundunManage文件夹的名字是因为也支持从manager读取, 格式：字符串 如：”./xxxx/xxx.pdf”，用相对路径./的形式，类似repo.json中的path
      fileName:"message.docx",
      fileType:"docx",
      ht:{ width: "750px",height: "1250px"},
      deviceStatusBarHeight:""
    };
  },
  created() {
  },
  mounted(){
    //   this.initDeviceStatusBarHeight();
    //   if(weex.config.env.platform =='iOS'){
    //        this.ht = {width: "750px",height: "1334px"}
    //   }
     
  },
  computed: {
       getTop(){
            let top=this.getPosiScrollerTop();
            return {top:top+'px'}
        }
    // fileHeight: function() {
    //     if(weex.config.env.platform =='iOS'){
    //          weexConfig.statusHeight(data=>{
    //                 this.deviceStatusBarHeight = data;
    //             })
    //         let height = weex.config.env.deviceHeight;
    //         var height1 = height  -100- this.deviceStatusBarHeight;
    //         return height1;
    //     }else{
    //         const { env: { deviceHeight, deviceWidth } } = weex.config;
	// 	    let status_bar_height = context.getDeviceInfo().status_bar_height;
	// 		let statusHeight = status_bar_height * 750 / deviceWidth;
    //         this.deviceStatusBarHeight = statusHeight;
    //         //   const {
    //         //         env: { deviceHeight, deviceWidth }
    //         //     } = weex.config;
    //            var pageHeight = (deviceHeight / deviceWidth) * 750;
    //         let height = pageHeight - this.deviceStatusBarHeight -90;
    //         // var height1 = height;
    //         return height;
    //     }
    // }
  },
  methods: {
   
  }
};
</script>


