<template>
    <div>
      <nav-bar :title="title"></nav-bar>
      <div class="content">
        <div class="one">
            <div class="title">
                <text class="top">本次登录信息</text>
            </div>
            <div class="message">
              <div class="rowFame">
                <text class="key">用户名：</text>
                <text class="value">{{ThisLoginInfo.UserId}}</text>
              </div>
              <div class="rowFame">
                <text class="key">登录时间：</text>
                <text class="value">{{ThisLoginTime}}</text>
              </div>
              <div class="rowFame">
                <text class="key">登录设备：</text>
                <text class="value">{{ThisLoginInfo.MachineName.replace(/,/g, ".")}}</text>
              </div>
              <div class="rowFame">
                <text class="key">设备号：</text>
                <text class="value_two">{{ThisLoginInfo.MachineNo}}</text>
              </div>
              <div class="rowFame">
                <text class="key_two">系统版本：</text>
                <text class="value_three">{{ThisLoginInfo.OSVersion}}</text>
              </div>
              <div class="rowFame_three">
                <text class="key">手机银行版本：</text>
                <text class="value">{{ThisLoginInfo.AppVersion}}</text>
              </div>
          </div>
        </div>
        <div class="two">
            <div class="title">
                <text class="top">上次登录信息</text>
            </div>
            <div class="message">
              <div class="rowFame">
                <text class="key">用户名：</text>
                <text class="value">{{LastLoginInfo.UserId}}</text>
              </div>
              <div class="rowFame">
                <text class="key">登录时间：</text>
                <text class="value">{{LastLoginTime}}</text>
              </div>
              <div class="rowFame">
                <text class="key">登录设备：</text>
                <text class="value">{{LastLoginInfo.MachineName.replace(/,/g, ".")}}</text>
              </div>
              <div class="rowFame">
                <text class="key">设备号：</text>
                <text class="value_two">{{LastLoginInfo.MachineNo}}</text>
              </div>
              <div class="rowFame">
                <text class="key_two">系统版本：</text>
                <text class="value_three">{{LastLoginInfo.OSVersion}}</text>
              </div>
              <div class="rowFame_three">
                <text class="key">手机银行版本：</text>
                <text class="value">{{LastLoginInfo.AppVersion}}</text>
              </div>
        </div>
      </div>
   </div>
    </div>
</template>

<style scoped>
.head{
  width:750px;
  top:150px;
  bottom:0px;
  position:fixed; 
}
.content{
    width: 750px;
    background-color:rgba(250,250,250,1);
}
.one{
    width:690px;
    border-radius:12px;
    margin-top:30px;
    margin-left:30px;
    background-color:rgba(255,255,255,1);
    border-bottom-color: rgba(245,245,245,1);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-top-color: rgba(245,245,245,1);
    border-top-style: solid;
    border-top-width: 1px;
    border-left-color: rgba(245,245,245,1);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-color: rgba(245,245,245,1);
    border-right-style: solid;
    border-right-width: 1px;
    background-color: rgba(255,255,255,1);
}
.two{
    width:690px;
    border-radius:12px;
    margin-top:30px;
    margin-left:30px;
    background-color:rgba(255,255,255,1);
    border-bottom-color: rgba(245,245,245,1);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-top-color: rgba(245,245,245,1);
    border-top-style: solid;
    border-top-width: 1px;
    border-left-color: rgba(245,245,245,1);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-color: rgba(245,245,245,1);
    border-right-style: solid;
    border-right-width: 1px;
    background-color: rgba(255,255,255,1);
}
.title{
    width:690px;
    height:92px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234,234,234,1);
}
.top{
    width:192px;
    height:32px;
    font-size:32px; 
    margin-top:30px;
    margin-left: 24px;
    line-height:32px;
    font-weight:bold;
    color:rgba(51,51,51,1);
    font-family:PingFang-SC-Bold,PingFang-SC;
}
.message{
    width:690px;
}
.rowFame{
    display: flex;
    justify-content: space-between;
    margin-top:30px;
    padding-left:24px;
    padding-right:24px;
    flex-direction: row;
}
.rowFame_three{
    display: flex;
    justify-content: space-between;
    margin-top:30px;
    padding-left:24px;
    padding-right:24px;
    flex-direction: row;
    margin-bottom:30px;
}
.key{
    font-size:30px;
    font-weight:500;
    line-height:30px;
    /* margin-top:30px; */
    /* margin-left:24px; */
    color:rgba(51,51,51,1);
    font-family:PingFang-SC-Medium,PingFang-SC;
}
.key_two{
    font-size:30px;
    font-weight:500;
    line-height:30px;
    /* margin-top:30px; */
    /* padding-top:30px; */
    /* margin-left:24px; */
    color:rgba(51,51,51,1);
    font-family:PingFang-SC-Medium,PingFang-SC;
}
.value{
    font-size:30px;
    font-weight:500;
    line-height:30px;
    /* top:30px; */
    /* right:24px;
    position:absolute; */
    color:rgba(102,102,102,1);
    font-family:PingFang-SC-Medium,PingFang-SC;
}
.value_two{
  
    width:350px;
    font-size:30px;
    font-weight:500;
    /* right:24px;
    position:absolute; */
    text-align: right;
    color:rgba(102,102,102,1);
    font-family:PingFang-SC-Medium,PingFang-SC;
}
.value_three{
    width:350px;
    font-size:30px;
    font-weight:500;
    /* padding-top:30px; */
    /* right:24px;
    position:absolute; */
    text-align: right;
    color:rgba(102,102,102,1);
    font-family:PingFang-SC-Medium,PingFang-SC;
}
</style>

<script>
import NavBar from "../components/titlebar_component.vue"
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");

export default {
  components: { NavBar },
  data() {
    return {
      title: "登录记录查询",

      RateList:"",
      LastLoginInfo:"",
      ThisLoginInfo:"",
      LastLoginTime:"",
      ThisLoginTime:""
    };
  },
  mounted() {
    
  },
  created() {
      this.getRate();
  },
  methods: {
    getRate(){
      this.post('/eweb/LoginNotesQry.do',{

      },((response)=>{

        this.LastLoginInfo = response.data.LastLoginInfo;
        this.LastLoginTime = response.data.LastLoginInfo.LoginTime.substring(0, 19);

        this.ThisLoginInfo = response.data.ThisLoginInfo;
        this.ThisLoginTime = response.data.ThisLoginInfo.LoginTime.substring(0, 19);
      }))
    }
  }
};
</script>
