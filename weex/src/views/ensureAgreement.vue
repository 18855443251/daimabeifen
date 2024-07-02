<template>
  <div class="container">
    <title-bar title="诚e金用户协议"></title-bar>
    <scroller class="scr">
      <text class="big_title">江苏美团银行农村商业银行股份有限公司资金监管协议</text>
      <text class="small_title">甲方：江苏美团银行农村商业银行股份有限公司</text>
      <text class="small_title">乙方：{{SincereOrga}}</text>
      <text class="small_title">丙方：{{UserName}}</text>
      <text class="small_title">甲、乙、丙三方经平等协商，在遵守中华人民共和国相关法律法规及监管规定的前提下，就个人资金监管达成一致，同意签署本协议</text>
      <text class="small_title_bold">第一条 监管范围及监管账户</text>
      <text class="small_title">（一）个人资金监管（以下简称“个人保证金”），是指甲方接受乙方和丙方共同委托，按照本协议约定进行资金监管，协助乙方和丙方对指定账户资金进行冻结、解冻等交易。本协议所述“个人保证金”，不构成担保法上的保证金质押担保，不产生优先受偿的效力。</text>
      <text class="small_title">（二）个人保证金管理平台是实现个人资金监管的系统。支持丙方在甲方提供的服务渠道进行个人保证金申请、追加和取消；支持乙方发送保证金确认、撤销、解约等操作指令。</text>
      <text class="small_title">（三）个人保证金受理币种为人民币，在指定账户项下实现金额冻结。</text>
      <text class="small_title">（四）冻结期限，又称资金监管期限，是指甲方受乙方和丙方委托，依据本协议对丙方个人保证金进行监管的期限，在此期间，由甲方将丙方监管资金进行冻结。冻结期限，由乙方和丙方商定，原则上最长为1年（含），自个人保证金被冻结之时开始计算。在未发生本协议约定解冻事项且未发生有权机构查询、冻结、扣划的前提下，超过冻结期限的，个人保证金解冻，本协议终止。</text>
      <text class="small_title">（五）乙方和丙方应通过登录甲方手机银行、企业网银开通资金监管服务的渠道办理本协议项下服务。</text>
      <text class="small_title_bold">第二条 资金监管</text>
      <text class="small_title">（一）个人保证金申请</text>
      <text class="small_title">1.丙方在甲方提供的服务渠道提交个人保证金申请，根据页面提示选择或填写相关信息，包括但不限于业务类型、合作单位、申请姓名、身份证件号码、联系方式、保证金金额等。丙方提交个人保证金申请时登入的账号和密码是甲方确认丙方身份的依据。</text>
      <text class="small_title">2.甲方向乙方发送丙方个人保证金的申请信息，乙方进行系统确认后，甲方对丙方的资金进行监管。</text>
      <text class="small_title">3.冻结金额是丙方提交个人保证金申请资金监管的金额，从丙方提交个人保证金申请乙方确认成功之时开始冻结。</text>
      <text class="small_title">4.资金监管期限内，乙方不具有冻结资金的使用权。但法律法规另有规定的除外。</text>
      <text class="small_title">（二）个人保证金解冻</text>
      <text class="small_title">情况1：丙方提交取消申请</text>
      <text class="small_title">丙方个人保证金申请成功后，在乙方未确认状态下，可在原办理渠道申请取消，账户资金解冻，资金恢复正常。</text>
      <text class="small_title">丙方个人保证金申请成功后，在乙方已确认状态下，丙方申请取消，由乙方同意后，乙方向甲方发送个人保证金撤销指令，甲方将账户资金解冻，资金恢复正常。</text>
      <text class="small_title">情况2：乙方发送解冻指令</text>
      <text class="small_title">乙方向甲方发送保证金解冻指令，甲方在约定的时间内，对丙方监管资金解冻。</text>
      <text class="small_title">情况3：协议到期</text>
      <text class="small_title">资金监管期限到期后的当天，甲方对丙方的监管资金进行解冻。</text>
      <text class="small_title">情况4：特殊情况扣划</text>
      <text class="small_title">在资金监管期限内，如遇有权机关对丙方个人账户内的个人保证金进行查询、冻结、扣划等任何限制措施，由此产生的风险、损失、责任由丙方和乙方自行承担。</text>
      <text class="small_title">如有权机关对丙方个人银行账户内的个人保证金进行强制扣划，甲方仅对个人保证金的剩余部分继续履行本协议约定的资金监管义务，强制扣划后无剩余部分的，本协议自动解除。</text>
      <text class="small_title">（三）本协议解除或终止后，丙方有权自行处理账户内资金。</text>
      <text class="small_title_bold">第三条 各方权利与义务</text>
      <text class="small_title">（一）甲方权利和义务</text>
      <text class="small_title">1.甲方根据本协议约定提供资金监管业务，有权依照乙方、丙方根据本协议第二条发出的指令对丙方账户中的资金进行冻结、解冻操作，而无须另行取得丙方同意。甲方对丙方和乙方之间的任何争议和纠纷不承担任何垫付、担保和赔偿责任。</text>
      <text class="small_title">2.如果甲方发现丙方和乙方中任何一方提供的信息存在错误、虚假、欺诈或保证金来源不合法等情况，甲方有权立即停止提供本协议项下的服务，由此产生的责任、风险、损失由乙方或丙方各自承担。</text>
      <text class="small_title">3.如法院、检察院、公安部门等有权机关要求冻结或扣划保证金账户内的资金或本业务涉及款项，甲方将根据要求操作，由此产生的责任、风险、损失由丙方、乙方自行承担。</text>
      <text class="small_title">（二）乙方权利和义务</text>
      <text class="small_title">1.乙方必须为合法登记、具有与甲方合作项目相关经营资格的企业。乙方同意本协议规定的业务流程模式，愿意按照该流程模式进行操作，相关约定对乙方具有法律约束力。</text>
      <text class="small_title">2.乙方应及时进行个人保证金确认、解除冻结操作，乙方不得无故拒绝或拖延发送上述指令。因乙方无故拒绝或拖延提供上述指令致使丙方无法及时解除个人保证金冻结的，相关责任由乙方承担。</text>
      <text class="small_title">3.乙方发送的确认、解冻等指令，均基于与丙方签订的相关交易合同或消费合同等，根据确切事实及合法理由，并经与丙方协商一致，不会导致任何争议、纠纷或侵犯任何组织、个人的合法权益。如因此发生任何争议或纠纷或其他侵权事件，均由乙方自行解决承担相关责任；如因此造成甲方被投诉、索赔或被追究责任的，乙方还需对甲方名誉、经济等方面损失给予赔偿。</text>
      <text class="small_title">4.乙方确认在个人保证金冻结期间内，向甲方发出除本协议第二条资金监管所约定的方式以外的指令，甲方均有权拒绝。甲方仅根据本协议约定的方式进行操作，由此产生的风险、损失、责任等由乙方自行承担。</text>
      <text class="small_title">5.乙方应根据甲方要求提供证明交易合法性、真实性等相关材料。</text>
      <text class="small_title">（三）丙方权利和义务</text>
      <text class="small_title">1.丙方必须是具有完全民事行为能力的自然人，丙方确认存入个人账户的资金合法，如因资金来源引起任何纠纷，丙方需对此承担责任。丙方确认已充分了解并同意本协议及业务流程模式，愿意按照本协议约定的流程模式进行操作，相关约定对丙方具有法律约束力。</text>
      <text class="small_title">2.丙方确认在资金监管冻结期限内，向甲方发出除本协议第二条资金监管所约定的方式以外的指令，甲方均有权拒绝。甲方仅根据第二条服务的流程所约定的方式进行操作，由此产生的风险、损失、责任等由丙方自行承担。</text>
      <text class="small_title">3.甲方按照丙方申请的个人保证金金额进行监管。个人保证金申请成功，甲方生成银行订单号，供乙方和丙方查询。订单状态为企业未确认的状态下，客户可以随时取消或者修改。</text>
      <text class="small_title">4.丙方授权甲方将个人身份信息、个人账户信息、个人金融交易信息等向乙方提供，以供甲方履行本协议使用。</text>
      <text class="small_title">5.丙方应根据甲方要求提供证明交易合法性、真实性等相关材料。</text>
      <text class="small_title_bold">第四条 声明和承诺</text>
      <text class="small_title">乙方和丙方声明和承诺如下：</text>
      <text class="small_title">（一）乙方为依法注册并合法存续、具备签订和履行本协议所需的完全民事权利能力和行为能力的法人；丙方为具有完全民事行为能力的自然人。乙方已向丙方充分披露产品、服务相关信息，乙方和丙方均在真实交易背景下，完成资金监管。</text>
      <text class="small_title">（二）签署和履行本协议系基于乙方和丙方的真实意思表示，乙方和丙方具有签署并履行本协议相应的能力，签署并履行本协议不存在任何违反法律法规政策的情形；乙方和丙方已经取得签订和履行本协议所需的一切有关批准、许可、备案或者登记。</text>
      <text class="small_title">（三）乙方、丙方向甲方保证，其在本协议项下向甲方提供的任何文件和信息（包括但不限于个人信息、交易信息、单据、证明文件、支付凭证、支付申请或书面说明）是真实的、准确的、完整的，对合法合规性承担全部责任，并确保甲方不会因此受到任何损害。如拒绝配合提供，或者提供的信息不真实、不准确、不完整或无效，甲方有权中止或终止为客户提供服务。</text>
      <text class="small_title">（四）乙方和丙方承诺，不涉及利用银行账户进行偷逃税款、逃废债务、洗钱、套取现金及其他违法犯罪活动，监管资金的来源合法，其用途不违反任何法律法规的规定。</text>
      <text class="small_title">（五）当有关乙方、丙方信息发生变化时，乙方、丙方应及时到甲方办理变更手续，如身份证件过期等。乙方、丙方未在合理期限内更新且未提出合理理由的，甲方有权中止或终止提供金融服务。</text>
      <text class="small_title_bold">第五条 违约责任</text>
      <text class="small_title">（一）任何一方违反本协议规定内容，给其他方造成损失的，违约方应向受损失方赔偿相关损失。</text>
      <text class="small_title">（二）任何乙方和丙方违反本协议造成的一切经济、法律责任，均由违反承诺的乙方和丙方承担，如甲方因此受到损失的，乙方和丙方应承担全额连带赔偿责任。</text>
      <text class="small_title">（三）乙方和丙方之间的违约责任、违约金比例和支付，由乙方和丙方另行协商，与本协议无关，与甲方无关。</text>
      <text class="small_title_bold">第六条 不可抗力及其免责事由</text>
      <text class="small_title">凡因自然灾害、军事行为、意外事件、政府管制、法规改变、黑客入侵、病毒爆发或其他当事方不可控制的因素造成一方不能履行本协议，当事方不承担违约责任，但遭受不可抗力或有其他免责事由的一方应及时书面通知对方不能履行的理由。</text>
      <text class="small_title_bold">第七条 变更、修改与终止</text>
      <text class="small_title">（一）本协议经三方协商一致，可以书面形式进行变更或修改，任何变更或修改均构成本协议不可分割的组成部分。发生下述任何情况之一，本协议即终止：</text>
      <text class="small_title">1.甲方、乙方、丙方协商一致解除本协议。</text>
      <text class="small_title">2.甲方、乙方、丙方已经按照约定完全履行本协议。</text>
      <text class="small_title">3.发生法律规定或本协议约定的终止或解除情形。</text>
      <text class="small_title">4.本协议有效期满。</text>
      <text class="small_title">（二）甲方如发现乙方、丙方符合下列情形时，有权单方面终止或中止本协议，或者限制为客户提供金融服务的范围：</text>
      <text class="small_title">1.如甲方有合理理由怀疑乙方或丙方涉嫌洗钱、恐怖融资或其他违法犯罪行为，或者乙方、丙方或其交易列入国际组织、中国或其他国家制裁名单或制裁范围。</text>
      <text class="small_title">2.经核实乙方或丙方所提供的材料或信息严重失实。</text>
      <text class="small_title">3.乙方或丙方存在本协议项下违约行为。</text>
      <text class="small_title">（三）甲方根据本协议，按照乙方指令将丙方资金解冻，或者协议到期，甲方的监管责任即告解除。</text>
      <text class="small_title_bold">第八条 法律适用与争议解决</text>
      <text class="small_title">（一）本协议适用中华人民共和国法律</text>
      <text class="small_title">（二）在本协议生效后，因订立、履行本协议所发生的或与本协议有关的一切争议，双方可协商解决。协商不成的，任何一方依法向甲方住所地有管辖权的人民法院起诉，进行解决争议。</text>
      <text class="small_title">（三）在争议解决期间，若该争议不影响本协议其他条款的履行，则其他条款应继续履行。</text>
      <text class="small_title">（四）丙方如与乙方因相关合同等产生争议、纠纷，丙方应与乙方协商解决。</text> 
      <text class="small_title_bold">第九条 其他约定</text> 
      <text class="small_title">甲方因法律法规、监管规定变化或监管部门要求，不能履行协议或不能按照协议约定履行的，甲方有权终止或依据法律、监管规定变化或监管部门要求变更履行本协议。因该种原因致协议终止或变更使甲方不能履行或不能按照协议约定履行的，甲方免除责任。</text>
      <text class="small_title" style="text-decoration:underline">本协议内容甲方已向乙方和丙方充分告知、说明，乙方和丙方已理解并同意本协议的全部内容。</text>
      <text class="small_title">乙方或丙方对用户名、密码履行保密义务，如因保管不当、密码泄露所产生的风险由乙方或丙方自行承担。使用用户名、密码办理的业务、进行的操作均视为其本人所为。</text>
      <text class="small_title_bold">第十条  协议生效</text> 
      <text class="small_title">本协议自丙方、乙方确认签署并经甲方确认后生效。</text>
      <text class="one_open" @click="next">同意</text>
    </scroller>
  </div>

