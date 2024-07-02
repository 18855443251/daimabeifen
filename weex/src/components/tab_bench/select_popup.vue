<template>
  <div class="all">
      <div class="select-item" v-if="selecttabindex=='0'">
          <div class="listitem">
              <div v-for="(item, index) in selectlist" :key="index" :class="[index==selecttypeindex?'select_div0':'select_div']"  @click="selecttype(index)"> 
                  <text :class="[index==selecttypeindex?'select_title0':'select_title']">{{item.TransName}}</text>
              </div>
          </div>
          <div class="footer">
              <div class="leftbutton">
                 <text class="addbutton leftbuttontext" @click="resetTrs">重置</text>  
              </div>
              <div class="rightbutton">
                 <text class="addbutton rightbuttontext" @click="confirmTrs">确定</text>  
              </div> 
          </div> 
     </div>
      <div class="select-item"  v-if="selecttabindex=='1'">
          <div class="trsdate">
              <text class="trstime">交易时间</text>
              <div class="timeitem">
                <div v-for="(item, index) in timeflaglist" :key="index" :class="[index==selecttimeindex?'selecttime_div0':'selecttime_div']"  @click="selecttime(index)"> 
                    <text :class="[index==selecttimeindex?'select_title0':'select_title']">{{item.text}}</text>
                </div>
              </div>
              <text class="trstime">自定义</text>
            <div class="timeitem">
                <div class="choosedate" @click="pickstartDate">
                    <text class="date">{{starttime}}</text>
                </div>
                <div class="p"></div>
                <div class="choosedate" @click="pickendDate">
                    <text class="date">{{endtime}}</text>
                </div>
              </div>
          </div>
          <div class="footer">
              <div class="leftbutton">
                 <text class="addbutton leftbuttontext" @click="resetTime">重置</text>  
              </div>
              <div class="rightbutton">
                 <text class="addbutton rightbuttontext" @click="confirmTime">确定</text>  
              </div> 
          </div> 
     </div>
    <div class="select-item"  v-if="selecttabindex=='2'">
            <div class="trsdate">
              <text class="trstime">交易金额</text>
              <div class="timeitem">
                <div class="choosedate">
                    <input type="number" v-model="StartAmount" placeholder="¥最低金额" class="amt_word" />
                </div>
                <div class="p"></div>
                <div class="choosedate">
                    <input type="number" v-model="EndAmount" placeholder="¥最高金额" class="amt_word"/>
                </div>
              </div>
          </div>
          <div class="footer">
              <div class="leftbutton">
                 <text class="addbutton leftbuttontext" @click="resetAmt">重置</text>  
              </div>
              <div class="rightbutton">
                 <text class="addbutton rightbuttontext" @click="confirmAmt">确定</text>  
              </div> 
          </div> 
     </div>
    <div class="select-item" v-if="selecttabindex=='3'">
          <div class="listitem">
              <div v-for="(item, index) in statuslist" :key="index" :class="[index==selectstatusindex?'select_div0':'select_div']"  @click="selectstatus(index)"> 
                  <text :class="[index==selectstatusindex?'select_title0':'select_title']">{{item.Name}}</text>
              </div>
          </div>
          <div class="footer">
              <div class="leftbutton">
                 <text class="addbutton leftbuttontext" @click="resetStatus">重置</text>  
              </div>
              <div class="rightbutton">
                 <text class="addbutton rightbuttontext" @click="confirmStatus">确定</text>  
              </div> 
          </div> 
     </div>
 </div>   
