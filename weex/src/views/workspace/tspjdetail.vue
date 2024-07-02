<template>
    <div class="not">
      <NavBar :title="title"></NavBar> 
      <scroller class="head">
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>
          <!-- list组件 -->
        <div class="confrim_wrap">
          <commonDetail :ticketList="ticketList" style="margin-bottom:20px"></commonDetail>           
          <div class="total_wrapper" :class="[showBtn == '0'?'total_wrapper_heightBotom':'total_wrapper_normalBotom']">
            <div class="toAll">
              <text class="toLength">共{{totalLength}}张</text>
              <div class="toTotal">
                <text class="toJi">
                合计:
                </text>
                <text class="toAmount">¥{{money(totalAmount)}}元</text>
              </div>
            </div>
          </div>
        </div>     
        <show-botton v-if="showBtn == '0'"></show-botton>
      </scroller>
    </div>
</template>
<style scoped>
.bg {
  background-color: rgb(250, 250, 250);
  height: 100vh;
}
.confrim_wrap {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 100px;
  padding-top: 30px;
}

.total_wrapper {
  position: fixed;
  
  left: 0;
  right: 0;
  width: 750px;
  /* box-shadow: 0px -1px 6px 0px rgba(0,0,0,0.06); */
  background-color: rgb(255, 255, 255);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(245, 245, 245);
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 30px;
}
.total_wrapper_normalBotom{
  bottom: 0;
}
.total_wrapper_heightBotom{
  bottom: 90px;
}
.toAll {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.toTotal {
  flex-direction: row;
  align-items: center;
}
.toJi {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #333333;
  white-space: unset;
}
.toAmount {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: #ed4665;
}


</style>
<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
import NavBar from "@/components/templet/titlebar";
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
import commonDetail from "@/components/detail/commonDetail.vue"; // 列表
module.exports = {
    data() {
        return {
            title: "",
            JnlNo:"",
            TransCode:"",
            TransStatus: "",
            detail: {},
            showBtn: "",
            jobsinfoisopen: false,
            ticketList: [],
            totalAmount: "",
            totalLength: "",
            CheckAuthItemList:[]

        };
    },
    components: { NavBar, showBotton, intiateProgress, Progress, commonDetail },
    created() {
        this.TransStatus=context.sessionGetString("TransStatus");
        this.title=context.sessionGetString("TransName");
        this.JnlNo=context.sessionGetString("JnlNo");
        this.TransCode=context.sessionGetString("TransCode");
        this.showBtn=context.sessionGetString("showBtn");
        if(this.showBtn == "0") {
          this.getCheckDetail()
        } else if(this.showBtn == "1"){
          this.getDetail()
        }
    },
  methods: {
    //请求我发起的和我处理的详情信息
    getDetail() {
      this.goJson("/eweb/AuthEjnlDetail.do", {
          TransCode: this.TransCode,
          JnlNo: this.JnlNo
      }, response => {
        this.detail = response.data.EjnlList[0];
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
        this.ticketList = this.detail.List;
        this.totalAmount += this.detail.Amount;
        if (this.ticketList) {
          this.totalLength = this.ticketList.length;
          let TpName = "";
          // 列表数组数据
          this.ticketList.forEach((item, index) => {
            if (item.Tp == "AC01") {
              TpName = "银行承兑汇票";
            } else if (item.Tp == "AC02") {
              TpName = "商业承兑汇票";
            }
            const newArr = [
              {
                name1: "票据号：",
                text1: item.IdNb
              },
              {
                name1: "票据类型:",
                text1: TpName
              },
              {
                name1: "票面金额(元):",
                text1: this.money(item.Amount),
              },
              {
                name1: "出票日:",
                text1: this.toDate(item.IsseDt)
              },
              {
                name1: "到期日:",
                text1: this.toDate(item.DueDt)
              },
              {
                name1: "出票人名称:",
                text1: item.Drwr_Nm
              },
              {
                name1: "承兑人名称:",
                text1: item.Accptr_Nm
              },
              {
                name1: "收款人名称:",
                text1: item.Pyee_NM
              },
              {
                name1: "票据状态:",
                text1: this.getNewDraftStsNm(item.DraftSts)
              }
            ];
            Vue.set(item, "foldFlag", false); // 展开收起字段
            Vue.set(item, "foldList", newArr); // 展开收起的内容集合
          });
        }
      })
    },
    //请求待审核的交易详情
    getCheckDetail(){
        this.goJson("/eweb/AuthDetailQuery.do", {
            TransCode:this.TransCode,
            _AuthJnlNo:this.JnlNo
        }, response => {
          this.detail = response.data.EjnlList[0];
          this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
          this.ticketList = this.detail.List;
          this.totalAmount += this.detail.Amount;
          if (this.ticketList) {
          this.totalLength = this.ticketList.length;
          let TpName = "";
          // 列表数组数据
          this.ticketList.forEach((item, index) => {
            if (item.Tp == "AC01") {
              TpName = "银行承兑汇票";
            } else if (item.Tp == "AC02") {
              TpName = "商业承兑汇票";
            }
            const newArr = [
              {
                name1: "票据号：",
                text1: item.IdNb
              },
              {
                name1: "票据类型:",
                text1: TpName
              },
              {
                name1: "票面金额(元):",
                text1: this.money(item.Amount),
              },
              {
                name1: "出票日:",
                text1: this.toDate(item.IsseDt)
              },
              {
                name1: "到期日:",
                text1: this.toDate(item.DueDt)
              },
              {
                name1: "出票人名称:",
                text1: item.Drwr_Nm
              },
              {
                name1: "承兑人名称:",
                text1: item.Accptr_Nm
              },
              {
                name1: "收款人名称:",
                text1: item.Pyee_NM
              },
              {
                name1: "票据状态:",
                text1: this.getNewDraftStsNm(item.DraftSts)
              }
            ];
            Vue.set(item, "foldFlag", false); // 展开收起字段
            Vue.set(item, "foldList", newArr); // 展开收起的内容集合
          });
        }
      });
    },
    
  }
};
</script>
