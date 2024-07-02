<template>
  <div class="editaccount">
     <nav-bar :title="title"></nav-bar>
      <div class="editalis">
            <text class="aliastext">户名</text>
            <input 
            type="text" 
            class="aliasinput"   
            v-model="payeeAcname"  
            placeholder="请输入收款人户名"
            />
      </div>
      <div class="editalis">
            <text class="aliastext">账号</text>
            <input type="text" @blur="searchBank" class="aliasinput"  v-model="payeeAcno"  placeholder="请输入收款人账号"/>
      </div>
      <div class="editalis" @click="selectBankList">
            <text class="aliastext">银行</text>
             <div class="serachDiv">
               <text class="banktext">{{BankName}}</text>
              <image  :src="arrowUrl" class="arrow_icon"/>
            </div>
      </div>
      <div class="editalis" @click="cliAddress" v-if="isMyBank">
            <text class="aliastext">网点省市</text>
            <div class="serachDiv">
                <text class="banktext">{{address}}</text>
                <image  :src="arrowUrl" class="arrow_icon"/>
            </div>
      </div>
      <div class="editalis" @click="getnetqry" v-if="isMyBank">
            <text class="aliastext">网点名称</text>
            <div class="serachDiv">
                <text class="banktext" :style="{'line-height':isLineHeight+'px'}">{{deptname}}</text>
                <image :src="arrowUrl" class="arrow_icon"/>        
            </div>
            
      </div>
      <div class="editalis" v-if="isMyBank">
            <text class="aliastext">网点行号</text>
            <text class="banktext">{{deptid}}</text>
      </div>
      <div class="editalis">
            <text class="aliastext">短信通知</text>
            <input type="number" class="aliasinput" maxlength="11" v-model="mobile"  placeholder="请输入手机号"/>
      </div>
      <div class="editalis">
            <text class="aliastext">别名</text>
            <input type="text" class="aliasinput" maxlength ='5' v-model="aliasname"  placeholder="请输入5个以内汉字"/>
      </div>
      
      <div class="btn" >
        <text class="btnText" v-if="getBtnStatus"  @click="okfinish">确定</text>  
        <text class="btnText1" v-if="!getBtnStatus" >确定</text>
     </div>
     <select-address class="list-mask" :isBottomShow="isselectaddress" @popupOverlayBottomClick="popupOverlayBottomClick" @haveselectedaddress="selectedaddress">
      </select-address>
      <!-- <select-address class="list-mask" v-if="isselectaddress" @haveselectedaddress="selectedaddress">
      </select-address> -->
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
        isBtn:true,   //是否输入完了所有的东西
        isMyBank:false,     //是否是本行卡   false是本行卡
        title:"新增收款人",
        aliasname:'',
        arrowUrl:this.$store.state.imgBaseUrl + "rightarrow_icon@3x.png",        
        isselectaddress:false,
        addressObj:"",
        seladdressname:"",
        CityCode:"",
        ProvinceCode:"",
        address:"",
        deptid:"",
        mobile:"",
        BankName:"请选择收款人银行",
        BankCode:"",
        deptlist:[],
        deptnamelist:[],
        deptname:"",
        pickerIndex:0,
        payeeAcname:"",
        payeeAcno:"",
        SysFlag:"1" , //0本行  1他行
        bankList:[],
        Index:0,
        againPayyeeNo:"",
     }
  },
  mounted(){
    // if(context.sessionGttString('BankName')!=""){
    //     this.BankName = context.sessionGetString('BankName');
    //     this.BankCode = context.sessionGetString('BankCode');
    // }
  },
  computed:{
    isLineHeight:function(){
      if(this.deptname.length<=15){
        return 96;
      }else{
        return 48;
      }
    },
      //判断是否可以点击确定 
      getBtnStatus(){
        if(this.isMyBank==false){
          return this.payeeAcname&&this.payeeAcno&&this.BankName!="请选择收款人银行";
        }else{
          return this.payeeAcname&&this.payeeAcno&&this.BankName!="请选择收款人银行"&&this.address&&this.deptname;
        }
      }
  },
   methods: {
     searchBank(){
      var kong = this.payeeAcno.match(/^[^\s]*$/);  //空格
      var payee = this.payeeAcno.match(/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/);   //数字和-
      if(!payee || !kong){
        wjalert.alert('账号输入格式错误',"确定",data=>{})
        return;
      } 
      this.goJson('/eweb/QryAcIsBankInner.do',{
         PayeeAcNo:this.payeeAcno
      },response=>{
        if(response.data.PayeeBankName==null||response.data.PayeeBankName==undefined||response.data.PayeeBankName==""){
          if(this.againPayyeeNo!=this.payeeAcno){
            this.BankName = "请选择收款人银行"
          }
        }else{
          this.BankName = response.data.PayeeBankName;
          this.BankCode = response.data.BankId;
        }
        if(this.againPayyeeNo!=this.payeeAcno){
            this.deptid="";
            this.address="";
            this.deptname="";
            this.againPayyeeNo=this.payeeAcno;
        }else{
          this.againPayyeeNo=this.payeeAcno;
        }
        
        if(response.data.BankInner=="0"){   //0是本行拉   1是他行卡
          this.isMyBank = false;
          this.SysFlag="0"
        }else if(response.data.BankInner=="1"){
          this.isMyBank = true;
          this.SysFlag="1"
        }
      }) 
     },
    //  payeeAcnameInput(){
    //    if(this.isMyBank ==false){
    //      if(this.payeeAcname!="" && this.payeeAcname!=""&&this.BankName!="请选择收款人银行"){
    //        this.isBtn = false;
    //      }else{

    //      }
    //    }
    //  },
      okfinish(){  
        // 
          if(this.payeeAcname == ''){
              wjalert.alert('收款人户名不能为空',"确定",data=>{})
              return;
           }
           if(this.payeeAcno == ''){
              wjalert.alert('收款人账号不能为空',"确定",data=>{})
              return;
           }
          let kong = this.payeeAcno.match(/^[^\s]*$/);  //空格
          let payee = this.payeeAcno.match(/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/);   //数字和-
          if(!payee || !kong){
            wjalert.alert('账号输入格式错误',"确定",data=>{})
            return;
          } 
           if(this.BankName == '请选择收款人银行'){
              wjalert.alert('请选择银行',"确定",data=>{})
              return;
           }
           let number = this.mobile.match(/^1\d{10}$/);
            if(!number && this.mobile!=""){
              wjalert.alert('手机号输入格式错误',"确定",data=>{})
              return;
            } 
             var parms ={
                  Operation:"0",
                  PayeeAcNo:this.payeeAcno,
                  PayeeAcName:this.payeeAcname,
                  CityCode:this.CityCode,
                  PayeeBankId:this.BankCode,
                  UnionDeptId:this.deptid,
                  SysFlag:this.SysFlag,
                  PayeeacAlias:this.aliasname,
                  MobilePhone:this.mobile,
                  DrecCode:""
              }
            this.goJson('/eweb/PayeeBookManage.do',parms,response=>{
                modal.toast({ message:'新增成功'});
                setTimeout(()=>{
                  this.goBack();
                },300)
                // this.jump('/historytransfer');
            }) 
        },
        //网点查询 
        getnetqry(){
          // if(this.BankCode==""){
          //   this.showOneBtnAlert("请先选择银行","确定",()=>{});
          //   return;
          // }
           if(this.BankName == '江苏银行'){
             var params = {
              PayeeBankId:this.BankCode,
              CityCode:this.CityCode,
              Jiangsu:"江苏银行"
            }
           }else{
             var params = {
                PayeeBankId:this.BankCode,
                CityCode:this.CityCode,
            }
           }
          
            this.goJson('/eweb/PayeeBankDeptListQry.do',params,response=>{
              
              var arr = [];
              response.data.List.forEach((val)=>{
                    arr.push(val.Name)
              })

              this.deptnamelist = arr;
              this.deptlist=response.data.List;
                this.pickerShow();
              // modal.alert({
              //   message:JSON.stringify(this.deptnamelist)
              // })
            }) 
      },
      pickerShow(){
          // if(this.deptnamelist.length>0){
          //   return
          // }
          let items = this.deptnamelist;
            picker.pick(
              {
                index:this.pickerIndex,
                items,
                confirmTitle:"确认",
                cancelTitle:"取消",
                selectionColor:'white'
              },
            event => {
              if (event.result === "success") {
                this.pickerIndex = event.data;
                this.deptname = this.deptnamelist[event.data];
                this.deptid = this.deptlist[event.data].Value;
              }
            }
          )
        },
     chooseBank(){
      //  context.launchStage("main.bankSearch?flag=0")

     },
     selectBankList(){
       if(this.BankName=="美团银行农村商业银行"){

       }else{
          context.launchStage("main.bankSearch?bankFlag=0"); //跳转到银行列表页面  从收款热管理传标志0 
       }
        
     },
     
        selectedaddress(event){
          if(event === ''){
                return
            }
          this.addressObj = event;
          this.seladdressname = event.split(' ')[1];
          this.CityCode = event.split(' ')[2];
          this.ProvinceCode = event.split(' ')[3];
          this.address = event.split(' ')[0]+" "+event.split(' ')[1];
          this.isselectaddress = false;
          this.getnetqry(); 
        },
        popupOverlayBottomClick(){
          this.isselectaddress = false;
        },
        cliAddress(){
          this.isselectaddress=true;
      },
    },
    watch: { 
             "$store.state.BankName" () {
               if(this.$store.state.BankName!=""){
                this.BankName =  this.getData('BankName');
                this.BankCode = this.getData('BankCode');
                context.sessionSetString('BankCode',"");
                context.sessionSetString('BankName',"");
                this.$store.state.BankName="";  //置空
                if(this.BankName == "美团银行"){
                  this.BankName = "美团银行银行"
                  this.isMyBank = false;
                }else{
                  this.isMyBank = true;
                }
               }
                
              },
            //  "$store.state.BankCode"(){
            //    this.BankCode = this.getData('BankCode');
            //     context.sessionSetString('BankCode',"");
            //  }
        }
  }
