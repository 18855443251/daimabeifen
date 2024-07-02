<template>
  <div>
    <nav-bar title="已选择" edit="取消"></nav-bar>
    <div class="selectPage">
      <div class="wrapper">
        <div class="wrapper_box">
          <image :src="searchImg" class="search_img" />
          <input
            type="text"
            placeholder="输入户名/账号"
            class="input1"
            v-model="likeName"
            @blur="queryPayeeInfo"
          />
        </div>
      </div>
      <list class="info" :style="{ top: this.getPosiScrollerTop()+100 +'px' }">
        <cell>
          <div
            v-for="(item, index) in $store.state.allPayeeList"
            :key="index"
            class="info_item"
          >
            <div class="item_box_top">
              <div @click="select(index)">
                <image
                  :src="selectImg"
                  class="start_img"
                  v-if="item.select == true"
                />
                <image
                  :src="noSelectImg"
                  class="start_img"
                  v-if="item.select == false"
                />
              </div>
              <text class="info_item_box_title">{{ item.Acname }}</text>
            </div>
            <div class="item_box_bottom">
              <text class="text_state">{{ divieBanks(item.AcNo) }}</text>
            </div>
          </div>
        </cell>
      </list>
     <div class="section_bottom">
        <div class="btn">
        <text class="all" @click="checkAll" v-if="this.selectPageNumber!=this.$store.state.allPayeeList.length">全选</text>
        <text class="all" @click="nocheckAll" v-if="this.selectPageNumber==this.$store.state.allPayeeList.length">取消全选</text>
        <text class="confirm" @click="delete1">删除</text>
      </div>
     </div>
      <!-- <deleteselectpage></deleteselectpage> -->
       <wxc-mask
      height="260"
      width="540"
      border-radius="24"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-animation="hasAnimation4"
      :has-overlay="true"
      :show="isshowdeleteSelectPage"
      :overlay-can-close="false"
    >
      <div class="daoru">
        <text class="daoru_text">确认删除{{selectPageNumber}}位收款人</text>
        <div class="daoru-footer">
          <text class="cancel" @click="cancelPayee">取消</text>
          <div class="daoru_xian"></div>
          <text class="comfirm" @click="comfirmPayee">确定</text>
        </div>
      </div>
    </wxc-mask>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component2.vue";
