<template>
  <div>
    <nav-bar title="选择账簿"></nav-bar>
    <!-- <div class="searchTopBox">
        <div class="searchInputBox" :style="searchInput?hasInputSearch:''">
            <image class="searchIcon" src="./imgs/searchIcon.png"/>
            <input type="text" class="searchInput" v-model="searchInput" placeholder="请输入账簿号和账簿名称" @blur="queryActBook">
        </div>
        <text v-if="searchInput" class="cancelSearch" @click="cancelSearch">取消</text>
    </div> -->
    <div class="searchTopBox">
        <div class="searchInputBox" >
            <image class="searchIcon" src="./imgs/searchIcon.png"/>
            <input type="text" :class="[searchInput?'hasSearchInput':'emptySearchInput']" v-model="searchInput" placeholder="请输入账簿号和账簿名称"  @blur="queryActBook()" />
        </div>
        <text v-if="searchInput" class="cancelSearch" @click="cancelSearch">取消</text>
    </div>
    <SplitDiv />
    <scroller>
      <div>
      <div class="listItem" @click="selectbook(item)" v-for="(item, index) in transferPayerAcctBookList" :key="index">
        <div class="leftContent">
            <text class="txt1">{{item.AsAcno}}</text>
            <text class="txt2">{{item.AsAcname}}</text>
        </div>
        <image :src="imgarrow" class="account_box_img" />
      </div>
    </div>
    </scroller>
  </div>
</template>
<script>
  const modal = weex.requireModule("modal");
  import NavBar from "@/components/titlebar_component.vue";
  import SplitDiv from "../../components/splitDiv.vue";
  export default {
    components: { NavBar, SplitDiv},
    data() {
      return {
        isSearch:true,
        searchInput:'',
        searchInput1:false,
        imgarrow: "./imgs/greyRightArrow.png",
        backflag:'',
        transferPayerAcctBookList:[],
        bookList: [
          // {AsAcno:'00000',AsAcname:'总账簿'},
          // {AsAcno:'000000001',AsAcname:'分公司一级账簿分公司一级账簿'},
          // {AsAcno:'000000002',AsAcname:'分公司一级账簿2'},
          // {AsAcno:'000000003',AsAcname:'分公司二级账簿'},
          // {AsAcno:'99999',AsAcname:'待分清账簿'},
        ],
      };
    },
    created() {
      this.backflag=this.$route.query.backflag;
      this.queryActBook();
    },
    methods: {
      //查询账户多级账簿
      selectbook(item){
        this.$store.state.transferSubmitData.selectAcctBookItem=item;//选中的多级账簿
        if(this.backflag){
          this.goBack();
        }else{
          this.$router.go(-2);
        }
      },
      cancelSearch(){
        this.isSearch = true;
        this.searchInput='';
        this.queryActBook();
      },
      queryActBook(){
          this.transferPayerAcctBookList=[];
          var params={
              KeyWord:this.searchInput.replace(/\s/g,''),
              PayerAcNo:this.$store.state.transferSubmitData.PayerAcNo,
          }
          this.post("/eweb/TransferAcctBookQry.do",params, response => {
              if(response.data.List&&response.data.List.length!=0){
                this.transferPayerAcctBookList=response.data.List;
                this.$store.state.transferSubmitData.PayerOpenFlag='Y';
              }else{
                this.transferPayerAcctBookList=[];
                this.$store.state.transferSubmitData.PayerOpenFlag='';
              }
          });
      }
    }
  };
</script>
<style scoped>
  input:focus{
    outline: none;
  }
  .listItem {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 720px;
    margin-left: 30px;
    border-bottom-color: rgba(234,234,234,1);;
    border-bottom-width: 1px;
    height: 110px;
    padding-right: 35px;
  }
  .leftContent{
    flex-direction:row;
    align-items:center;
  }
  .txt1 {
    margin-right: 50px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }

  .txt2 {
    width: 400px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .account_box_img {
    width: 14px;
    height: 24px;
  }
   .searchTopBox{
        margin-top:20px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .searchInputBox{
        /* width:690px; */
        height:60px;
        border-radius:8px;
        border-width: 1px;
        border-color:#DDDDDD;
        align-self: center;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-left: 29px;
    }
    .searchIcon{
        width: 25px;
        height:25px;
        margin-right: 17px;
    }
    .emptySearchInput{
        width:600px;
        height:50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(170,170,170,1);
    }
    .hasSearchInput{
        width:500px;
        height:50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(170,170,170,1);
    }
    .cancelSearch{
        color: #E6022C;
    }
</style>