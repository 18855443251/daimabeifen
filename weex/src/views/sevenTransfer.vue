<template>
<div class="wrapper">
    <NavBar :title="title"></NavBar>
    <scroller v-if="norecordFlag=='2'">
        <div class="contents">
            <div class="allcontents" v-for="(item,index) in auduitList" :key="index" @click="jumpdetail(item)"> 
                <div class="details">
                    <text class="details_type">{{item.TransName}}</text>
                    <text  class="details_amt" v-if="item.Amount">¥{{item.Amount|money}}</text>
                </div>
                <div class="details">
                    <text class="details_trstime">{{item.TransTime}}</text>
                    <text class="details_status">{{runstatus(item.TrsFlag)}}</text>
                </div>                   
            </div>
            <div class="kong"></div>
        </div>
    </scroller>
    <div class="empty" v-if="norecordFlag=='1'">
        <image class="emptyimg" :src="emptyurl"></image>
        <text class="emptytext">暂无查询记录</text>
    </div>  
</div>


</template>

<style scoped>
.wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(250,250,250,1);
}
.contents{
    width: 750px;
    display: flex;
    flex-direction: column;
}
.allcontents{
    width: 690px;
    height: 150px;
    margin-top: 20px;
    margin-left: 30px;
    background-color: #ffffff;
    border-width: 1px;
    border-color: rgb(245, 245, 245);
    border-style:solid;
    border-radius: 12px;
    position: relative;
    /* box-shadow: 0 10px 15px rgba(200, 96, 96, 0.14); */
    flex-direction: column;
    align-items: center;
}
.details{
    margin-left: 15px;
    margin-right: 15px;
    flex-direction: row;
    justify-content: space-between;
    width: 635px;
    height: 65px;
    line-height: 65px;
    align-items: center;
}

.details_trstime{
    font-size: 24px;
    color: #AAAAAA;
}
.details_status{
    font-size: 28px;
    color: #7C7C7C;
}
.details_type{
    font-size: 30px;
    color: #333333;
    margin-top: 35px;
    font-weight: bold;
}
.details_amt{
    font-size: 32px;
    color: #333333;
    margin-top: 32px;
}
.emptytext{
    margin-top: 60px;
    /* width:212px;
    height:34px; */
    font-size:36px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.emptyimg{
    margin-top: 180px;
    width: 318px;
    height: 233px;
}
.empty{
    width: 750px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.kong{
    width: 750px;
    height: 200px;
}

</style>

<script>
    const context = weex.requireModule("context");
    const modal = weex.requireModule("modal");
    const stream = weex.requireModule("stream");
    import NavBar from "@/components/templet/titlebar";
export default {
    components: { NavBar},
    data() {
        return {
            title: "转账汇款",
            emptyurl:'./imgs/tab_bench/empty@3x.png',
            StartAmount:"",
            EndAmount:"",
            jnlState:"",
            begindate:"",
            enddate:"",
            timeflag:"10",
            transcode:"Transfer",
            auduitList: [],
            showBtn: "",
            norecordFlag:'0',//是否显示无记录的背景图
        };
    },
    mounted() {
        this.begindate=this.calcDate('-','D6');
        this.enddate=this.getNowFormatDateWeex('-');
        this.getAuduit()
    },
    methods: {
        // 获取我发起的列表
        getAuduit() {
            //服务需要上送的字段
            var params = {
                TransCode:this.transcode,
                JnlState:"0",
                AcNo:"",
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag,
                CurrentIndex:0,
                PageSize:'9999'
            };
            this.goJson("/eweb/MobQueryJnls.do", params, response => {
                this.auduitList=response.data.EjnlList;
                if(this.auduitList.length=='0'){
                    this.norecordFlag='1';
                }else{
                    this.norecordFlag='2';
                }
            });
        },       
        // 根据TransCode跳转不同详情页  
        jumpdetail(item){ 
            context.sessionSetString("everyDetailInfo",JSON.stringify(item));
            context.sessionSetString("TransStatus", item.TrsFlag);              
            context.sessionSetString("TransName", item.TransName);
            context.sessionSetString("JnlNo", item.JnlNo);
            context.sessionSetString("TransCode", item.TransCode);
            context.sessionSetString("showBtn", "1");
            if(item.TransCode == "Transfer") {
                context.launchStage("main.hnzzdetail");
            }
        },

    }
    
}
</script>