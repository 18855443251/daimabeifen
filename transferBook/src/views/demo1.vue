<template>
  <div class="contain" >
     <nav-bar :title="title"></nav-bar>
     <div class="inputDiv">
       <image class="searchImg" src="./imgs/search.png"></image>
        <input type="text" class="searchinput" v-model="searchpayer" @input="searchEvent" placeholder="请输入收款人姓名/卡号"/>
     </div>
     <div class="gap"></div>
     <scroller>
         <!-- 他人卡 -->
        <!-- <div class="gap"></div> -->
       <div  v-for="(value,keys,index) in allObj" :index="keys" :key="index">
         <!-- <div > -->
           <text class="titleHeight">{{keys}}</text>
         <!-- </div> -->
          
        <div :style="{height: value.length*140+'px'}">
         <div   v-for="(item,index) in value"  
                 :key="index" 
                 ref="itemDev"
                 class="transfer_bank_show"
                 :style="{top:index*140+'px'}"
                 @swipe="handleSwipe($event, key)"
                 @click="jumpcontact(item)"
                 style="height:140px">
                    <image :src="imgdata(item.BankCode)" class="bankIcon"/>
                    <div class="cell">
                      <div class="otherCard">
                        <text class="name" >{{item.PayeeAcName}}</text>
                        <text class="payeeAcAlias" v-if="item.PayeeacAlias">{{item.PayeeacAlias}}</text>
                      </div>
                      
                      <text class="nums">{{item.BankName}}(尾号{{dividelastfour(item.PayeeAcNo)}})</text>
                    </div>
              
              <div ref="remove" class="dem">
                  <text  @click="jumpdetail(item)" class="detail_text">详情</text>
              <!-- <text @click="edit(item)" class="edit_text">编辑</text>
              <text  @click="deleted(item.PayeeAcNo,item.SysFlag)" class="del_text">删除</text> -->
              </div>
            
          </div>
       </div>
       </div>
       <div class="pan"></div>
    </scroller>
    
      <div class="btn" @click="add">
         <text class="btnText">新增收款人</text>
      </div>
  </div>