import { WxcPopup } from "weex-ui";
// import deleteselectpage from "../../../components/deleteSelectPage.vue";
import { WxcMask } from "weex-ui";
const wjalert = weex.requireModule("weex-alert");
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
export default {
  components: { NavBar, WxcPopup, WxcMask},
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      likeName: "",
      // 至少选中一条数据
      hasSelected: false,
      xImg: this.$store.state.imgBaseUrl + "19.png",
      hasAnimation4: true,
      isshowdeleteSelectPage:false,
      selectPageList:[],
    };
  },
  created() {
    this.getPayeeInfo();
  },
   computed: {
    // 已选人数
   selectPageNumber() {
      var sum = 0;
      for (let i in this.$store.state.allPayeeList) {
        // 复选框选中时
        if (this.$store.state.allPayeeList[i].select == true) {
          {
             sum++;
          }
        }
      }
      this.$store.state.selectPageNumber=sum;
      return sum;
    }
  },
  methods: {
    getPayeeInfo() {
      // 获得收款人信息
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
        for (let i in this.$store.state.allPayeeList) {
          this.$set(this.$store.state.allPayeeList[i], "select", false);
        }
      });
    },
    // 输入户名和账号查询收款人信息
    queryPayeeInfo() {
      this.post(
        "/eweb/ActInfoQry.do",
        {
          LikeName: this.likeName
        },
        response => {
          this.$store.state.allPayeeList = response.data.List;
          for (let i in this.$store.state.allPayeeList) {
            this.$set(this.$store.state.allPayeeList[i], "select", false);
          }
        }
      );
    },
    // 选择复选框
    select(index) {
      this.$store.state.allPayeeList[index].select = !this.$store.state
        .allPayeeList[index].select;
      this.$store.state.allPayeeList.splice(
        index,
        1,
        this.$store.state.allPayeeList[index]
      );
    },
    // 取消全选
    checkAll(){
      for (let i in this.$store.state.allPayeeList) {
        this.$store.state.allPayeeList[i].select = true;
        this.$store.state.allPayeeList.splice(
          i,
          1,
          this.$store.state.allPayeeList[i]
        );
      }
      this.selectPageNumber= this.$store.state.allPayeeList.length;
    },
    nocheckAll() {
      for (let i in this.$store.state.allPayeeList) {
        this.$store.state.allPayeeList[i].select = false;
        this.$store.state.allPayeeList.splice(
          i,
          1,
          this.$store.state.allPayeeList[i]
        );
      }
      this.selectPageNumber= 0;
    },
    // 删除按钮
    delete1() {
      var arr = [];
      for (let i in this.$store.state.allPayeeList) {
        // 复选框选中时
        if (this.$store.state.allPayeeList[i].select == true) {
          this.hasSelected = true;
          var payeeObj = {
            Acname: this.$store.state.allPayeeList[i].Acname,
            AcNo: this.$store.state.allPayeeList[i].AcNo
          };
          arr.push(payeeObj);
        }
      }
      this.selectPageList = arr;
      if(this.$store.state.allPayeeList.length==0){
      }else if (!this.hasSelected) {
        wjalert.alert("请至少选择一条数据","确定",data=>{});
      } else {
        // 展示删除弹框
        this.isshowdeleteSelectPage = true;
      }
    },
    cancelPayee() {
      this.isshowdeleteSelectPage = false;
    },
    comfirmPayee() {
      this.post(
        "/eweb/DeletActInfo.do",
        {
          UpdPayeelist: this.selectPageList
        },
        response => {
          if (response.data.Deleflag == "1") {
           wjalert.alert("删除成功","确定",data=>{
             this.$store.state.bgBolG = 0;
             this.jump("/myPayrollRegister");
             })
                 this.isshowdeleteSelectPage = false;
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.selectPage {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  margin-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 20px;
}
.wrapper_box{
  height: 60px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
.input1 {
  width: 600px;
  height: 56px;
  line-height: 58px;
  outline: none;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
  margin-left: 17px;
}
.search_img {
  width: 25px;
  height: 25px;
  margin-left: 29px;
}
.start_img {
  width: 30px;
  height: 30px;
  margin-left: 24px;
}
.info {
  position: fixed;
  bottom:88px;
  left: 0;
  right:0;
  background-color: rgba(250, 250, 250, 1);
}
.info_item {
  height: 150px;
  background: rgba(255, 255, 255, 1);
  border-width: 1px;
  border-color: rgba(245, 245, 245, 1);
  border-radius: 12px;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 1);
  margin-left: 30px;
  margin-right: 30px;
}
.item_box_top {
 display: flex;
 flex-direction: row;
 margin-top: 30px;
 align-items: center;
}
.item_box_bottom {
  padding-left: 78px;
  margin-top: 18px;
}
.info_item_box_title {
  margin-left: 24px;
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.all {
  width: 260px;
  height: 88px;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  opacity: 0.5;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.confirm {
  width: 490px;
  height: 88px;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.text_state {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.section_bottom{
  position: fixed;
  bottom:0px;
  left:0;
  right:0;
}
.daoru {
    width: 540px;
    height: 260px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 24px;
  }
  .daoru_text {
    width: 540px;
    height: 172px;
    line-height: 172px;
    text-align: center;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234, 234, 234, 1);
    font-size: 32px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
  }
  .daoru-footer {
    display: flex;
    flex-direction: row;
    flex-direction: row;
    align-items: center;
  }
  .cancel {
    width: 269px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: rgba(0, 122, 255, 1);
  }
  .comfirm {
    width: 269px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: rgba(0, 122, 255, 1);
  }
  .daoru_xian {
    width: 2px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    background-color: rgba(234, 234, 234, 1);
  }
</style>
