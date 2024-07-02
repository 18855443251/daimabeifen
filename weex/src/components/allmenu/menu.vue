<template>
  <div class="container">
    <div class="wrap" v-for="(item,key) in allmenuList" :key="key">
      <div class="main">
        <text class="title_big">{{item.title}}</text>
        <div class="tab">
          <template v-for="(item,key) in item.menuList">
            <div @click="JumpTo(item)" :key="key" class="menuItem" :style="{width:itemWidth,paddingTop:paddingTop+'px'}" v-if="item.platform=='all'||item.platform==platform">
              <image class="image" :src="item.src" :style="{width:imgWidth+'px',height:imgHeight+'px'}"></image>
              <text class="title">{{item.name}}</text>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule('modal');
const qrscan = weex.requireModule("weexqrscan");
export default {
  props: {
    jsonurl: {
      type: String,
      default: "allmenu.json"
    }
  },
  data() {
    return {
      tabWidth: 750,
      menu_columns: 4,
      menuList: [],
      allmenuList: [],
      platform: WXEnvironment.platform.toLowerCase(),
      imgWidth: "50",
      imgHeight: "50",
      paddingTop: "30",
      jsonBaseUrl: "./json/allmenu/"
    };
  },
  computed: {
    itemWidth: function() {
      return this.tabWidth / this.menu_columns;
    }
  },
  methods: {
    JumpTo(item) {
      var url = item.url;
      if (item.isNotRecord) {
        this.gotoStage(url, true);
      } else if(item.url=="saoyisao") {
        qrscan.scanQRcode(data => {
          var qrDate = JSON.parse(data);
          if(qrDate.type=="1"){
            context.launchStage("main.enterprisesCard");
          } else {
            try {
                var obj=JSON.parse(qrDate.result);
                if(typeof obj == 'object' && obj){
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
                  } else {
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
      }else if(url=="main.alreadyReconciliation"){
        context.sessionSetString("alreadyReconciliation","1")
        context.launchStage("main.alreadyReconciliation");
      } else {
        this.gotoStage(url);
      }
    },
    getMenu() {
      stream.fetch(
        {
          method: "GET",
          url: this.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;
            this.menu_columns = tmp.columns;
            this.allmenuList = tmp.allmenuList;
            if (tmp.imgSize) {
              this.imgWidth = tmp.imgSize.imgWidth;
              this.imgHeight = tmp.imgSize.imgHeight;
            }
            if (tmp.paddingTop) {
              this.paddingTop = tmp.paddingTop;
            }
          }
        }
      );
    }
  },
  created() {
    this.getMenu();
  }
};
</script>

<style scoped>
.container {
  width: 750px;
  margin-bottom: 140px;
}
.wrap {
  /* margin-top: 16px; */
  margin-bottom: 18px;
}
.main {
  background-color: #ffffff;
}
.tab {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 30px;
}
.menuItem {
  align-items: center;
  width: 187.5px;
}
.image {
  margin-bottom: 15px;
}
.title {
  font-size: 26px;
  color: #555555;
  text-align: center;
  /* margin-top: 20px; */
}
.title_big {
  font-size: 32px;
  color: #333;
  font-weight: bold;
  padding-top: 30px;
  padding-left: 30px;
}
</style>
