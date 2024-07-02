<template>
  <div class="all">
      <navBar :title="title"></navBar>
      <scroller>
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>
        <div class="write_wrap">
          <div class="transfer_tit">
            <text class="gray">票据信息</text>
          </div>
          <!-- list组件 -->
          <commonDetail :ticketList="ticketList"></commonDetail>  
          <div class="amt_wrap">
            <text class="amt_text">共{{totalLength}}张，合计¥{{money(totalAmount)}}元</text>
          </div>
          <div class="transfer_line"></div>
          <div class="transfer_tit">
            <text class="gray">回复信息</text>
          </div>
          <div class="detail_parent">
            <commonContent :contentList="signMsg"></commonContent>
          </div>
        </div>
        <show-botton v-if="showBtn == '0'"></show-botton>
      </scroller>
  </div>
</template>
<style scoped>
.transfer_line {
  width: 690px;
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: rgb(204, 204, 204);
  padding-top: 30px;
}
.amt_wrap {
  flex-direction: row;
  justify-content: flex-end;
}
.amt_text {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.detail_parent {
  width: 690px;
  padding-left: 22px;
  padding-right: 22px;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(245, 245, 245);
  border-radius: 12px;
}
.write_wrap {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 150px;
  background-color: rgb(250, 250, 250);
}
.transfer_tit {
  padding-top: 16px;
  padding-bottom: 16px;
}
.gray {
  font-size: 26px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
</style>

<script>
import NavBar from "@/components/templet/titlebar";
import commonContent from "@/components/detail/commonContent.vue";
import commonDetail from "@/components/detail/commonDetail.vue"; // 列表
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  components: { NavBar, commonContent, commonDetail, showBotton, intiateProgress, Progress },
  data() {
    return {
      title: "",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
      remark: "交易款项",
      ticketList: [],
      totalLength: "", //总数量
      totalAmount: "",
      signMsg: [],
      CheckAuthItemList:[]
    };
  },

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
        this.totalAmount = this.detail.Amount;
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
                text1: this.getNewDraftStsNm(item.stdbilstat)
              }
            ];
            Vue.set(item, "foldFlag", false); // 展开收起字段
            Vue.set(item, "foldList", newArr); // 展开收起的内容集合
          });
        }
        let newMark = "";
        if (this.detail.Stdsgnrres == "SU00") {
          newMark = "同意签收";
        } else {
          newMark = "拒绝签收";
        }
        this.signMsg.push({
          name1: "回复标记:",
          text1: newMark
        });
        
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
          this.totalAmount = this.detail.Amount;
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
                  text1: this.getNewDraftStsNm(item.stdbilstat)
                }
              ];
              Vue.set(item, "foldFlag", false); // 展开收起字段
              Vue.set(item, "foldList", newArr); // 展开收起的内容集合
            });
          }
          let newMark = "";
          if (this.detail.Stdsgnrres == "SU00") {
            newMark = "同意签收";
          } else {
            newMark = "拒绝签收";
          }
          this.signMsg.push({
            name1: "回复标记:",
            text1: newMark
          });
      });
    },
  }
};
</script>