</template>
<script>
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
const pickerdate = weex.requireModule("picker");
  export default { 
    props: {
        selecttabindex: {type:String, default: ""},
        selecttab: {type:String, default: ""},
    },
    data() {
      return{
        selecttypeindex:0,
        selecttimeindex:0,
        selectstatusindex:0,
        selectlist:[{TransName:"全部",TransCode:""},{TransName:"单笔转账",TransCode:"GroupSingleDown"},{TransName:"银企对账",TransCode:"CurrentReckoning"},{TransName:"代发工资",TransCode:"ewjrcb.AgentSalary"}],
        timeflaglist:[{text:"当天",value:"Today"},{text:"本月",value:"M1"},{text:"近三月",value:"M3"},{text:"近六月",value:"M6"}],
        statuslist:[{Name:"全部",Value:""},{Name:"待审核",Value:"6"},{Name:"交易成功",Value:"0"},{Name:"交易失败",Value:"2"}],
        transcode:"",//交易类型
        jnlstate:"",//交易状态
        StartAmount:"",//最低金额
        EndAmount:"",//最高金额
        begindate:"",//开始日期
        enddate:"",//结束日期
        timeflag:"",//时间段标志  today-当天  M1-本月  M3-近三月  M6-近六月
        auduitList:[],//发起的列表
        checkList:[],//待审核列表
        dealList:[],//我处理的列表
        starttime:"请输入开始日期",
        endtime:"请输入结束日期"
      }
    },
    created(){
    },
    methods: {
        selecttype(index){
            this.selecttypeindex=index
        },
        resetTrs(){
            this.selecttypeindex=0
        },
        confirmTrs(){
            // alert(this.selecttab)
            this.transcode="";
            this.transcode=this.selectlist[this.selecttypeindex].TransCode;
            if(this.selecttab=="0"){
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.getDeal();
            }
            this.$store.state.isselectshow=false
        },
        selecttime(index){
            this.selecttimeindex=index;
            // this.timeflag=this.timeflaglist[index].Value;
            // if(this.selecttab=="0"){
            //     this.getJnl();
            // }
           
        },        
        pickstartDate() {
            pickerdate.pickDate(
                {
                value: this.starttime
                },
            event => {
                if (event.result === "success") {
                    var start = event.data;
                    this.begindate =  start.substring(0, 4) +"-"+
                                    start.substring(5, 7) +"-"+
                                    start.substring(8, 10);
                    this.starttime=this.begindate;
                    }
                })
            },
        pickendDate() {
            pickerdate.pickDate(
                {
                value: this.endtime
                },
            event => {
                if (event.result === "success") {
                    var end = event.data;
                    this.enddate = end.substring(0, 4) +"-"+
                                    end.substring(5, 7) +"-"+
                                    end.substring(8, 10);
                    this.endtime = this.enddate;
                    }
                })
            },
        resetTime(){
            this.selecttimeindex=0;
            this.starttime="请输入开始日期";
            this.endtime="请输入结束日期";
        },
        confirmTime(){
            if(this.selecttab=="0"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                if(this.starttime=="请输入开始日期"||this.endtime=="请输入结束日期"){
                    this.begindate="";
                    this.enddate="";
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    modal.alert({
                        message:"开始日期不能大于结束日期"
                    })
                    return
                } 
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                if(this.starttime=="请输入开始日期"||this.endtime=="请输入结束日期"){
                    this.begindate="";
                    this.enddate="";
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    modal.alert({
                        message:"开始日期不能大于结束日期"
                    })
                    return
                } 
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.timeflag=this.timeflaglist[this.selecttimeindex].value;
                if(this.starttime=="请输入开始日期"||this.endtime=="请输入结束日期"){
                    this.begindate="";
                    this.enddate="";
                }
                var begindate = new Date(this.begindate);
                var enddate = new Date(this.enddate);
                if(begindate.getTime() > enddate.getTime()){
                    modal.alert({
                        message:"开始日期不能大于结束日期"
                    })
                    return
                } 
                this.getDeal();
            }
        },
        resetAmt(){
            this.StartAmount="";
            this.EndAmount="";
        },
        confirmAmt(){
            if(this.StartAmount*1>this.EndAmount){
                modal.alert({
                    message:"最低金额不能大于最高金额"
                })
                return
            }
            if(this.selecttab=="0"){
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.getDeal();
            }
        },
        selectstatus(index){
            this.selectstatusindex=index;
        },
        resetStatus(){
             this.selectstatusindex=0;
        },
        confirmStatus(){
            this.jnlstate="";
            this.jnlstate=this.statuslist[this.selectstatusindex].Value            
            if(this.selecttab=="0"){
                this.getJnl();
            }else if(this.selecttab=="1"){
                this.getCheck();
            }else if(this.selecttab=="2"){
                this.getDeal();
            }
        },
        getJnl(){
            this.goJson("/eweb/MobQueryJnls.do", {
                TransCode:this.transcode,
                JnlState:this.jnlstate,
                AcNo:"",
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag
            }, response => {

            this.auduitList=response.data.List;
            this.$store.state.AuthTotal=this.auduitList.length;
            this.$store.state.auduitList=response.data.List;
            });
       },
        getCheck(){
            this.goJson("/eweb/AuthListForMob.do", {
                TransCode:this.transcode,
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag
            }, response => {

            this.checkList=response.data.List
            for(let i in this.checkList){
                this.checkList[i].selectShow=false;
            }
            this.$store.state.checkList=this.checkList
            this.$store.state.checkTotal=this.checkList.length
            this.$store.state.tocheck="0";
            this.$store.state.totalAmount="0.00";
            this.$store.state.SumAmount=response.data.SumAmount
            });
       },        
       getDeal(){
            this.goJson("/eweb/AuthMyDealQry.do", {
                TransCode:this.transcode,
                TrsState:this.jnlstate,
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag
            }, response => {

            this.dealList=response.data.authList
            this.$store.state.dealList =this.dealList
            });
       },
    }
  }
  </script>
<style scoped>
.all{
  background-color: rgba(0, 0, 0, 0.65);
  width:750px;
  
}
.list-mask{
    position: absolute;
    top: 100px;
    left: 0;
    width: 750px;
    z-index: 10;
    /* background-color: black; */
    background-color: rgba(0, 0, 0, 0.65);
    opacity: 1;
  }
  .select-item{
    flex-direction: row;
    flex-wrap: wrap;    
    background-color: #ffffff;
    /* align-items: center;
    justify-content: space-around; */
    height: 540px;
    width: 750px;
    overflow-y: auto;
    position: fixed;
    left:0px;
    top: 574px;
  }  
   .listitem{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 750px;
    margin-top: 40px;
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
    width: 312px;
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
    font-size: 28px;
    color: #AAAAAA;
    line-height: 70px;
    text-align: center;
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
    bottom: 220px;
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
</style>
