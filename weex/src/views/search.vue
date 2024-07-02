<template>
  <div class="container">
    <div class="row">
      <div class="title_left" @click="doIt()">
        <image class="back_img" :src="backimg"></image>
      </div>
      <div class="searchdiv">
        <image class="searchimg" :src="searchimg"></image>
        <input class="searchinput" @input="getKeyPd" placeholder="请输入关键字" ref='input' v-model="value">
      </div>
      <text class="cancel" @click="delValue()">清空</text>
    </div>
    <scroller>
      <div class="main" v-if="!keyPd">
        <div class="" v-if="menuSearchList.length>0">
          <div class="search-title">
            <text class="search-h3">历史搜索</text>
            <div class="delbox"  @click="clearConfirm" v-if="delImage">
              <image class="delimg" :src="delimg"></image>
            </div>
            <text class="cancel" v-else>清空历史</text>
          </div>
          <div class="hot-row">
            <div class="hot-search" v-for="(item,index) in menuSearchList" :key="index" @click="JumpTo(item)" @longpress="pressDel(index)" >
              <text class="items">{{item.name}}</text>
            </div>
          </div>
        </div>
        <div class="hotBank">
          <text class="search-h3">热门搜索</text>
          <div class="hot-row">
            <div class="hot-search" v-for="(item,key) in hotSearchList" :key="key" @click="JumpTo(item)">
              <text class="items">{{item.name}}</text>
            </div>
          </div>
        </div>
      </div>
      <div v-if="keyPd" class="serach-box">
        <text class="prompt">为您找到以下结果</text>
        <div class="bottomcontent" v-for="(item,key) in searchList" :key="key" @click="JumpTo(item)">
          <text class="title">{{item.name}}</text>
        </div>
      </div>
    </scroller>
  </div>
