<template>
  <div class="not">
    <navBar :title="title"></navBar>
    <scroller class="head">
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
          <text class="gray">背书人信息</text>
        </div>
        <div class="detail_parent">
          <commonContentNoPadding :contentList="endorserMsg"></commonContentNoPadding>
        </div>
        <div class="transfer_tit">
          <text class="gray">被背书人信息</text>
        </div>
        <div class="detail_parent">
          <!-- <commonContent :contentList="ownBank ? ownMsg : noOwnMsg"></commonContent> -->
          <commonContentNoPadding :contentList="ownMsg"></commonContentNoPadding>
        </div>
        <div class="transfer_tit">
          <text class="gray">背书信息</text>
        </div>
        <div class="detail_parent">
          <commonContentNoPadding :contentList="transferMsg"></commonContentNoPadding>
        </div>
         <!-- 按钮 -->        
      </div>
      <show-botton v-if="showBtn=='0'"></show-botton>
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
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.write_wrap {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 150px;
  background-color: rgb(250, 250, 250);
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
.transfer_tit {
  padding-top: 16px;
  padding-bottom: 16px;
}
.gray {
  font-size: 26px;
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
  margin-bottom: 20px;
  /* margin-left: 30px;
  margin-right: 30px; */
  padding-right: 22px;
  padding-left: 22px;
}
</style>

<script>
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
import commonContentNoPadding from "@/components/detail/commonContentNoPadding.vue";
import commonDetail from "@/components/detail/commonDetail.vue"; // 列表
import NavBar from "@/components/templet/titlebar";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  components: { NavBar, commonContentNoPadding, commonDetail, showBotton, intiateProgress, Progress },
  data() {
    return {
      title: "背书转让",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      remark: "交易款项",
      showBtn: "",
      ticketList: [],
      totalLength: "", //总数量
      totalAmount: "",
      endorserMsg: [],
      ownMsg: [],
      transferMsg: [],
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
        this.getdata();
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
          this.getdata();
      });
    },
    getdata() {
        this.ticketList = this.detail.List;
        this.totalAmount = this.detail.Amount;
        this.totalLength = this.ticketList.length;
        let TpName = "";
        // 列表数组数据
        this.ticketList.forEach((item, index) => {
          // TpName = (item.Tp == "AC01") ? '银行承兑汇票' && (item.Tp == "AC02") : "商业承兑汇票"
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
              name1: "票面金额:",
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
              name1: "出票状态:",
              text1: this.getNewDraftStsNm(item.DraftSts)
            }
          ];
          Vue.set(item, "foldFlag", false); // 展开收起字段
          Vue.set(item, "foldList", newArr); // 展开收起的内容集合
        });
        // 背书人信息数据
        this.endorserMsg.push(
          {
            name1: "背书人名称：",
            text1: this.ticketList[0].Endrsr_Nm
          },
          {
            name1: "背书人账号:",
            text1: this.detail.Endrsr_AcctId
          }
        );
        // if (this.ownBank) {
        // 本行被背书人信息数据
        this.ownMsg.push(
          {
            name1: "被背书人名称",
            text1: this.detail.Endrsee_Nm
          },
          {
            name1: "被背书人账号:",
            text1: this.detail.Endrsee_AcctId
          },
          {
            name1: "被背书人开户网点名称:",
            text1: this.detail.Endrsee_AcctSvcrName
          }
        );
        // 转让标记
        const Endrsmt_BanEndrsmtMk = this.detail.Endrsmt_BanEndrsmtMk;
        let newEndrsmt_BanEndrsmtMk = "";
        if (Endrsmt_BanEndrsmtMk == "EM01") {
          newEndrsmt_BanEndrsmtMk = "不得转让";
        } else if (Endrsmt_BanEndrsmtMk == "EM00") {
          newEndrsmt_BanEndrsmtMk = "可再转让";
        }
        this.transferMsg.push({
          name1: "转让标记:",
          text1: newEndrsmt_BanEndrsmtMk
        });
    }
  }
};
</script>