</template> 

<script>
const context = weex.requireModule("context");
import TitleBar from "@/components/templet/titlebar";


export default {
  components: {
    TitleBar,
  },
  created() {

  },
  data() {
    return {
        UserName:"",
        AcNo:""
    };
  },
  computed: {
 
  },
  created(){
    
  },
  mounted() {
    this.UserName =  context.secureGetString("UserName"); //姓名
    this.SincereOrga = context.getParam("SincereOrga");//银行卡号
  },
  methods: {
    next(){
      setTimeout(data=>{
        context.secureSetString("ensureAgreementisSee","1");
        this.goBack();
      },200)
    }
  }
};
</script> 

<style scoped>
  .one_open{
    width:690px;
    height:90px;
    background-color:rgb(238,63,35);
    text-align:center;
    color:rgb(255,255,255);
    font-size:30px;
    border-radius:10px;
    line-height:90px;
    margin-top:40px;
    margin-left:30px;
    margin-bottom: 40px;
  }
  .scr{
    background-color: #ffffff;
  }
  .small_title_bold{
    color:rgb(34,34,34);
    font-size: 28px;
    width: 750px;
    line-height: 40px;
    text-indent: 2em;
    font-weight: bold;
  }
  .small_title{
    color:rgb(34,34,34);
    font-size: 26px;
    width: 750px;
    line-height: 40px;
    text-indent: 2em;
  }
  .big_title{
    color:rgb(34,34,34);
    font-size: 32px;
    text-align: center;
    width: 750px;
    line-height: 50px;
    font-weight: bold;
  }

</style>
