<template>
  <div class="editaccount">
       <!-- <nav-bar title="修改收款人"></nav-bar> -->
       
     <nav-bar :title="title"></nav-bar>
        <div class="headerInfo">
           <div class="headerBorder">
                <text class="accountuser">{{$store.state.bankCarsInfo.PayeeAcName}}</text>
                <text class="accountbank">{{$store.state.bankCarsInfo.BankName}}</text>
                <div class="accountcars">
                   <image :src="imgdata($store.state.bankCarsInfo.BankCode,$store.state.bankCarsInfo.BankName)" class="iconurl"/>
                   <text class="cardnums">{{divieBanks($store.state.bankCarsInfo.PayeeAcNo)}}</text>
                </div>
           </div>
       </div>
       <div class="all"></div>
       <div class="netinfo" v-if="isMyBank">
            <div class="netaddr" >
                <text class="addrtext">网点省市：</text>
                <div class="serachDiv">
                   <text class="nettextt">{{address}}</text>
                   <!-- <image class="selectImg" src="./imgs/rightarrow_icon@3x.png"></image> -->
                </div>
            </div>
            <div class="netaddr" >
                <text class="addrtext">网点名称：</text>
                 <div class="serachDiv">
                    <text class="nettextt" :style="{'line-height':isLineHeight+'px'}" >{{dept}}</text>
                </div>
               
            </div>
            <div class="netaddr">
                <text class="addrtext">网点行号：</text>
                <text class="nettextt">{{deptid}}</text>
            </div>        
       </div>
      <div class="editalis">
            <text class="aliastext">短信通知：</text>
            <text class="aliasinput">{{Phone}}</text>
      </div>
      <div class="editalis">
            <text class="aliastext">账户别名：</text>
            <text class="aliasinput">{{aliasname}}</text>
      </div>
      
      <!-- <div class="btn" >
        <text class="btnText">确定</text>
     </div> -->
     
      <select-address class="list-mask" :isBottomShow="isselectaddress" @popupOverlayBottomClick="popupOverlayBottomClick" @haveselectedaddress="selectedaddress">
      </select-address>
  </div>
</template>
<script>
import NavBar from "../components/NavBar.vue"
import SelectAddress from "../components/select_address.vue"
const modal = weex.requireModule("modal")
const stream = weex.requireModule("stream")
const context =weex.requireModule('context')
const wjalert = weex.requireModule("weex-alert")
const picker = weex.requireModule("weex-picker");
export default {
    components:{ NavBar,SelectAddress},
    data () {
      return {
        isMyBank:false,
        title:"收款人详情",
        aliasname:this.$store.state.bankCarsInfo.PayeeacAlias,
        Phone:this.$store.state.bankCarsInfo.Phone ,
        isselectaddress:false,
        addressObj:"",
        seladdressname:"",
        CityCode:"",
        ProvinceCode:"",
        address:this.$store.state.bankCarsInfo.ProvinceName + "  "+this.$store.state.bankCarsInfo.CityName,
        dept:this.$store.state.bankCarsInfo.LName,
        // address:"喝杯石家庄",
        // dept:"石家庄",
        deptid:this.$store.state.bankCarsInfo.BankCode,
        deptlist:[],
        deptname:[],
        pickerIndex:0
     }
  },
  created(){
  },
  mounted(){
    //本行 不显示网点     还有SysFlag=-1也不显示
     if(this.$store.state.bankCarsInfo.SysFlag != "1"||this.$store.state.bankCarsInfo.BankName =="美团银行银行" ||this.$store.state.bankCarsInfo.BankName =="美团银行农村商业银行"){
      this.isMyBank = false;
    }else{
      this.isMyBank = true;
    }
    this.aliasname =this.$store.state.bankCarsInfo.PayeeacAlias;
    this.CityCode = this.$store.state.bankCarsInfo.CityCode;
  },

  computed:{
    isLineHeight:function(){
      if(this.dept!=""&&this.dept!=undefined||this.dept!=null){
        if(this.dept.length<=15){
          return 96;
        }else{
          return 48;
        }
      }
      
    },
    main_width:{

    }
  },
   methods: {
      
    }
  }
</script>
<style scoped>
.selectImg{
  height: 30px;
  width: 30px;
  margin-top: 33px;
}
.serachDiv{
  flex-direction: row;
}
.all{
  width: 750px;
  height: 20px;
  background-color: rgb(249,249,249);
}
.editaccount{
  width: 750px;
  height: 1334px;
  background-color: rgb(255,255,255);
}
.headerInfo{
  width: 750px;
  height: 260px;
  background-color: #ffffff;
  justify-content:center;
  align-content: center;
  align-items: center;
}
.headerBorder{
  width: 690px;
  height: 220px;
  background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
  /* background-color: rgb(193,153,101); */
  border-radius:8px; 
  align-items: center;
}
.accountuser{
   margin-top: 20px;
   font-size:30px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(255,255,255,1);
}
.accountbank{
  font-size:26px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
    margin-top: 10px;
}
.accountcars{
   flex-direction: row;
   margin-top: 20px;
}
.iconurl{
  width: 40px;
  height: 40px;
}
.cardnums{
   margin-left: 10px;
   font-size:30px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
}
.netinfo{
    margin-left: 30px;
    width: 720px;
    /* height: 192px; */
    background-color: #ffffff;
}
.netaddr{
  padding-right: 30px;
  height: 96px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: rgb(240,240,240);
  border-bottom-width: 1px;
}
.netname{
  flex-direction: row;
  justify-content: space-between;
  height: 96px;
}
.addrtext{
  /* margin-top: 40px;
  margin-bottom: 10px; */
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height: 96px;
}
.nettext{
  width: 500px;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height: 96px;
  /* width: 500px; */
  text-overflow: ellipsis;
}
.nettextt{
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height: 96px;
  width: 500px;
  text-align: right;
  text-overflow: ellipsis;
}
.nettextt1{
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height: 96px;
  width: 500px;
  text-overflow: ellipsis;
}
.editalis{
  margin-left: 30px;
  width: 720px;
  height: 96px;
  background-color: #ffffff;
  /* margin-top: 20px; */
  flex-direction: row;
  justify-content: space-between;
   border-bottom-color: rgb(240,240,240);
  border-bottom-width: 1px;
  /* align-items: center; */
}
.aliasinput{
  padding-right: 30px;
  line-height: 96px;
  width: 500px;
  height: 96px;
  color: rgba(124,124,124,1);;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  text-align: right;
}
.aliastext{
  line-height: 96px;
  width: 150px;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.btn{
    justify-content:center;
    align-content: center;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 60px;
}
.btnText{
    color: rgb(255,255,255);
    width: 690px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
    border-radius: 8px;
    font-size: 30px;
}
</style>


