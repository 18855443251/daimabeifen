<template>
    <div style="background-color: #ffffff;">
        <div class="screen_box" v-if="tabindex=='1'">
            <div class="kong"></div>
            <div v-for="(item,index) in navData1" :key="index" @click="clickSort1(index)" :class="[item.isselect ?'screen_diva':'screen_divb']">
                <text class="screen_type gray">{{item.text}}</text>
                <image :src="downUrl" class="down_img" v-if="item.isselect==false"></image>
                <image :src="upUrl" class="down_img" v-if="item.isselect==true"></image>
            </div>
            <div class="kong"></div>
        </div>
        <div class="screen_box" v-if="tabindex=='0'">
            <div class="konga"></div>
            <div v-for="(item,index) in navData0" :key="index" @click="clickSort0(index)" :class="[item.isselect?'screen_divsa':'screen_divsb']">               
                <text class="screen_type gray">{{item.text}}</text>
                <image :src="downUrl" class="down_img" v-if="item.isselect==false"></image>
                <image :src="upUrl" class="down_img" v-if="item.isselect==true"></image>
            </div>
            <div class="konga"></div>
        </div>
        <div class="screen_box" v-if="tabindex=='2'">
            <div class="konga"></div>
            <div v-for="(item,index) in navData2" :key="index" @click="clickSort2(index)" :class="[item.isselect?'screen_divsa':'screen_divsb']">
                <text class="screen_type gray">{{item.text}}</text>
                <image :src="downUrl" class="down_img" v-if="item.isselect==false"></image>
                <image :src="upUrl" class="down_img" v-if="item.isselect==true"></image>
            </div>
            <div class="konga"></div>
        </div>
        <!-- <select-popup class="list-mask" v-if="$store.state.isselectshow"  :selecttabindex="selecttabindex" :selecttab="selecttab">
        </select-popup> -->
        <div class="list-mask" v-if="isselectshow" @click="prevent">
            <!-- <div class="all_popup"> -->
            <div class="select-item" :style="{'top':list_topa}" v-if="selecttabindex=='0'">
                <div class="listitem">
                    <div v-for="(item, index) in selectlist" :key="index" :class="[index==selecttypeindex?'select_div0':'select_div']"  @click="selecttype(index)">                        
                        <text :class="[index==selecttypeindex?'select_title0':'select_title']">{{item.TransName}}</text>                  
                    </div>
                </div>
                <div class="footer" :style="{'top':list_topb}">
                    <div class="leftbutton" @click="resetTrs">
                        <text class="addbutton leftbuttontext">重置</text>  
                    </div>
                    <div class="rightbutton" @click="confirmTrs">
                        <text class="addbutton rightbuttontext">确定</text>  
                    </div> 
                </div> 
            </div>
            <div class="select-item" :style="{'top':list_topa}" v-if="selecttabindex=='1'">
                <div class="trsdate">
                    <!-- <text class="trstime">交易时间</text> -->
                    <div style="margin-left:30px;margin-top:30px;flex-direction:row;align-items:center">
                        <text class="filterTitle">交易时间</text>
                        <text class="selectedDate" >({{BeginDate}}-{{EndDate}})</text>
                    </div>
                    <div class="listitem">
                        <div v-for="(item, index) in timeflaglist" :key="index" :class="[index==selecttimeindex?'selecttime_div0':'selecttime_div']"  @click="selecttime(index)"> 
                            <text :class="[index==selecttimeindex?'select_title0':'select_title']">{{item.text}}</text>
                        </div>
                    </div>
                    <div class="timeitem" v-if="dateSelfColShow">
                        <div class="choosedate pickput" @click="pickstartDate">
                            <text class="date">{{starttime}}</text>
                        </div>
                        <div class="p"></div>
                        <div class="choosedate" @click="pickendDate">
                            <text class="date">{{endtime}}</text>
                        </div>
                    </div>
                </div>
                <div class="footer" :style="{'top':list_topb}">
                    <div class="leftbutton" @click="resetTime">
                        <text class="addbutton leftbuttontext">重置</text>  
                    </div>
                    <div class="rightbutton" @click="confirmTime">
                        <text class="addbutton rightbuttontext">确定</text>  
                    </div> 
                </div> 
            </div>
            <div class="select-item" :style="{'top':list_topa}" v-if="selecttabindex=='2'">
                    <div class="trsdate">
                    <text class="trstime">交易金额</text>
                    <div class="timeitem">
                        <div class="choosedate pickput">
                            <price-input type="number" :textValue="StartAmount" @onChange="amountChange" placeholder="￥起始金额" :stringRegex="stringRegex" class="amt_word" ></price-input>
                        </div>
                        <div class="p"></div>
                        <div class="choosedate">
                            <price-input type="number" :textValue="EndAmount" @onChange="amountChangeHigh" placeholder="￥结束金额" :stringRegex="stringRegex" class="amt_word" ></price-input>
                        </div>
                    </div>
                </div>
                <div class="footer" :style="{'top':list_topb}">
                    <div class="leftbutton" @click="resetAmt">
                        <text class="addbutton leftbuttontext">重置</text>  
                    </div>
                    <div class="rightbutton" @click="confirmAmt">
                        <text class="addbutton rightbuttontext">确定</text>  
                    </div> 
                </div> 
            </div>
            <div class="select-item" :style="{'top':list_topa}" v-if="selecttabindex=='3'">
                <div class="listitem">
                    <div v-for="(item, index) in statuslist" :key="index" :class="[index==selectstatusindex?'select_div0':'select_div']"  @click="selectstatus(index)"> 
                        <text :class="[index==selectstatusindex?'select_title0':'select_title']">{{item.Name}}</text>
                    </div>
                </div>
                <div class="footer" :style="{'top':list_topb}">
                    <div class="leftbutton" @click="resetStatus">
                        <text class="addbutton leftbuttontext">重置</text>  
                    </div>
                    <div class="rightbutton" @click="confirmStatus">
                        <text class="addbutton rightbuttontext">确定</text>  
                    </div> 
                </div> 
            </div>
            <!-- </div> -->
        </div>   
    </div>