</template>
<style scoped>
.container {
  background-color: #ffffff;
}
.main{
  margin-left: 30px;
}
.row {
  padding-top: 80px;
  padding-left: 30px;
  padding-right: 25px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgb(234,234,234);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.big_bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.title_left {
  width: 60px;
  height: 36px;
}
.back_img {
  width: 42px;
  height: 42px;
}
.searchdiv {
  width: 550px;
  height: 60px;
  background-color: rgb(247,247,247);
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  align-content: space-around;
}
.searchimg {
  width: 25px;
  height: 25px;
  margin-left: 25px;
  margin-right: 20px;
}
.searchinput {
  width: 465px;
  height: 60px;
  font-size: 26px;
  color: #9c9c9c;
  outline: none;
  placeholder-color: #9c9c9c;
  background-color: rgb(247,247,247);
}
.cancel {
  font-size: 28px;
  color: #E6022C;
}
.delbox{
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.delimg{
  width: 30px;
  height: 30px;
}
.nosearch-box {
  margin-top: 120px;
  justify-content: center;
  align-items: center;
}
.nosearch-img {
  width: 92px;
  height: 92px;
}
.nosearch-text {
  margin-top: 34px;
  font-size: 30px;
  color: #999999;
}
.serach-box {
  padding-left: 30px;
}
.bottomcontent {
  width: 750px;
  height: 100px;
  border-top-width: 1px;
  border-top-color: #ededed;
  justify-content: center;
}
.prompt {
  width: 750px;
  height: 100px;
  line-height: 100px;
  font-size: 28px;
  color: #999999;
}
.title {
  font-size: 28px;
  color: #222222;
}
.hotBank{
  background: #ffffff;
}
.search-h3 {
  line-height: 100px;
  color: #333;
  font-size: 30px;
  font-weight: bold;
}
.hot-row{
  flex-direction: row;
  flex-wrap: wrap;
}
.search-title{
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
}
.hot-search{
}
.items{
  width: 145px;
  height: 65px;
  margin-right: 28px;
  margin-bottom: 30px;
  line-height: 65px;
  text-align: center;
  background-color: rgb(248,248,247);
  border-radius: 32px;
  font-size: 26px;
  color: #555;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule('modal');
const storage = weex.requireModule("storage");
const qrscan = weex.requireModule("weexqrscan");

export default {
  data() {
    return {
      searchimg: "./imgs/search/search.png",
      delimg: "./imgs/search/del.png",
      nosearchimg: "./imgs/search/nosearch.png",
      backimg: "./imgs/allmenu/back@3x.png",
      delImage: true,
      menuSearchList: [
      ],
      hotSearchList: [
        {
          "name": "代发工资",
          "url": "main.payroll",
          "key": "代发工资|daifagongzi|dfgz",
          "platform": "all"
        },
        {
          "name": "银企对账",
          "url": "main.reconciliation",
          "key": "银企对账|yinqiduizhang|yqdz",
          "platform": "all"
        },
        {
          "name": "云盾管理",
          "url": "main.securitySetting",
          "key": "云盾管理|yundunguanli|ydgl",
          "platform": "all"
        },
        {
          "name": "行号查询",
          "url": "main.bankSearch",
          "key": "行号查询|hanghaochaxun|hhcx",
          "platform": "all"
        },  
        {
          "name": "网点查询",
          "url": "main.NetworkQuery",
          "key": "网点查询|wangdianchaxun|wdcx",
          "platform": "all"
        },
        {
          "name": "扫一扫转账",
          "url": "saoyisao",
          "key": "扫一扫转账|saoyisaozhuanzhang|syszz",
          "platform": "all"
        },
        {
          "name": "企业名片",
          "url": "main.enterprisesCard",
          "key": "企业名片|qiyemingpian|qymp",
          "platform": "all"
        },
      ],
      keyPd: "",
      menuList: [],
      platform: WXEnvironment.platform.toLowerCase(),
      value: "",
    };
  },
  created() {
    // this.menuSearchList = JSON.parse(context.secureGetString("menuSearchList").replace(/\"/g, "'"))  
    //this.getoldlist(); 
    storage.getItem('lastfunction', event => {
            this.menuSearchList = JSON.parse(event.data);
        })    
    this.getMenu();
  },
  mounted() {
    // this.$refs["input"].focus();
  },
  computed: {
    searchList() {
      return this.menuList.filter(item => {
        return (
          item.key.match(this.keyPd) &&
          (item.platform == "all" || item.platform == this.platform)
        );
      });
    }
  },
  methods: {
    clearConfirm() {
      this.delImage = false;
      wjalert.confirm(
        "确定删除该条历史记录?",
        "确定",
        "取消",
      data => {
        if (data == 'Y') {         
          this.menuSearchList = []
          storage.removeItem('lastfunction',event => {
          });
          this.delImage = true;
        } else {
          this.delImage = true;
        }
      });     
    },
    getKeyPd(event) {
      this.keyPd = event.value;
    },
    //取消按钮
    delValue(){
      this.value = '';
    },
       //点击返回
    doIt() {
      this.goBack();
    },
    //获取所以菜单
    getMenu() {
      // this.menuSearchList = context.sessionGetString('menuSearchList');
      stream.fetch(
        {
          method: "GET",
          url: "/weex/json/system/search.json",
          type: "json"
        },
        res => {
          this.menuList = res.data.data;         
        }
      );
    },
    pressDel(index){
      wjalert.confirm("是否删除此条记录","确定","取消",data=>{
          if(data == "Y") {
            this.menuSearchList.splice(index,1);
          }
      });
    },
    JumpTo(item) {  
      setTimeout(() => {
        this.menuSearchList.unshift(item);
        this.menuSearchList = [...new Set(this.menuSearchList)];
        if(this.menuSearchList.length>8) {
          this.menuSearchList.pop();
        }
        storage.setItem('lastfunction', JSON.stringify(this.menuSearchList), event => {});
      },200)       
      if(item.url == "saoyisao") {
        qrscan.scanQRcode(data => {
          var qrDate = JSON.parse(data);
          if(qrDate.type=="1"){
            context.launchStage("main.enterprisesCard");
          } else {
            try {
                var obj=JSON.parse(qrDate.result);
                if(typeof obj == 'object' && obj ){
                  if(obj.flag=="1") {
                    wjalert.confirm("确认向该账户转账?","确定","取消",data=>{
                        if(data == "Y") {
                            context.sessionSetString("tansferdata",qrDate.result)
                            context.launchStage("main.FastTrans?flag=scan");
                        }
                      })
                  }else if(obj.flag=="receipt"){
                      modal.alert({
                        message:"此回单真实有效"
                      })
                  }else {
                    modal.alert({
                      message:"暂不支持此类型二维码"
                    })
                  }
                }else{
                    modal.alert({
                      message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                    })
                }
            } catch(e) {
                modal.alert({
                  message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                })
            }
          }
        });
      }else {
        this.gotoStage(item.url);
      }
      
    },
  }
};
</script>
