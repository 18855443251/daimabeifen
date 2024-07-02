<template>
  <div>
     
      <NavBar :title="title"></NavBar> 
     <!-- <nav-bar title="收款人登记簿" :showpayee = true></nav-bar> -->
     <input type="text" class="searchinput" v-model="searchpayer" @input="searchEvent" placeholder="请输入收款人姓名/卡号"/>
     <div class="gap"></div>
     <scroller>
         <div class="list" @click="showOrHide">
            <image :src="personUrl" class="person_icon"/>
            <div class="mycelldd">
                <text class="mynamedd">{{userName}}</text>
                <text class="mynumsdd">{{carsNum}}张银行卡</text>
            </div>
            <div>
               <image  :src="arrowUrl" class="arrow_icon"/>
            </div>
         </div>
         <!-- 本人卡 -->
        <div   v-for="(item,index) in InnerPayeeLst" 
               :key="index" 
               class="bank_list" 
               v-if='isShow' 
               @click="jumpcontact(item)">
            <image :src="imgdata(item.BankId)" class="wujiang_icon"/>
            <text  class="bank_info">{{item.BankName}}(尾号{{dividelastfour(item.PayeeAcNo)}})</text>
        </div>
         <!-- 本人卡 -->
        <!-- <div class="gap"></div> -->
       <div  v-for="(value,key) in OtherPayeeLst" :key="key">
          <text class="titleHeight">{{value.title}}</text>
        <div :style="{height: value.list.length*140+'px'}">
         <div   v-for="(item,index) in value.list"  
                 :key="index" 
                 :class="[item.hideShow=='1'?'transfer_bank':'transfer_bank_show']" 
                 :style="{top:index*140+'px'}"
                 @swipe ="goRight($event,key,index)"
                 @click="jumpcontact(item)"
                 style="height:140px">
              <image :src="imgdata(item.BankId)" class="bankIcon"/>
              <div class="cell">
                <text class="name">{{item.PayeeAcName}}{{dealalias(item.PayeeacAlias)}}</text>
                <text class="nums">{{item.BankName}}(尾号{{dividelastfour(item.PayeeAcNo)}})</text>
              </div>
              <text @click="edit(item)" class="edit_text">编辑</text>
              <text @click="deleted(item.PayeeAcNo,item.PayeeAcName)" class="del_text">删除</text>
          </div>
       </div>
       </div>
    </scroller>
  </div>
</template>
<script>
import NavBar from "@/components/templet/titlebar";
import { WxcSearchbar } from 'weex-ui'
const modal = weex.requireModule("modal")
const stream = weex.requireModule("stream")
const context =weex.requireModule('context')
const wjalert = weex.requireModule("weex-alert")
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
         OtherPayeeLst:[],
     }
  },
    created(){
       this.getData();
    },
     methods: {
       //根据条件判断是否跳转进行跳转
       jumpcontact(data){
           if(this.$route.query.str == 'index'){
              this.$store.state.bankCarsInfo = data;
              this.jump('/inputTransfer?xx=y');
           }else{
              this.$store.state.bankCarsInfo = data;
              this.jump('/inputTransfer?xx=history');
           } 
       },
       //滑动删除
       goRight(e,k,y){
         let swiperList=this.OtherPayeeLst[k].list
         swiperList.map((ele,index)=>{
           ele.hideShow = "1"
         })
         if(e.direction == "left"){
              swiperList[y].hideShow = "2";
         }else if(e.direction == "right"){
            swiperList[y].hideShow = "1";
         }  
      },
       //编辑别名
       edit(data){
          this.$store.dispatch('bankcardinfogit',data);
          this.jump('/editalias');
       },
       //删除转账人信息
        deleted(PayeeAcNo,PayeeAcName){
            this.goJson('/refacmob/DelPayeeBook.do',{
                  PayeeAcNo:PayeeAcNo,
                  PayeeAcName:PayeeAcName
            },response=>{
                modal.toast({message: '删除成功'});
                this.getData();
            })
        },
       //切换按钮
       showOrHide(){
          this.isShow  = !this.isShow;
       },
       //转账首页数据获取
       getData(){
         this.commonmethod('/refacmob/QueryPayeeBook.do',{
            InnerType:'0',
            KeyWorld:this.searchpayer
         },response=>{
            this.InnerPayeeLst = response.data.InnerPayeeLst;
            response.data.OtherPayeeLst.map((ele,index)=>{
                  ele.hideShow = '1'
            })
            this.OtherPayeeLst=[];
            let tempList=response.data.OtherPayeeLst;
            let tempObj={
                title:"",
                list:[]
              }

            for (let item of tempList){
              if(tempObj.title==''){
                   tempObj.title=item.SzmPy
                   tempObj.list.push(item)
              }else if(tempObj.title!=item.SzmPy){
                   this.OtherPayeeLst.push(tempObj)
                   tempObj={
                      title:"",
                      list:[]
                    }
                     tempObj.title=item.SzmPy
                     tempObj.list.push(item)

              }else{
                   tempObj.list.push(item)
              }
            
            }
            this.OtherPayeeLst.push(tempObj);
            this.userName = response.data.AcName;
            this.$store.state.userName = response.data.AcName;
            this.carsNum = response.data.InnerPayeeLst.length;
          })
        },
        searchEvent(){
            this.getData();
        }
     }
  }
</script>
<style scoped>
.edit_text{
  width: 150px;
  color:rgb(102,102,102);
  background-color: rgb(237,237,237);
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
   background-color: #ececec;
   height:20px;
}
.list{
  flex-direction: row;
  align-content: center;
  align-items: center;
  background-color: #ffffff;
  height: 100px;
}
.cell{
  width:620px;
  margin-left: 30px;
}
.person_icon{
  width: 80px;
  height: 80px;
  margin-left: 30px;
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
  color: rgb(34,34,34);
  font-size: 32px;
}
.nums{
  font-size: 24px;
  color: rgb(153,153,153);
}
.bank_list{
   background-color: rgb(247,247,247);
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
   border-bottom-width: 1px;
   border-bottom-color: #dddddd;
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
   align-items: center;
   border-bottom-width: 1px;
   border-bottom-color: #dddddd;
   border-style:solid;
   position: absolute;
   width:1050px;
   align-items: center;
   height: 140px;
   overflow: hidden;
}
.transfer_bank_show{
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
   border-bottom-width: 1px;
   border-bottom-color: #dddddd;
   border-style:solid;
   position: absolute;
   width:1050px;
   overflow: hidden;
   height: 140px;
   left:-300px;
}
.bankIcon{
   margin-left:20px;
   width: 80px;
   height: 80px;
}
.arrow_icon{
   width: 30px;
   height: 30px;
   margin-left: 420px;
}
.wujiang_icon{
  width: 70px;
  height: 70px;
  margin-left: 40px;
}
.searchinput{
  width: 700px;
  height: 80px;
  margin-left: 20px;
  padding-left: 20px;
  border-radius:8px;
  margin-top: 20px;
  margin-bottom: 10px; 
  border: 1px solid #dddddd;
  background-color: #ecececec;
  border-bottom-color: #dddddd;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: #dddddd;
  border-left-style: solid;
  border-left-width: 1px;
  border-top-color: #dddddd;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: #dddddd;
  border-right-style: solid;
  border-right-width: 1px;
}
.titleHeight{
   height: 35px;
   line-height: 35px;
   background-color: #ececec;
   padding-left: 20px;
   font-size: 28px;
}
</style>