</script>
<style scoped>
.serachDiv{
  flex-direction: row;
}
.arrow_icon{
  margin-top: 33px;
  width: 30px;
  height: 30px;
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
  background-color: rgb(193,153,101);
  border-radius:8px; 
  align-items: center;
}
.accountuser{
   font-size: 36px;
   color: rgb(255,255,255);
   margin-top: 20px;
}
.accountbank{
    font-size: 24px;
    color: rgba(255,255,255,0.6);
    margin-top: 10px;
}
.accountcars{
   flex-direction: row;
   margin-top: 20px;
}
.iconurl{
  width: 50px;
  height: 50px;
}
.cardnums{
   font-size: 32px;
   color: rgb(255,255,255);
   margin-left: 10px;
}
.netinfo{
    width: 750px;
    height: 192px;
    background-color: #ffffff;
    margin-top: 20px;
}
.netname{
  flex-direction: row;
  height: 96px;
  margin-left: 30px;
}
.addrtext{
  margin-top: 40px;
  margin-bottom: 10px;
  font-size:28px;
  color: rgb(34,34,34)
}
.nettext{
  margin-top: 20px;
  font-size:28px;
  color: rgb(34,34,34)
}
.nettextt{
  margin-top: 20px;
  font-size:28px;
  color: rgb(34,34,34);
  width: 500px;
  text-overflow: ellipsis;
}
.margintop20{
  margin-top: 20px;
}
.editalis{
  margin-left: 30px;
  width: 720px;
  height: 96px;
  padding-right: 30px;
  border-bottom-color: rgb(234,234,234);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.banktext{
  text-align: right;
  width: 500px;
  height: 96px;
  line-height: 96px;
  /* color: #AAAAAA; */
  font-size:26px;
  font-family:PingFang-SC-Medium,PingFang-SC;
}
.aliasinput{
  padding-right: 10px;
  line-height: 96px;
  width: 500px;
  height: 96px;
  /* color: #AAAAAA; */
  font-size:26px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  text-align: right;
}
.aliastext{
    font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.btn{
  margin-top: 100px;
  margin-left: 30px;
}
.btnText{
    color: rgb(255,255,255);
    width: 690px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    /* background-color: red; */
     background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
    border-radius: 8px;
    font-size: 32px;
}
.btnText1{
    color: rgb(255,255,255);
    width: 690px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    background-image: linear-gradient(to right,  #C0C0C0,  #C0C0C0);
    border-radius: 8px;
    font-size: 32px;
}
</style>