</template>
<script>
import NavBar from "../components/NavBar.vue";
import { WxcSearchbar } from 'weex-ui';
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context =weex.requireModule('context');
const wjalert = weex.requireModule("weex-alert");
import pinyin from "@/components/js/vue-py";
export default {
    components:{ NavBar,WxcSearchbar},
    data () {
      return {
         title:"收款人登记簿",
         personUrl: this.$store.state.imgBaseUrl + "/Headportrait@3x.png",
         arrowUrl:this.$store.state.imgBaseUrl + "drop-down@3x.png",
         isShow:false,
         rotate:true,
         carsNum:0,
         userName:'',
         InnerPayeeLst:[],
         searchpayer:'',
         OtherPayeeLst:{},
         allObj:{}  ,
         currentIndex:-1,
     }
  },
    created(){
      this.getData();
    },
    mounted(){
      //清除其他的页面选择银行带来的影响
        context.sessionSetString('BankName',"");
        context.sessionSetString('BankCode',"");
    },
     methods: {
      
      jumpdetail(data){
         this.$store.dispatch('bankcardinfogit',data);
        //  alert(JSON.stringify(this.$store.state.bankCarsInfo))
         this.jump('/details');
        },
       //根据条件判断是否跳转进行跳转
       jumpcontact(data){
         //去转账页面
         if(context.sessionGetString('enterBookFlag')=="0"){  //0代表是从转账页面跳进来的   进入后清除该标志 
              context.sessionSetString('updateBankName','1');
              context.sessionSetString('enterBookFlag','');  //进入后转账页面进入的标志 
              context.sessionSetString("payeeDetail",JSON.stringify(data));
              context.sessionSetString('fastTransferFlag','transferBook');
              context.finish();
         }else{
           this.$store.dispatch('bankcardinfogit',data);  //点击的这条信息带进去
            this.jump('/details');
         }
       },
       handleSwipe (e , index) {
        //    modal.alert({
        //        message:e
        //    })
             // console.log(e, 'e')
              if (e.direction == "left") {
                this.goLeft(index);
              } else if (e.direction == "right"){
                this.goRight(index);
              }
              // modal.toast({message:"==" + e.direction + "==" + index, duration:1});
            },
      goLeft(index){
              // this.leftIndex = index
              let itemEl = this.$refs.itemDev[index];
              //第二左滑条目与前一次左滑条目相同时，不处理
              if (index == this.currentIndex){
                return;
              }
              //当前有划出的条目的时候，左滑其他条目，当前的条目归位，
              if (this.currentIndex != -1){
                this.goRight(this.currentIndex);
              }
              let wd =900;
           //  let wd = this.$refs.remove[index].offsetWidth + 30;
              console.log(wd, 'width')
              //左滑当前条目
              if (this.currentIndex != index){
                animation.transition(itemEl,{
                  styles: {
                    transform: "translate(-140px)",
                    transformOrigin: 'center center'
                  },
                  duration: 200, //ms
                  timingFunction: 'linear',
                  delay: 0 //ms
                },function () {

                });
                this.currentIndex = index;
              }
            },
            //time是动画时间，给个默认值 200毫秒，不传就表明这个值为200毫秒
            goRight(index, time = 200){
              let itemEl = this.$refs.itemDev[index];
              animation.transition(itemEl,{
                styles: {
                transform: 'translate(0px, 0px)',
                transformOrigin: 'center center'
                },
                duration: time, //动画时间
                timingFunction: 'linear',//线性运动
                delay: 0 //ms
              },function () {

              });
              this.currentIndex = -1;
            },
      //新增
      add(){
        this.jump('/addtransfer');
      },
       //编辑别名
       edit(data){
          this.$store.dispatch('bankcardinfogit',data);
         // alert(JSON.stringify(this.$store.state.bankCarsInfo))
          this.jump('/edidalis');
       },
       //删除转账人信息
        deleted(PayeeAcNo,SysFlag){
         wjalert.confirm(
            "确定删除当前收款人信息？",
            "确定",
            "取消",
            data => {
              if (data == "Y") { 
               this.goJson('/eweb/PayeeBookManage.do',{
                        Operation:"2",
                        PayeeAcNo:PayeeAcNo,
                        SysFlag:SysFlag
                  },response=>{
                    // modal.alert({
                    //   message:JSON.stringify(response)
                    // })
                     modal.toast({message: '删除成功'});
                     this.getData();
                  })
              } else if (data == "N") {
              }
            }
          );

        },
       //切换按钮
       showOrHide(){
          this.isShow  = !this.isShow;
       },
     
      //  //转账首页数据获取
       getData(){
            const loginParams={
               PayeeAcNoq:this.searchpayer,
               PayeeAcNameq:this.searchpayer
            }
          this.goJson('/eweb/TransferAcNoQry.do',loginParams,response=>{
         // this.sortList(response.data.List) ;    
              this.InnerPayeeLst = response.data.CommonPayerAcNoList
              // response.data.OtherPayeeList.map((ele,index)=>{
              //       ele.hideShow = '1'
              // })
              //   var  demo = response.data.List
              // let temp = demo.sort((a,b)=>{
              //   let demo1 = demo.PayeeAcName - demo.PayeeAcName
              //       return demo1;
              //     });
              //     modal.alert({
              //       message:JSON.stringify(temp)
              //     })
              // this.OtherPayeeLst=[];
              // let tempList=temp;
              // let tempObj={
              //     title:"",
              //     list:[]
              //   }

              // for (let item of tempList){
              //   if(tempObj.title==''){
              //    let name = pinyin.chineseToPinYin(item.PayeeAcName).substring(0, 1)
              //  //  tempObj.title=item.LName
              //      tempObj.title=name;
              //       tempObj.list.push(item);
              //   }else if(tempObj.title!= pinyin.chineseToPinYin(item.PayeeAcName).substring(0, 1)){
              //       this.OtherPayeeLst.push(tempObj)
              //       tempObj={
              //           title:"",
              //           list:[]
              //         }
              //        let name1 = pinyin.chineseToPinYin(item.PayeeAcName).substring(0, 1);
              //       tempObj.title=name1;
              //       tempObj.list.push(item);
              //   }else{
              //       tempObj.list.push(item)
              //   }
              // modal.alert({
              //   message:JSON.stringify(response.data.OtherPayeeList)
              // })
              // }
              this.OtherPayeeLst = response.data.OtherPayeeList[0];
              this.deal(this.OtherPayeeLst);
              
              this.userName = response.data.CommonPayerAcNoList[0].AcName;
              this.carsNum = response.data.CommonPayerAcNoList.length;

            })
        },
        searchEvent(){
            this.getData();
        },
         deal(obj){
          var newKey = Object.keys(obj).sort();
          var newObj = {};
          for(var i=0; i<newKey.length;i++) {
            if(obj[newKey[i]].length !== 0) {
              newObj[newKey[i]] = obj[newKey[i]]
              // for(let j =0;j<=i; j++) {
              //   Vue.set(newObj[newKey[j]],hideShow , "1");
              // }
            }
          }
          // newObj.map((ele,index)=>{
          //   ele.hideShow = '1'
          // })
          // modal.alert({
          //   message:JSON.stringify(newObj)+"111"
          // })
          this.allObj = newObj;
        },
     }
  }
