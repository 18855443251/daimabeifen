<template>
  <div class="tab">
    <div class="menuItem" :style="{width:itemWidth}" v-for="(item,key) in menuList" :key="key" @click="JumpTo(item.url)">
      <image class="image" :src="item.src"></image>
      <text class="title">{{item.name}}</text>
    </div>
  </div>
</template>

<style scoped>
.tab {
  width: 710px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-left: 20px;
  padding-top: 20px;
  padding-bottom: 4px;
  /* padding-left: 19px;
  padding-right: 19px; */
}

.menuItem {
  align-items: center;
  padding-top: 20px;
  /* padding-bottom: 30px; */
}

.image {
  width: 62px;
  height: 62px;
  margin-bottom: 18px;
}

.title {
  font-size: 26px;
  color: #fff;
}
</style>

<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const qrscan = weex.requireModule("weexqrscan");
const wjalert = weex.requireModule("weex-alert");

export default {
  props: ["jsonurl"],
  data() {
    return {
      tabWidth: 710,
      menu_columns: 4,
      menuList: []
    };
  },
  computed: {
    itemWidth: function() {
      return this.tabWidth / this.menu_columns;
    }
  },
  methods: {
    JumpTo(url) {
      // context.launchStage(url);  
      if(url=="saoyisao") {
        qrscan.scanQRcode(data => {
          var qrDate = JSON.parse(data);
          // var obj=JSON.parse(qrDate.result);
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
                    } else if(obj.flag=="receipt"){
                      modal.alert({
                        message:"此回单真实有效"
                      })
                    }else{
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
      }else{
        this.gotoStage(url, true);
      }
    },
    getMenu() {
      stream.fetch(
        {
          method: "GET",
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            var tmp = response.data.data;

            this.menu_columns = tmp.columns;
            this.menuList = tmp.menuList;
          }
        },
        () => {}
      );
    }
  },
  created() {
    this.getMenu();
  }
};
</script>
