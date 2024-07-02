<template>
  <div class="container">
    <title-bar title="手机号支付注册协议"></title-bar>
    <scroller class="scr">
      <text class="big_title">江苏美团银行农村商业银行股份有限公司网上支付跨行</text>
      <text class="big_title">清算系统手机号码支付注册协议</text>
      <text class="small_title">甲方：{{UserName}}</text>
      <text class="small_title">乙方：江苏美团银行农村商业银行股份有限公司</text>
      <text class="small_title_bold">第一条	定义</text>
      <text class="small_title">1、业务信息</text>
      <text class="small_title">甲方指定办理手机号码支付业务信息如下：</text>
      <text class="small_title">账户名称：{{UserName}}</text>
      <text class="small_title">银行账号：{{AcNo}}</text>
      <text class="small_title">手机号码：{{mobilePhone}}</text>
      <text class="small_title">2、注册协议</text>
      <text class="small_title">点击/勾选“□我已阅读并同意《江苏美团银行农村商业银行股份有限公司网上支付跨行清算系统手机号码支付注册协议》”，即表明甲方已认真阅读本协议，对其具体内容及法律后果已有充分了解，并愿意按照本协议的约定享有权利及承担义务。</text>
      <text class="small_title">3、手机号码支付</text>
      <text class="small_title">本协议中的“手机号码支付”是指甲乙双方在符合法律法规、监管要求等前提下，甲方通过乙方手机银行渠道端向网上支付跨行清算系统(IBPS)注册手机号码和账户绑定信息，注册成功后可通过该手机号码直接办理收付款操作的业务。</text>
      <text class="small_title">4、默认账户</text>
      <text class="small_title">本协议中的“默认账户”是指甲方注册手机号码通过多家银行与多个账户绑定时，网上支付跨行清算系统(IBPS)在业务处理时优先关联的账户。</text>
      <text class="small_title_bold">第二条  甲方权利与义务</text>
      <text class="small_title">1、甲方自愿申请乙方提供的手机号码支付注册服务，并遵守乙方相关业务规则和规定，经乙方审核通过后，有权根据注册项目享受手机号码支付收付款业务服务。</text>
      <text class="small_title">2、甲方承诺注册业务均为本人办理，并保证注册时提供的信息真实、正确、完整、有效。</text>
      <text class="small_title">3、甲方通过乙方注册手机号码支付功能，同意乙方在法律、行政法规允许的范围内采集、保存、整理、加工、使用其提交的身份及账户信息，这些信息包括且不限于账户名称、证件类型、证件号码、手机号码、账户号码等信息。</text>
      <text class="small_title">4、甲方使用一个预留在乙方的手机号码进行注册，该预留手机号码是指经乙方验证后确为甲方本人持有并留存乙方的手机号码。</text>
      <text class="small_title">5、甲方注册手机号码支付功能须绑定在乙方开立的银行结算账户，并可选择将其乙方绑定账户设置为默认账户；若在乙方开立多个结算账户时，只能绑定其中一个结算账户。</text>
      <text class="small_title">6、甲方注册手机号码支付功能应同时符合以下条件：</text>
      <text class="small_title">（1）在乙方已开立手机银行时间在6个月（含）以上，手机银行注销再次开通的，以新开通手机银行时间为准；</text>
      <text class="small_title">（2）拟绑定账户在6个月内有主动发起的实际资金交易；</text>
      <text class="small_title">（3）拟绑定账户状态正常。</text>
      <text class="small_title">7、甲方注册成功后，变更绑定银行账户预留手机号码的，系统会核验老手机号的验证码，通过系统校验的，可以继续用新手机号使用乙方提供的手机号转账服务；未通过系统校验的，将暂停手机号转账服务，应自新手机号码变更之日起预留满6个月（含）后方可注册。</text>
      <text class="small_title">8、甲方注册成功后，绑定银行账户变更证件类型、证件号码、姓名三者中某一项信息的，应在变更以上信息前主动注销手机号码支付功能。</text>
      <text class="small_title">9、甲方注册成功后，可享受乙方提供以下“一站式”服务：</text>
      <text class="small_title">（1）查询注册手机号码绑定的所有银行账户（包括他行）信息；</text>
      <text class="small_title">（2）变更默认账户；</text>
      <text class="small_title">（3）	注销手机号码绑定的部分或全部账户信息。</text>
      <text class="small_title">10、甲方注册成功后，可凭该手机号码进行转账汇款、资金归集等场景的收付业务，具体场景类型以乙方系统提供为准。</text>
      <text class="small_title">11、甲方有责任对其关键信息进行妥善保管，因保管不善造成被他人恶意冒充使用，由此产生的责任或导致甲方或乙方损失的，由甲方承担。</text>
      <text class="small_title_bold">第三条乙方权利与义务</text>
      <text class="small_title">1、乙方支持甲方使用手机银行端进行手机号码注册、变更、注销等操作。乙方后续有权根据情况开通支持其他渠道端的使用。</text>
      <text class="small_title">2、乙方支持甲方使用借记账户进行手机号码绑定注册。乙方后续有权根据情况开通支持其他类型账户的注册与绑定功能。</text>
      <text class="small_title">3、乙方通过手机银行渠道端受理客户注册、变更、注销手机号码支付业务信息时，有权采取有效措施对甲方进行身份识别，包括且不限于人脸识别等技术，并基于身份信息数据库进行比对等两种或以上动态认证因素，确保甲方交易的安全性。</text>
      <text class="small_title">4、乙方有权根据对甲方的身份识别情况，决定是否受理甲方的业务申请。</text>
      <text class="small_title">5、乙方在法律法规许可和甲方授权的范围内使用甲方的相关信息及交易记录。乙方有义务对甲方提供的申请资料和交易内容等信息保密，但法律、法规另有规定的除外。</text>
      <text class="small_title">6、在乙方系统正常运行情况下，乙方负责及时准确地处理甲方发送的电子银行业务指令，并及时向甲方提供查询等服务，因人民银行系统异常等不可抗力因素造成的除外。</text>
      <text class="small_title">7、乙方负责对手机号码支付业务限额进行设置，后续有权可根据业务需要对限额进行统一调整</text>
      <text class="small_title">8、乙方有权根据系统升级等需要暂停手机号码支付服务，有权对提供的服务项目或内容进行调整或更新，但将提前通过乙方网站或营业网点进行公告。</text>
      <text class="small_title">9、甲方开通手机号码支付功能的银行账户发生以下情形之一时，乙方有权主动发起注销手机号码支付操作。</text>
      <text class="small_title">（1）变更预留手机号码；</text>
      <text class="small_title">（2）注销银行账户；</text>
      <text class="small_title">（3）因特殊原因补换银行账户号码</text>
      <text class="small_title">（4）其他对业务产生实际性影响的信息变更</text>
      <text class="small_title">10、乙方有权对手机号码支付业务监控，对于甲方多次发起账户信息验证请求而未进行支付的行为，可采取必要措施予以限制或纠正。</text>
      <text class="small_title">11、乙方负责及时为甲方办理手机号码支付业务手续，并按甲方申请功能的不同为甲方提供相应的服务。</text>
      <text class="small_title">12、乙方负责向甲方提供手机号码支付业务咨询服务。</text>
      <text class="small_title">13、甲方注册手机号码支付功能时，如手机号码已被他人注册过，乙方将联系甲方进行核实，并根据以下情况进行分别处理：</text>
      <text class="small_title">（1）甲方同意放弃注册申请的，设置原号码注册申请失败。</text>
      <text class="small_title">（2）甲方坚持原申请的，应于3个工作日内持本人有效身份证件和待确认的手机到我行柜面完成手机动态验证码、证件号码及卡密码等相关要素的核验，确认该手机号码为甲方所有且控制。查验通过的，原号码注册申请继续保留；查验未通过的，设置原号码注册申请为失败。</text>
      <text class="small_title">（3）甲方坚持原申请的，但未按规定时间（3个工作日内）配合乙方完成手机动态验证码、证件号码及卡密码等方式的查验，设置原号码注册申请为失败。</text>
      <text class="small_title">（4）乙方在24小时内无法获取甲方反馈时，设置原号码注册申请为失败。</text>
      <text class="small_title">14、甲方完成注册后，他人在乙方或者其他行注册手机号码时，发现该手机号码已被甲方占用，乙方将联系甲方进行核实，并根据以下情况进行分别处理：</text>
      <text class="small_title">（1）甲方同意注销原注册信息，设置注销原注册信息。</text>
      <text class="small_title">（2）甲方不同意注销原注册信息，设置原手机号码的注册信息为“临时冻结”，在“临时冻结”状态下，通过该手机号码无法检索关联的账户信息。甲方应于3个工作日内持本人有效身份证件和待确认的手机到我行柜面完成手机动态验证码、证件号码及卡密码等相关要素的核验，确认该手机号码为甲方所有且控制。查验通过的，设置原注册信息解冻；查验未通过的，设置注销原注册信息。</text>
      <text class="small_title">（3）甲方不同意注销原注册信息，但未按规定时间（3个工作日内）配合乙方完成手机动态验证码、证件号码及卡密码等方式的查验，且新注册人在我行或者他行查验通过的情况下，设置注销原注册信息。</text>
      <text class="small_title_bold">第四条  争议解决</text>
      <text class="small_title">甲乙双方在履行本协议的过程中，如发生争议，应协商解决。协商不成的，如甲方在乙方营业网点申办注册业务的，任何一方均可向乙方营业网点住所地的人民法院提起诉讼；如甲方通过个人网银、手机银行等渠道申办注册业务的，任何一方均可向办理注册业务相关的银行卡开卡行所在地的人民法院提起诉讼。在协商、诉讼期间，双方对本协议中无争议的条款仍须履行。</text>
      <text class="small_title_bold">第五条  法律适用条款</text>
      <text class="small_title">本协议的成立、生效、履行和解释，均适用中华人民共和国法律、行政法规或部门规章；法律、行政法规或部门规章无明文规定的，可适用通行的金融惯例。</text>
      <text class="small_title_bold">第六条  违约责任</text>
      <text class="small_title">1、甲方对手机号码支付注册时提供的信息真实性、完整性负责，因甲方虚假提供信息所造成的风险和损失由甲方承担，乙方不承担任何责任。</text>
      <text class="small_title">2、甲方开通手机号码支付功能后，预留手机号码、绑定账户变更或注销等情况未及时有效的通知乙方，造成乙方无法准确、及时地为其处理有关业务时，乙方不承担任何责任。</text>
      <text class="small_title">3、除法律法规规定外，乙方未对甲方手机号码支付注册过程中的信息进行保密，因此造成甲方资金损失，乙方根据相关规定承担相应责任（因甲方过失的除外）。</text>
      <text class="small_title">4、协议存续期间，甲方无正当、合理理由或未向乙方做出说明，擅自终止协议，给乙方造成损失的，甲方以乙方实际的损失额承担相应赔偿责任。</text>
      <text class="small_title_bold">第七条  协议的中止与终止</text>
      <text class="small_title">1、乙方提供的手机号码支付服务受甲方绑定银行账户状态的制约，如该绑定账户因挂失、冻结、止付等原因不能正常使用，相关服务自动中止。甲方账户状态恢复正常时，乙方重新提供相应的服务。</text>
      <text class="small_title">2、甲方主动完成手机号码注销手续，或预留手机号码变更或绑定银行账户销户等原因乙方自动完成注销的，本协议即为终止。</text>
      <text class="small_title">3、在甲方违反本协议规定或其他乙方业务规定的情况下，乙方有权中止或终止本协议。</text>
      <text class="small_title">4、发生以下情况之一时，乙方有权终止或解除本协议。</text>
      <text class="small_title">（1）甲方恶意操作、诋毁或损害乙方声誉的；</text>
      <text class="small_title">（2）甲方利用乙方提供服务从事违法犯罪活动的。</text>
      <text class="small_title_bold">第八条  协议的效力和生效</text>
      <text class="small_title">1、本协议自甲方点击同意后立即生效。</text>
      <text class="small_title">2、本协议生效后，协议的任何条款如因法律原因而被确认无效，并不影响本协议其他条款的效力，甲乙双方应全面履行本协议约定的义务，任何一方不履行或不完全履行约定义务，应承担相应的违约责任，并赔偿因此给对方造成的损失。</text>
      <text class="small_title">3、本协议生效后，若甲方后续变更注册绑定银行账户，亦视为同意遵循本协议，本协议内容同样有效。</text>
      <text class="small_title">4、本协议是对甲方与乙方签订的其他相关既有协议和约定的补充而非替代文件，如本协议于其他既有协议和约定有冲突，涉及手机号码支付业务内容的，应以本协议为准；对本协议未予以明确的内容，按照法律法规、中国人民银行或中国银行业监督管理委员会相关规定执行。</text>
      <text class="small_title">本协议的最终解释权归乙方江苏美团银行农村商业银行股份有限公司所有。乙方可以网站公告、手机短信通知等方式对本协议相关条款进行解释或修改。</text>
      <text class="small_title_bold">特别提示：您已阅读本协议所有条款，并对本协议条款的含义及相应的法律后果已全部知晓并充分理解，特别是免除或限制责任的条款，并同意承担由此带来的一切法律后果。</text>  
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
        mobilePhone:"",
        UserName:"",
        AcNo:""
    };
  },
  computed: {
 
  },
  mounted() {
    this.mobilePhone = context.secureGetString("Mobiel"); //手机号
    this.UserName =  context.secureGetString("UserName"); //姓名
    this.AcNo = context.getParam("AcNo");//银行卡号
  },
  methods: {
  
  }
};
</script> 

<style scoped>
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