</script>
<style scoped>
.dem{
  flex-direction: row;
}
.payeeAcAlias{
  margin-top: 20px;
  height:36px;
  border-radius:4px;
  font-size:20px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  line-height: 36px;
  padding-left: 10px;
  padding-right: 10px;
  color:rgba(230,2,44,1);
  background-color:rgba(254,240,238,1);
}
.otherCard{
  width: 596px;
  flex-direction: row;
  justify-content: space-between;
}
.myCard{
  width: 626px;
  flex-direction: row;
  justify-content: space-between;
}
.contain{
  background-color: rgb(255,255,255)
}
.searchImg{
  width: 23px;
  height: 25px;
  margin-top: 17px;
  margin-left: 30px;
}
.inputDiv{
   width: 690px;
  height:60px;
  margin-left: 30px;
  flex-direction: row;
  border-radius:8px;
  margin-top: 20px;
  margin-bottom: 20px; 
 border-width: 1px;
 border-color: rgba(221,221,221,1);
}
.searchinput{
  width: 600px;;
  font-size:26px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  padding-left: 10px;
}
.pan{
   height: 90px;
   width: 750px;
}
.btn{
    justify-content:center;
    align-content: center;
    align-items: center;
    position: fixed;
    bottom:0px;
}
.btnText{
    color: rgb(255,255,255);
    width: 750px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
    font-size: 30px;
}
.detail_text{
  width: 150px;
  color:rgb(102,102,102);
  background-color: rgb(237,237,237);
  font-size: 28px;
  line-height: 140px;
  text-align: center;
  height:140px;
}
.edit_text{
  width: 150px;
  color:rgb(102,102,102);
  background-color: rgb(255,255,255);
  font-size: 28px;
  line-height: 140px;
  text-align: center;
  height:140px;
}
.del_text{
  width: 150px;
  background-color:rgb(238,63,35);
  color:rgb(255,255,255);
  font-size: 28px;
  line-height: 140px;
  height:140px;
  text-align: center;
}
.gap{
   width: 750px;
   background-color: rgba(249,249,249,1);
   height:20px;
}
.list{
  margin-left: 30px;
  width: 690px;
  flex-direction: row;
  align-content: center;
  align-items: center;
  background-color: #ffffff;
  height: 100px;
}
.cell{
  width:626px;
  height: 140px;
  margin-left: 30px;
  border-bottom-width: 1px;
   border-bottom-color: #dddddd;
}

.mycelldd{
   margin-left: 20px;
}
.mynamedd{
   font-size: 32px;
   color: rgb(34,34,34) 
}
.mynumsdd{
   font-size: 24px;
   color: rgb(153,153,153);
}
.name{
  margin-top: 25px;
  font-size:30px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  /* color: rgb(34,34,34);
  font-size: 32px; */
}
.nums{
  margin-top: 15px;
  font-size:26px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(124,124,124,1);
}
.bank_list{
   /* background-color: rgb(247,247,247); */
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
   border-bottom-width: 1px;
   border-bottom-color: rgb(245,245,245);
   border-style:solid;
   height: 100px;
}
.bank_info{
  margin-left: 20px;
  font-size: 28px;
  color: rgb(34,34,34);
}
.transfer_bank{
   flex-direction: row;
   justify-content: flex-start;
   /* align-items: center; */
   
   border-style:solid;
   position: absolute;
   width:750px;
   height: 140px;
   overflow: hidden;
}
.transfer_bank_show{
   flex-direction: row;
   justify-content: flex-start;
   /* align-items: center; */
   /* border-bottom-width: 1px;
   border-bottom-color: #dddddd; */
   border-style:solid;
   /* position: absolute; */
   width:900px;
   /* overflow: hidden; */
   height: 140px;
   /* left:-450px; */
}
.mybankIcon{
   width: 64px;
   height: 64px;
}
.bankIcon{
  margin-top: 37px;
   margin-left:30px;
   width: 64px;
   height: 64px;
}
.arrow_icon{
   width: 30px;
   height: 30px;
}
.titleHeight{
   height: 60px;
   line-height: 35px;
   background-color: rgb(245,245,245);
   padding-left: 30px;
  font-size:28px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(124,124,124,1);
   line-height: 60px;
}
</style>


