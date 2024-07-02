<template>
  <div class="container">
    <div class="topcontent">
      <text class="title">附近网点</text>
      <image class="righticon" :src='righticon' @click="SurrAmap"></image>
    </div>
    <div>
      <weex-amap ref="map" @onReceiveLocation="ReceiveLocation" class="map_div" id="map2017" :sdkKey="sdkKey" :compass="false" :zoom="13" :center="pos" :geolocation="true" :myLocationEnabled="true" :showMyLocation="true">
        <weex-amap-marker :position="nearnetpos" :title="bankinfo.Address1"></weex-amap-marker>
      </weex-amap>
      <div class="mapinfo">
        <text class="mapName">{{bankinfo.Address1}}</text>
        <text class="mapadr">{{bankinfo.Address2}}</text>
      </div>
    </div>
    <div class="menu_div">
      <div class="item_div" @click="callPhone">
        <image class="menu_img" :src="phoneimg"></image>
        <text class="menu_text">电话</text>
      </div>
      <div class="item_div" @click="bankroute">
        <image class="menu_img" :src="routeimg"></image>
        <text class="menu_text">路线</text>
      </div>
      <div class="item_div_right" @click="getBankResNum">
        <image class="menu_img" :src="numberimg"></image>
        <text class="menu_text">网点预约</text>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  background-color: #ffffff;
  margin-top: 16px;
  margin-bottom: 25px;
  padding-left: 30px;
  padding-right: 30px;
}
.title {
  height: 120px;
  line-height: 120px;
  font-size: 38px;
  color: #222222;
  font-weight: 600;
}
.img_row {
  height: 250px;
  /* flex-direction: row; */
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
  background: #313131;
}
.menu_img {
  width: 36px;
  height: 36px;
}
.hot_img {
  width: 250px;
  height: 250px;
  flex: 0.5;
}
.map_div {
  height: 300px;
  flex: 1;
  justify-content: space-around;
}
.mapName {
  font-size: 35px;
  color: #313131;
}
.mapadr {
  font-size: 25px;
  color: #999999;
}
.menu_div {
  flex-direction: row;
  padding: 10px;
}
.topcontent {
  flex-direction: row;
  background-color: #ffffff;
  padding-top: 8px;
  height: 106px;
  justify-content: space-between;
  align-items: center;
}
.righticon {
  width: 30px;
  height: 30px;
}
.item_div {
  height: 60px;
  border-right-width: 1px;
  border-right-color: #ececec;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.item_div_right {
  height: 60px;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.menu_text {
  font-size: 26px;
  color: #666666;
  margin-left: 10px;
}
.mapinfo {
  height: 150px;
  justify-content: space-around;
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
}
</style>
<script>
const stream = weex.requireModule("stream");
const nav_map = weex.requireModule("nav-map");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const authority = weex.requireModule("authority");
export default {
  props: ["jsonurl"],
  data() {
    return {
      phoneimg: "./imgs/tab_home/amap/phone.png",
      numberimg: "./imgs/tab_home/amap/Tomakeanappointment.png",
      routeimg: "./imgs/tab_home/amap/route.png",
      righticon: "./imgs/tab_home/amap/right.png",
      sdkKey: {
        ios: "219946f347c3217f3f071909c6a079ab",
        // 442130dd2ab50da0321a2a5f3177227e
        android: "d7b9722608ee283a7b951c6fc4edbf34"
      },
      pos: [],
      locationinfo: {},
      bankinfo: {},
      nearnetpos: [],
      couldLocation: true,
      bankList: []
    };
  },
  methods: {
    ReceiveLocation(data) {
      if (!this.couldLocation) {
        return;
      }
      if (data != null) {
        if (data.result == "success") {
          this.couldLocation = false;
          this.locationinfo = data.data;
          if (!this.locationinfo) {
            this.pos = [120.642747, 31.142998];
          } else if (
            this.locationinfo.position.toString() == [0, 0].toString()
          ) {
            this.pos = [120.642747, 31.142998];
          } else {
            this.pos = this.locationinfo.position;
          }
          this.setSession("location", JSON.stringify(this.locationinfo));
          this.getNearBank();
        } else {
          this.couldLocation = false;
          this.locationinfo = { position: [120.642747, 31.142998] };
          this.pos = this.locationinfo.position;
          this.setSession("location", JSON.stringify(this.locationinfo));
          this.getNearBank();
        }
      }
    },
    //拨打电话
    callPhone() {
      authority.isOpenLocation(data => {
        if (data == "Y") {
          context.launchStage("ext:tel:" + this.bankinfo.Phone);
        }
      });
    },
    //地图路线
    bankroute() {
      authority.isOpenLocation(data => {
        if (data == "Y") {
          var mapinfo = {
            origin: {
              lat: this.pos[1],
              lon: this.pos[0],
              name: "我的位置"
            },
            destination: {
              lat: this.bankinfo.Lat,
              lon: this.bankinfo.Lon,
              name: this.bankinfo.Address2
            },
            mode: "0"
          };
          nav_map.openMap(JSON.stringify(mapinfo));
        }
      });
    },
    getNearBank() {
      const params = {
        Latitude: this.pos[1],
        Longitude: this.pos[0]
      };
    },
    SurrAmap() {
      if (this.pos == [] || this.bankList == []) {
        return;
      }
      this.setSession("enterFlag", "1"); //进入周边网点入口判断标识
      this.launchStage("main.srroundMap");
    },
    recentAmap() {
      if (this.pos == [] || this.nearnetpos == []) {
        return;
      }
      var params = {
        bankList: this.nearnetpos,
        pos: this.pos
      };
      this.jumpBundle("recentAmap", params);
    },
    //预约取号
    getBankResNum() {
      authority.isOpenLocation(data => {
        if (data == "Y") {
          if (this.bankinfo == {}) {
            return;
          }
          var params = {
            DeptId: this.bankinfo.DeptId,
            GroupId: this.bankinfo.GroupId,
            DistanceFormat: this.bankinfo.DistanceFormat
          };
          this.RecordMenu("main.bankReserveNum");
          this.launchStage(
            "main.bankReserveNum?params=" + JSON.stringify(params)
          );
        }
      });
    }
  },
  created() {},
  mounted() {
    authority.isOpenLocation(data => {
      if (data == "Y") {
        this.ReceiveLocation();
      }
    });
  }
};
</script>
