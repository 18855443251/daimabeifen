<template>
    <div class="not">
      <navBar :title="title" ></navBar>
      <scroller class="head">
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>
        <div class="write_wrap bg">
            <div class="transfer_tit">
                <text class="gray">票据信息</text>
            </div>
            <!-- list组件 -->
            <commonDetailDiscount :ticketList="ticketList"></commonDetailDiscount>  
            <div class="amt_wrap">
              <text class="amt_text">实收金额:{{ totalAmount | fomatMoney }}元</text>
            </div>
            <div class="transfer_line"></div>
            <div class="transfer_tit">
              <text class="gray">美团银行农村商业银行银票贴现申请书</text>
            </div>
            <div class="detail_parent">
              <commonContent :contentList="nowMsg"></commonContent>
            </div>
        </div>
        <show-botton v-if="showBtn == '0'"></show-botton>
      </scroller>
    </div>
</template>
<style scoped>
.bg {
  background-color: rgb(250, 250, 250);
}
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
  margin-top: 0;
  margin-bottom: 0;
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
}
.transfer_tit {
  padding-top: 16px;
  padding-bottom: 16px;
}
.gray {
  font-size: 26px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.list_content {
  width: 690px;
  background-color: rgb(250, 250, 250);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(245, 245, 245);
  border-radius: 12px;
  margin-bottom: 10px;
  /* margin-left: 30px; */
  /* margin-right: 30px; */
  padding-right: 22px;
  padding-left: 22px;
}
</style>

<script>
import NavBar from "@/components/templet/titlebar";
import commonContent from "@/components/detail/commonContent.vue";
import commonDetail from "@/components/detail/commonDetail.vue";
import commonDetailDiscount from "@/components/detail/commonDetailDiscount.vue"; // 列表
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  components: { NavBar, commonContent, commonDetail, commonDetailDiscount,showBotton, intiateProgress, Progress },
  data() {
    return {
      title: "贴现",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
      remark: "交易款项",
      ticketList: [],
      inserMsg: [], //贴入人信息
      nowMsg: [], //贴现信息
      enterMsg: [],
      totalAmount: "",
      CheckAuthItemList:[],
      userinfo:'',
      CifName:'',
      CifNo:''
    };
  },

  created() {
        this.userinfo=JSON.parse(context.sessionGetString('userinfo'));
        this.CifName=this.userinfo.CifName;
        this.CifNo=this.userinfo.CifNo;
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
        this.ticketList = response.data.EjnlList[0].List;
        this.totalLength = this.ticketList.length;
        let TpName = "";
        // const getApplyConfirmData = this.applyConfirmData;
        // 票据信息_列表数组数据
        this.ticketList.forEach((item, index) => {
          item.Tp == "AC01"
            ? (TpName = "银行承兑汇票")
            : item.Tp == "AC02" ? (TpName = "商业承兑汇票") : "";

          const newArr = [
            {
              name1: "序号:",
              text1: index + 1
            },
            {
              name1: "票据号：",
              text1: item.IdNb
            },
            {
              name1: "金额:",
              text1: this.money(item.stdpmmoney),
            },
            {
              name1: "出票日:",
              text1: this.toDate(item.stdissdate)
            },
            {
              name1: "到期日:",
              text1: this.toDate(item.stdduedate)
            },
            {
              name1: "承兑人:",
              text1: item.stdaccpnam
            },
            {
              name1: "贴现利率（%）:",
              text1: item.InterRate
            },
            {
              name1: "贴现利息:",
              text1: item.Interest
            },
            {
              name1: "实收金额:",
              text1: this.money(item.stdrealamt)
            }
          ];
          Vue.set(item, "foldFlag", false); // 展开收起字段
          Vue.set(item, "foldList", newArr); // 展开收起的内容集合
        });
        response.data.EjnlList[0].NowMsg.forEach((item, index)=>{
          const newArr = [
             {
                name1: "贴现申请人名称:",
                text1: this.CifName
              },
              {
                name1: "贴现申请人地址:",
                text1: item.Addr
              },
              {
                name1: "付息方式:",
                text1: "卖方付息"
              },
              {
                name1: "客户号:",
                text1: this.CifNo
              },
              {
                name1: "账号:",
                text1: item.Send_AcctID
              },
              {
                name1: "贴现金额:",
                text1: this.money(item.TotalDiscountAmt)
              },
              {
                name1: "系统提交日:",
                text1: this.toDate(item.NowDate)
              },
              {
                name1: "利息:",
                text1: item.TotalInterest
              },
              {
                name1: "实收金额:",
                text1: this.money(item.TotalStdrealamt)
              },
              {
                name1: "票据张数:",
                text1: item.Counter
              }
          ];
          this.totalAmount=this.money(item.TotalStdrealamt);
          this.nowMsg=this.nowMsg.concat(newArr);
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
          this.ticketList = response.data.EjnlList[0].List;
        this.totalLength = this.ticketList.length;
        let TpName = "";
        // const getApplyConfirmData = this.applyConfirmData;
        // 票据信息_列表数组数据
        this.ticketList.forEach((item, index) => {
          item.Tp == "AC01"
            ? (TpName = "银行承兑汇票")
            : item.Tp == "AC02" ? (TpName = "商业承兑汇票") : "";

          const newArr = [
            {
              name1: "序号:",
              text1: index + 1
            },
            {
              name1: "票据号：",
              text1: item.IdNb
            },
            {
              name1: "金额:",
              text1: this.money(item.stdpmmoney),
            },
            {
              name1: "出票日:",
              text1: this.toDate(item.stdissdate)
            },
            {
              name1: "到期日:",
              text1: this.toDate(item.stdduedate)
            },
            {
              name1: "承兑人:",
              text1: item.stdaccpnam
            },
            {
              name1: "贴现利率（%）:",
              text1: item.InterRate
            },
            {
              name1: "贴现利息:",
              text1: item.Interest
            },
            {
              name1: "实收金额:",
              text1: this.money(item.stdrealamt)
            }
          ];
          Vue.set(item, "foldFlag", false); // 展开收起字段
          Vue.set(item, "foldList", newArr); // 展开收起的内容集合
        });
        
         response.data.EjnlList[0].NowMsg.forEach((item, index)=>{
          const newArr = [
             {
                name1: "贴现申请人名称:",
                text1: this.CifName
              },
              {
                name1: "贴现申请人地址:",
                text1: item.Addr
              },
              {
                name1: "付息方式:",
                text1: "卖方付息"
              },
              {
                name1: "客户号:",
                text1: this.CifNo
              },
              {
                name1: "账号:",
                text1: item.Send_AcctID
              },
              {
                name1: "贴现金额:",
                text1: this.money(item.TotalDiscountAmt)
              },
              {
                name1: "系统提交日:",
                text1: this.toDate(item.NowDate)
              },
              {
                name1: "利息:",
                text1: item.TotalInterest
              },
              {
                name1: "实收金额:",
                text1: this.money(item.TotalStdrealamt)
              },
              {
                name1: "票据张数:",
                text1: item.Counter
              }
          ];
          this.totalAmount=this.money(item.TotalStdrealamt);
          this.nowMsg=this.nowMsg.concat(newArr);
        });
      });
    },
  }
};
</script>