</template>

<style scoped>
.list-mask{
    position: fixed;
    top: 575px;
    left: 0;
    width: 750px;
    height: 1334px;
    /* background-color: black; */
    background-color: rgba(0, 0, 0, 0.4);
  }
  .select-item{
    flex-direction: row;
    flex-wrap: wrap;    
    background-color: #ffffff;
    /* align-items: center;
    justify-content: space-around; */
    height: 540px;
    width: 750px;
    position: fixed;
    left:0px;
  }  
   .listitem{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 750px;
    margin-top: 20px;
     /* margin-top: 20px;
     margin-bottom: 20px;
     width: 250px;
     height:550px;
     flex-grow:1;    */
  } 
  .trsdate{
    display: flex;
    flex-direction: column;
    width: 750px;
  }
  .filterTitle{
    font-size:30px;
    color:rgba(51,51,51,1);
  }
  .selectedDate{
    font-size:24px;
    color:rgba(124,124,124,1);
    margin-left: 20px;
  }
  .select_div{
    margin-top: 40px;
    margin-left: 40px;
    width: 200px;
    height: 64px;
    text-align: center;
    background-color: #F8F8F7;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }
.select_div0{
    margin-top: 40px;
    margin-left: 40px;
    width: 200px;
    height: 64px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 4px;
    border-top-color: #E6022C;
    border-top-style: solid;
    border-top-width: 1px;
    border-bottom-color: #E6022C;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: #E6022C;
    border-right-style: solid;
    border-right-width: 1px;
    border-left-color: #E6022C;
    border-left-style: solid;
    border-left-width: 1px;
    align-items: center;
    justify-content: center;
  }
  .select_title{
    font-size: 26px;
    color: #333333;
  }
  .select_title0{
    font-size: 26px;
    color: #E6022C;
  }
  .magintop40{
      margin-top: 40px;
      flex-direction: column;
  }
  .trstime{
      margin-top: 30px;
    font-size: 30px;
    color: #333333;
    margin-left: 30px;
  }
  .timeitem{
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 750px;
  }
  .choosedate{
    margin-top: 30px;
    width: 296px;
    height: 80px;
    /* border: 1px solid #DDDDDD;   */
    border-top-color: #DDDDDD;
    border-top-style: solid;
    border-top-width: 1px;
    border-bottom-color: #DDDDDD;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: #DDDDDD;
    border-right-style: solid;
    border-right-width: 1px;
    border-left-color: #DDDDDD;
    border-left-style: solid;
    border-left-width: 1px;
    /* border-radius: 4px; */
    margin-left: 30px;
    align-content: center;
    justify-content: center;
}
.date{
    font-size: 28px;
    color: #AAAAAA;
    text-align: center;
}
.p{
    margin-top: 30px;
    margin-left: 30px;
    width: 30px;
    height: 2px;
    background-color: #aaaaaa;
}
.amt_word{
    width: 296px;
    height: 80px;
    font-size: 28px;
    color: #AAAAAA;
    line-height: 80px;
    text-align: center;
    outline: none;
}
  .selecttime_div{
    margin-top: 30px;
    margin-left: 30px;
    width: 148px;
    height: 64px;
    text-align: center;
    background-color: #F8F8F7;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }
  .selecttime_div0{
    margin-top: 30px;
    margin-left: 30px;
    width: 148px;
    height: 64px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 4px;    
    border-top-color: #E6022C;
    border-top-style: solid;
    border-top-width: 1px;
    border-bottom-color: #E6022C;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: #E6022C;
    border-right-style: solid;
    border-right-width: 1px;
    border-left-color: #E6022C;
    border-left-style: solid;
    border-left-width: 1px;
    align-items: center;
    justify-content: center;
  }
  .footer{
    height:88px;
    width:750px;
    position: fixed;
    left:0px;   
    flex-direction: row;
  }
  .leftbutton{
    height: 88px;
    line-height: 88px;  
    width: 375px;
    background-color: #F8F8F7;
    align-items: center;
    justify-content: center;
  }
  .leftbuttontext{
    font-size: 32px;
    color: #666666;
  }
  .rightbutton{
    height: 88px;
    line-height: 88px;  
    width: 375px;
    /* background-color: #E6022C; */
    background-image: linear-gradient(to right,#FB5D7A,#E6022C);
    /* background-image: linear-gradient(124deg, #FB5D7A 0%, #E6022C 100%); */
    align-items: center;
    justify-content: center;
  }
  .rightbuttontext{
    font-size: 32px;
    color: #FFFFFF;
  }


.blue{
    color: rgb(63,142,240);
    /* color: red; */
}
.gray{

  color: #7C7C7C;
}
.down_img{
  width:28px;
  height:28px;
}
.screen_type{
  text-align:center;
  line-height:65px;
  font-size: 26px;
}
.screen_diva{
  width:228px;
  height:60px;
  background-color: #fff;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* border-color: #eaeaea;
  border-style: solid;
  border-width: 1px;
  border-bottom-width: 0px; */
  border-top-left-radius:18px;
  border-top-right-radius:18px; 
  border-top-color: #EAEAEA;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: #EAEAEA;
  border-right-style: solid;
  border-right-width: 1px;
  border-left-color: #EAEAEA;
  border-left-style: solid;
  border-left-width: 1px;
}
.screen_divb{
  width:230px;
  height:60px;
  background-color: #fff;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-color: #EAEAEA;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.tab_select{
  /* border: 1px solid #EAEAEA; */
  border-top-color: #EAEAEA;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: #EAEAEA;
  border-right-style: solid;
  border-right-width: 1px;
  border-left-color: #EAEAEA;
  border-left-style: solid;
  border-left-width: 1px;
  border-bottom-color: #ffffff;
  border-left-style: solid;
  border-left-width: 1px;
  border-top-right-radius: 27px;
  border-top-left-radius: 27px;
}
.screen_divsa{
  width:177.5px;
  height:60px;
  background-color: #fff;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top-left-radius:18px;
  border-top-right-radius:18px; 
  border-top-color: #EAEAEA;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: #EAEAEA;
  border-right-style: solid;
  border-right-width: 1px;
  border-left-color: #EAEAEA;
  border-left-style: solid;
  border-left-width: 1px;
}
.screen_divsb{
  width:177.5px;
  height:60px;
  background-color: #fff;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-color: #EAEAEA;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.screen_box{
  width:750px;
  height: 70px;
  background-color: #fff;
  flex-direction: row;
  align-items:center;
  justify-content: space-between;

}
.kong{
    width: 30px;
    height: 70px;
    background-color: #fff;
    border-bottom-color: #eaeaea;
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.konga{
    width: 20px;
    height: 70px;
    background-color: #fff;
    border-bottom-color: #eaeaea;
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.pickput {
    margin-left: -5px;
}
</style>

<script>
const context = weex.requireModule("context");
const animation = weex.requireModule('animation');
import SelectPopup from "./select_popup.vue";
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
const wjalert = weex.requireModule("weex-alert");
const pickerdate = weex.requireModule("picker");
export default {
    props: {
        tabindex: {type:String, default: "0"},
    },
    components: {SelectPopup},
    data() {
        return {
            downUrl:'./imgs/tab_bench/down@3x.png',
            upUrl:'./imgs/tab_bench/up@3x.png',
            navData1:[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false}
            ],
            
            navData0:[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false},
                {text:"状态",isselect:false}
            ],
            navData2:[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false},
                {text:"状态",isselect:false}
            ],
            tab:"",
            isselectshow:false,
            selecttabindex:"",
            selecttab:"",
            selecttypeindex:0,
            selecttimeindex:1,
            selectstatusindex:0,
            selectlist:[
                {TransName:"全部",TransCode:""},
                {TransName:"转账汇款",TransCode:"Transfer"},
                {TransName:"代发工资",TransCode:"AgentSalary"},               
                {TransName:"背书转让",TransCode:"EndorsementApply"},
                {TransName:"提示收票",TransCode:"IssuanceRequest"},
                {TransName:"贴现申请",TransCode:"DiscountApply"},
                {TransName:"实时结汇",TransCode:"ewjrcb.RealTimeSettlement"},               
                {TransName:"云盾开通",TransCode:"MCertAuthModeMgmtForMore"},
                {TransName:"云盾密码重置",TransCode:"MCertAuthResetPwdForMore"},
                {TransName:"支票预约购买",TransCode:"CheckReserveBuy"},
                {TransName:"转账撤销",TransCode:"TransferNotRealTimeCancel"},
                {TransName:"票据签收",TransCode:"AcceptSign"},
            ],
            timeflaglist:[{text:"当天",value:"Today"},{text:"本月",value:"M1"},{text:"近三月",value:"M3"},{text:"近六月",value:"M6"},{text:"自定义",value:"10"}],
            //statuslist:[{Name:"全部",Value:""},{Name:"待审核",Value:"6"},{Name:"交易成功",Value:"0"},{Name:"交易失败",Value:"2"}],
            statuslist:[{Name:"全部",Value:"0"},{Name:"待审核",Value:"3"},{Name:"交易成功",Value:"1"},{Name:"交易失败",Value:"2"},{Name:"已拒绝",Value:"4"},{Name:"已受理",Value:"5"}],
            transcode:"",//交易类型
            jnlstate:"0",//交易状态
            StartAmount:"",//起始金额
            EndAmount:"",//结束金额
            begindate:"",//开始日期
            enddate:"",//结束日期
            timeflag:"M1",//时间段标志  today-当天  M1-本月  M3-近三月  M6-近六月
            auduitList:[],//发起的列表
            checkList:[],//待审核列表
            dealList:[],//我处理的列表
            starttime:"请输入开始日期",
            endtime:"请输入结束日期",
            BeginDate:'',
            EndDate:'',
            selectAmt: false,
            dateSelfColShow: false,
            currentdate: "",
            mindate: "",
            list_topa: 555,
            list_topb: 1090,
            stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$"
        }
    },
    watch:{
        "$store.state.launcherTabbarTimes":{
            handler(newV,oldV){
               this.resetCondiParams();
            }
        },
    },
    mounted() {
        //初始化日期 
        this.BeginDate=this.getFirstDate();//默认本月，所以BeginDate默认本月第一天
        this.EndDate=this.getNowFormatDateWeex('/');
        this.getNowFormatDate();
        this.getlist_top();
    },
    methods: {
        main_height:function(){
            var height = context.getDeviceInfo().status_bar_height*1+100+100+70;
            return height;
        },
        //重置查询参数
        resetCondiParams(){
            this.navData1=[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false}
            ],
            this.navData0=[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false},
                {text:"状态",isselect:false}
            ],
            this.navData2=[
                {text:"交易类型",isselect:false},
                {text:"日期",isselect:false},
                {text:"金额",isselect:false},
                {text:"状态",isselect:false}
            ],
            this.tab="";
            this.isselectshow=false;
            this.selecttabindex="";
            this.selecttab="";
            this.selecttypeindex=0;
            this.selecttimeindex=1;
            this.selectstatusindex=0;
            this.transcode="";//交易类型
            this.jnlstate="0";//交易状态
            this.StartAmount="";//起始金额
            this.EndAmount="";//结束金额
            this.begindate="";//开始日期
            this.enddate="";//结束日期
            this.timeflag="M1";//时间段标志  today-当天  M1-本月  M3-近三月  M6-近六月
            this.auduitList=[];//发起的列表
            this.checkList=[];//待审核列表
            this.dealList=[];//我处理的列表
            this.starttime="请输入开始日期";
            this.endtime="请输入结束日期";
            this.selectAmt= false;
            this.dateSelfColShow= false;
            this.currentdate= "";
            this.mindate="";
        },
        //获取定位高度
        getlist_top() {
            var colorTheme = context.secureGetString("colorTheme");
            if (colorTheme) {
                if (colorTheme == "smple") {
                this.list_topa = 210;
                this.list_topb = 750;
                } else {
                this.list_topa = 555;   
                this.list_topb = 1090;
                }
            }    
        },
        //prevent方法解决安卓浮层点击穿透
        prevent(event){
            event.stopPropagation();
        },
        //点击出现选项
        clickSort1(x){
            if(this.tab==x){
                this.isselectshow=!this.isselectshow
            }else{
                this.isselectshow=true
            }
            this.tab=x;
            this.selecttabindex=x+"";
            this.selecttab=this.tabindex
            for(let i in this.navData1){
                if(x!=i){
                 this.navData1[i].isselect=false;
                }
            }

            this.navData1[x].isselect=!this.navData1[x].isselect;
            this.navData1.splice(x,1,this.navData1[x]);
        },
        //点击出现选项
        clickSort0(x){
            if(this.tab==x){
                this.isselectshow=!this.isselectshow
            }else{
                this.isselectshow=true
            }
            this.tab=x;
            this.selecttabindex=x+"";
            this.selecttab=this.tabindex
            for(let i in this.navData0){
                if(x!=i){
                 this.navData0[i].isselect=false;
                }
            }
            this.navData0[x].isselect=!this.navData0[x].isselect;
            this.navData0.splice(x,1,this.navData0[x]);
            
        },
        //点击出现选项
        clickSort2(x){
            if(this.tab==x){
                this.isselectshow=!this.isselectshow
            }else{
                this.isselectshow=true
            }
            this.tab=x;
            this.selecttabindex=x+"";
            this.selecttab=this.tabindex
            for(let i in this.navData2){
                if(x!=i){
                 this.navData2[i].isselect=false;
                }
            }
            this.navData2[x].isselect=!this.navData2[x].isselect;
            this.navData2.splice(x,1,this.navData2[x]);
        },
        //点击交易类型某一项
        selecttype(index){
            this.selecttypeindex=index
        },
        //重置类型
        resetTrs(){
            this.selecttypeindex=0
        },
        // 确定某种类型
        confirmTrs(){
            this.transcode="";
            this.transcode=this.selectlist[this.selecttypeindex].TransCode;
            if(this.selecttab=="0"){
                this.isselectshow=false;
                this.navData0[0].text = this.selectlist[this.selecttypeindex].TransName;
                for(let i in this.navData0){
                    this.navData0[i].isselect=false;
                }
            // this.navData0.splice(i,1,this.navData0[x]);
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.isselectshow=false;
                this.navData1[0].text = this.selectlist[this.selecttypeindex].TransName;
                for(let i in this.navData1){
                    this.navData1[i].isselect=false;
                }
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.isselectshow=false;
                this.navData2[0].text = this.selectlist[this.selecttypeindex].TransName;
                for(let i in this.navData2){
                    this.navData2[i].isselect=false;
                }
                this.getDeal();
            }

        },
        // 点击交易时间某一项
        selecttime(index){
            this.selecttimeindex=index;
            var timeflag=this.timeflaglist[this.selecttimeindex].value;
            if(this.timeflaglist[this.selecttimeindex].text == "自定义") {
                this.dateSelfColShow= true;
            }else{
                this.dateSelfColShow= false;
                this.starttime="请输入开始日期";
                this.endtime="请输入结束日期";
                this.begindate='';
                this.enddate='';
                if(timeflag!='M1'){
                    this.BeginDate=this.calcDate('/',timeflag);
                }else{//本月
                    this.BeginDate=this.getFirstDate();//本月第一天
                }
                this.EndDate=this.getNowFormatDateWeex('/');
            }
        }, 
        // 获取当前日期
        getNowFormatDate(){
            var date = new Date();
            var seperator = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
            month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
            }
            this.currentdate = year + seperator + month + seperator + strDate;
            this.getBeforeDate(this.currentdate);
        },
        // 获取当前日期之前两年半的时间
        getBeforeDate(datt){
            datt = datt.split('-');
            var newDate = new Date(datt[0], datt[1] - 1, datt[2]);
            var befminuts = newDate.getTime() - 1000 * 60 * 60 * 24 * parseInt(900);//计算前几天用减，计算后几天用加，最后一个就是多少天的数量 n为向前或者向后天数
            var beforeDat = new Date;
            beforeDat.setTime(befminuts);
            var befMonth = beforeDat.getMonth() + 1;
            var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
            var befDate = beforeDat.getDate();
            var da = befDate >= 10 ? befDate : '0' + befDate;
            this.mindate = beforeDat.getFullYear() + '-' + mon + '-' + da;
        },
        // 自定义选择开始时间       
        pickstartDate() {
            pickerdate.pickDate(
                {
                value: this.starttime,
                max: this.currentdate,
                min: this.mindate
                },
            event => {
                if (event.result === "success") {
                    var start = event.data;
                    this.begindate =  start.substring(0, 4) +"-"+start.substring(5, 7) +"-"+start.substring(8, 10);
                    this.starttime=this.begindate;
                    this.BeginDate=start.substring(0, 4) +"/"+start.substring(5, 7) +"/"+start.substring(8, 10);
                    
                    }
                })
        },
        //自定义选择结束时间   
        pickendDate() {
            pickerdate.pickDate(
                {
                value: this.endtime,
                max: this.currentdate,
                min: this.mindate
                },
            event => {
                if (event.result === "success") {
                    var end = event.data;
                    this.enddate = end.substring(0, 4) +"-"+end.substring(5, 7) +"-"+end.substring(8, 10);
                    this.EndDate = end.substring(0, 4) +"/"+end.substring(5, 7) +"/"+end.substring(8, 10);
                    this.endtime = this.enddate;
                    }
                })
        },
        // 重置时间
        resetTime(){
            this.selecttimeindex = 1;
            this.dateSelfColShow= false;
            this.BeginDate=this.getFirstDate();//默认本月，所以BeginDate默认本月第一天
            this.EndDate=this.getNowFormatDateWeex('/');
            this.starttime="请输入开始日期";
            this.endtime="请输入结束日期";
            this.begindate='';
            this.enddate='';
        },
        //确定某个时间
        confirmTime(){
            if(this.timeflaglist[this.selecttimeindex].text == "自定义") {
                if(this.starttime=="请输入开始日期"){
                    wjalert.alert("请输入开始日期","确定",data=>{});
                    return                   
                }
                if(this.endtime=="请输入结束日期") {
                    wjalert.alert("请输入结束日期","确定",data=>{});
                    return;
                }
            }
            if(this.selecttab=="0"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                this.isselectshow=false;
                this.navData0[1].text = this.timeflaglist[this.selecttimeindex].text;
                for(let i in this.navData1){
                    this.navData0[i].isselect=false;
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    wjalert.alert("开始日期不能大于结束日期","确定",data=>{});
                    return
                } 
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                this.isselectshow=false;
                this.navData1[1].text = this.timeflaglist[this.selecttimeindex].text;
                for(let i in this.navData1){
                    this.navData1[i].isselect=false;
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    wjalert.alert("开始日期不能大于结束日期","确定",data=>{});
                    return
                } 
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                this.isselectshow=false;
                this.navData2[1].text = this.timeflaglist[this.selecttimeindex].text;
                for(let i in this.navData1){
                    this.navData1[i].isselect=false;
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    wjalert.alert("开始日期不能大于结束日期","确定",data=>{});
                    return
                } 
                this.getDeal();
            }
        },
        //金额改变事件
        amountChange(event) {
            this.StartAmount = event.value;
        },
        amountChangeHigh(event) {
            this.EndAmount = event.value;
        },
        //重置交易金额
        resetAmt(){
            this.StartAmount="";
            this.EndAmount="";
        },
        // 确定某交易金额
        confirmAmt(){
            if(this.StartAmount!=""&&this.EndAmount!=""){
                if(this.StartAmount*1>this.EndAmount){
                    wjalert.alert("起始金额不能大于结束金额","确定",data=>{});
                    return
                } 
            }
            if(this.selecttab=="0"){
                for(let i in this.navData0){
                    this.navData0[i].isselect=false;
                }
                this.selectAmt=true;
                this.getJnl();
            }else if(this.selecttab=="1"){
                for(let i in this.navData1){
                    this.navData1[i].isselect=false;
                }
                this.selectAmt=true;
                this.getCheck();
            }else if(this.selecttab=="2"){
                for(let i in this.navData2){
                    this.navData2[i].isselect=false;
                }
                this.selectAmt=true;
                this.getDeal();
            }
            
            this.isselectshow=false;
        },
        // 点击某一状态获取下标
        selectstatus(index){
            this.selectstatusindex = index;
        },
        // 重置状态
        resetStatus(){
             this.selectstatusindex=0;
        },
        // 确定某一状态
        confirmStatus(){
            this.jnlstate="";
            this.jnlstate=this.statuslist[this.selectstatusindex].Value
            this.isselectshow=false;            
            if(this.selecttab=="0"){
                this.navData0[3].text = this.statuslist[this.selectstatusindex].Name;
                for(let i in this.navData0){
                    this.navData0[i].isselect=false;
                }
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.navData1[3].text = this.statuslist[this.selectstatusindex].Name;
                for(let i in this.navData1){
                    this.navData1[i].isselect=false;
                }
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.navData2[3].text = this.statuslist[this.selectstatusindex].Name;
                for(let i in this.navData2){
                    this.navData2[i].isselect=false;
                }
                this.getDeal();
            }
        },
        // 请求我发起的资源列表并传到父级
        getJnl(){
            //服务需要上送的字段
            var params = {
                TransCode:this.transcode,
                JnlState:this.jnlstate,
                AcNo:"",
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag
            };
            this.$emit('WorkList',params);
            // this.goJson("/eweb/MobQueryJnls.do", params, response => { 
            //     this.auduitList=response.data.EjnlList;
            //     this.$store.state.auduitList=response.data.EjnlList;
            //     this.$emit('WorkList',this.auduitList);
            // });
       },
       // 请求待审核的资源列表并传到父级
        getCheck(){
            //服务需要上送的字段
            var params = {
                TransCode:this.transcode,
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag,
            };
            this.$emit('WorkList',params);
            // this.goJson("/eweb/AuthListForMob.do", params, response => {
            //     this.checkList=response.data.EjnlList;
            //     for(let i in this.checkList){
            //         this.checkList[i].selectShow=false;
            //     }
            //     this.$store.state.checkList=this.checkList
            //     this.$store.state.showall = false;
            //     this.$store.state.tocheck = 0;
            //     this.$store.state.totalAmount="0.00";
            //     this.$store.state.SumAmount=response.data.SumAmount
            //     this.$emit('WorkList',this.checkList);
            // });
       }, 
       // 请求我处理的资源列表并传到父级       
       getDeal(){
           //服务需要上送的字段
            var params = {
                TransCode:this.transcode,
                JnlState:this.jnlstate,
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag
            };
            this.$emit('WorkList',params);
            // this.goJson("/eweb/AuthMyDealQry.do", params, response => {
            //     this.dealList=response.data.EtrsJnlList;
            //     this.$emit('WorkList',this.dealList);
            // });
       },
    },
};
</script>
