<template>
  <div>
    <nav-bar :title="title"></nav-bar>
    <div class="chooseAccountBook">
      <div class="search">
        <image class="searchimg" :src="searchimg"></image>
        <input type="text" class="inputtext" v-model="searchInput" placeholder="请输入账户号或账户名称" @blur="queryKey"/>
      </div>
      <div class="text_gray"></div>
    </div>
      <scroller>
        <div class="content">
          <div
            class="content_detail"
            v-for="(item, index) in acbList"
            :key="index"
            @click="chooseAccoutBook(item)"
          >
          <div class="content_detail_left">
              <text class="AcName">{{ item.AsAcno}}</text>
            <text class="AcName text_right">{{ item.AsAcname}}</text>
          </div>
            <image class="moreimg" :src="moreimg"></image>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import NavBar from "../../../components/titlebar_component.vue";
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
export default {
  components: { NavBar },
  data() {
    return {
      title: "选择账簿",
      searchimg: this.$store.state.imgBaseUrl + "14.png",
      moreimg:  this.$store.state.imgBaseUrl + "25.png",
      // 选择账薄列表
      acbList: [],
      // 输入框账户号和账户名称
     searchInput: ""
    };
  },
  created() {
    this.queryAccountBookInfo();
  },
  methods: {
    // 输入框模糊查询
    queryKey(){
     this.post(
        "/eweb/TransferAcctBookQry.do",
        {
            KeyWord:this.searchInput,
            // 付款方账号
            PayerAcNo: this.$store.state.AcNo1,
        },
        response => {
          // 选择账薄列表
          this.acbList=response.data.List;
        }
      );
    },
    // 查询账薄
     queryAccountBookInfo() {
      this.post(
        "/eweb/TransferAcctBookQry.do",
        {
            KeyWord:this.searchInput,
            // 付款方账号
            PayerAcNo: this.$store.state.AcNo1,
        },
        response => {
          // 账薄号列表
          this.acbList=response.data.List;
        }
      );
    },
    chooseAccoutBook(item) {
      // 代发录入页账薄号
     this.$store.state.bookAcNo=item.AsAcno;
      // 代发录入页账薄名  
     this.$store.state.bookAcName =item.AsAcname;
     this.$store.state.isshowBook=true;
    //  跳到代发录入页
      this.jump("/selectpaymentAccount");
    },
  }
};
</script>
<style scoped>
.chooseAccountBook{
  background-color: rgb(255, 255, 255,1);
}
.searchdiv {
  height: 90px;
  align-items: center;
  flex-direction: row;
  border-bottom: 20px solid rgba(249, 249, 249, 1);
}
.search {
  height: 60px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
}
.inputtext {
  width: 600px;
  height: 56px;
  line-height: 58px;
  outline: none;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
  margin-left: 17px;
}
.searchimg {
  width: 25px;
  height: 25px;
  margin-left: 29px;
}
.moreimg {
  width: 14px;
  height: 24px;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
  margin-top: 20px;
}
.content_detail {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234,234,234,1);;
  height: 110px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
}
.AcName {
font-size:30px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(51,51,51,1);
}
.content_detail_left{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.text_right{
  margin-left: 40px;
}
</style>
