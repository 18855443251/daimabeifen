<template>
  <!-- 网点省市选择 -->
    <div class="contain">
      <wxc-popup popup-color="white" :show="isBottomShow" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom" height="819">
        <div class="select_city">
          <div class="select_city_header">
            <text class="district-title">地区选择</text>
            <image src="./imgs/cancel@3x.png" class="cancelImg" @click="cancel" />
          </div>
          <div class="hasSelectedTitle">
            <text class="hasSelectedTitleText" :class="[showChooseCity=='0'?'activeSelectedTitle':'']" @click="showSelePro">{{ProvinceName|Name}}</text>
            <text class="hasSelectedTitleText1" :class="[showChooseCity=='1'?'activeSelectedTitle1':'']" @click="showSeleCity" v-if="showChooseCity=='1'">{{cityName|Name}}</text>
          </div>
          <div class="select_city_content">
              <list show-scrollbar="false" class="select_city_list"  v-if="showChooseCity=='0'">
                <cell  v-for="(item, index) in proviceList"  :key="index" class="select_city_item" @click="selectprovince(index,item)">
                  <text class="select_city_item_text">{{ item.Name }}</text>
                </cell>
              </list>
              <list show-scrollbar="false" class="select_city_list" v-if="showChooseCity=='1'">
                <cell v-for="(item ,index) in cityList" :key="index" class="select_city_item" @click="selectcity(index,item)">
                  <text class="select_city_item_text">{{ item.Name }}</text>
                </cell>
              </list>
          </div>
        </div>
      </wxc-popup> 
     </div>
</template>
<script>
import { WxcPopup } from "weex-ui";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
import filters from './../filters'
export default {
  props:[
        "isBottomShow"
    ],
  components: { WxcPopup },
  data() {
    return {
      selectindex: 0,
      selectcityindex: 0,
      proviceList: [
        {
          Name:"北京市",
           Name:"山东省"
        }
      ], //当前省列表
      cityList: [ {
          Name:"北京市",
          Name:"日照",
        }], //当前市列表
      selectplace: "",
      showChooseCity:0,//展示选择省或者市的展示的flag
      ProvinceName:"请选择",
      cityName:"请选择"
    };
  },
  created() {
    this.getProvince();
  },
  methods: {
    cancel(){
      this.$emit("popupOverlayBottomClick", {});
    } ,
    popupOverlayBottomClick(){
         this.$emit("popupOverlayBottomClick", {});
     },
    showSelePro(){
      this.showChooseCity='0';
      this.ProvinceName = "请选择";//重置省市
    },
    showSeleCity(){
      this.showChooseCity='1';
    },
    //根据省份获取城市数据
    selectprovince(num, item) {
      this.ProvinceName = item.Name;
      this.cityName = "请选择";
      this.showChooseCity='1';
      this.selectindex = num;
      const params = {
        ProvinceCode: item.Value
      };
      this.post("/eweb/CityListQry.do", params, response => {
        this.cityList = response.data.CityList;
      });
    },
    //获取省份数据
    getProvince() {
      this.post("/eweb/ProvinceListQry.do", {}, response => {
        this.proviceList = response.data.ProvinceList;
      });
    },
    selectcity(num, item) {
      this.cityName = item.Name;
      this.selectcityindex = num;
      this.selectplace =
        this.proviceList[this.selectindex].Name +
        " " +
        this.cityList[this.selectcityindex].Name +
        " " +
        this.cityList[this.selectcityindex].Value +
        " " +
        this.proviceList[this.selectindex].Value;
      this.$emit("haveselectedaddress", this.selectplace);
    }
  }
};
</script>
<style scoped>
.contain{
  width: 750px;
}

.select_city {
        width: 750px;
        background-color: #fff;
    }
    .select_city_header {
        display: flex;
        flex-direction: row;
        height: 100px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
    }
    .district-title{
      width: 750px;
      line-height: 100px;
      text-align: center;
      font-size:36px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
    }
    .cancelImg{
        width: 35px;
        height: 35px;
        position: absolute;
        right: 30px;
        top: 32px;
    }
    .hasSelectedTitle{
        flex-direction: row;
        /* align-items:flex-end; */
        height: 100px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
        padding-left: 40px;
        padding-right: 40px;
    }
    .hasSelectedTitleText{
       width: 180px;
        text-align: center;
        /* text-align: center; */
        height: 100px;
        line-height: 100px;
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .hasSelectedTitleText1{
      margin-left: 20px;
       width: 180px;
        text-align: center;
        /* text-align: center; */
        height: 100px;
        line-height: 100px;
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .activeSelectedTitle{
        height: 100px;
        line-height: 100px;
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        border-bottom-width: 6px;
        border-bottom-color: #F3395B;
    }
     .activeSelectedTitle1{
       margin-left: 20px;
        height: 100px;
        line-height: 100px;
        font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        border-bottom-width: 6px;
        border-bottom-color: #F3395B;
    }
    .select_city_content {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 40px;
        padding-top: 30px;
    }

    /* .select_city_item {
        width: 140px;
        height: 80px;
        line-height: 80px;
    } */
    .select_city_item_text{
         width: 660px;
         height: 70px;
         line-height: 70px;
         font-size:30px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(156,156,156,1);
    }
    .select_city_list {
        width: 660px;
        height: 580px;
       margin-bottom: 40px;
    }


.all {
  background-color: rgba(0, 0, 0, 0.65);
  width: 750px;
  height: 1334px;
}
.list-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  z-index: 10;
  background-color: black;
  opacity: 0.65;
}
.select-item {
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #ffffff;
  align-items: center;
  justify-content: space-around;
  height: 580px;
  width: 750px;
  overflow-y: auto;
  position: fixed;
  left: 0px;
  bottom: 80px;
}
.listitem {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 250px;
  height: 550px;
  flex-grow: 1;
}
.cityitem {
  color: gray;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 32px;
}
.basebutton {
  color: white;
  background-image: linear-gradient(
    to right,
    rgb(251, 93, 122),
    rgb(230, 2, 44)
  );
  font-size: 32px;
  height: 80px;
  width: 750px;
  line-height: 80px;
  text-align: center;
  position: fixed;
  left: 0px;
  bottom: 0px;
}
</style>
