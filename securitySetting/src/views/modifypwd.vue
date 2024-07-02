<template>
  <div>
    <nav-bar :title="title"></nav-bar>
    <scroller class="head">
        <div class="container">
            <div class="contentt">
                <div class="phoneInfo">
                    <text class="phone">原登录密码：</text>
                    <input type="text" class="aliasinput" maxlength ='5' v-model="aliasname" placeholder="请输入原登录密码"/>
                    <wjPassword   class="phoneinput" 
                                ref="oldpwd"
                                kbdType="all" 
                                maxLength="12" 
                                minLength="6" 
                                ></wjPassword>
                </div>
            </div>
            <div class="content">
                <div class="phoneInfo">
                    <text class="phone">新登录密码：</text>
                    <input type="text" class="aliasinput" maxlength ='5' v-model="aliasname" placeholder="请输入新登录密码"/>
                    <wjPassword   class="phoneinput" 
                                ref="newpwd"
                                kbdType="all" 
                                maxLength="12" 
                                minLength="6" 
                                ></wjPassword>
                </div>
            </div>
            <div class="content">
                <div class="phoneInfo">
                    <text class="phone">确认登录密码：</text>
                    <input type="text" class="aliasinput" maxlength ='5' v-model="aliasname" placeholder="请再输入一次"/>
                    <wjPassword   class="phoneinput" 
                                ref="newrepeatpwd"
                                kbdType="all" 
                                maxLength="12" 
                                minLength="6" 
                                ></wjPassword>
                </div>
            </div>
            <div class="btn" @click="nextStep">
                <text class="btntext" @click="jumpsucc">提交</text>
            </div>
            <div class="ps">
                <text class="pstext">温馨提示</text>
                <text class="pstwo">登录密码为6-20位数字和字母组合，字母注意区分大小写。</text>
            </div>
        </div>
    </scroller>
  </div>
</template>
<style scoped>
.container{
    width: 750px;
    height: 1206px;
    background:rgba(255,255,255,1);
}
.content{
    width: 720px;
    height: 110px;
    margin-top: 20px;
    margin-left:30px;
    /* box-shadow:0px -1px 0px 0px rgba(234,234,234,1); */
}
.contentt{
    width: 720px;
    height: 110px;
    margin-top: 20px;
    margin-left:30px;
    /* box-shadow:0px -1px 0px 0px rgba(234,234,234,1); */
}
.phoneInfo{
    flex-direction: row;
    /* margin-top: 20px;
    margin-left: 40px; */
}
.codeInfo{
    flex-direction: row;
    margin-top: 30px;
    margin-left: 40px;
}
.phone{
    width:150px;
    height:30px;
    font-size:30px;
    margin-top: 40px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:30px;
}
.phoneinput{
    font-size:28px;
    width: 400px;
    height: 50px;
    outline: none;
    color:rgba(153,153,153,0.6);
}
.btn {
  width:670px;
  height:88px;
  background:linear-gradient(124deg,rgba(251,93,122,1) 0%,rgba(230,2,44,1) 100%);
  border-radius:12px;
  flex-direction: row;
  margin-top: 80px;
  margin-left:40px;
  justify-content: space-around;
}
.ps{
    width:670px;
    height:162px;
    margin-top:39px;
    margin-left:40px;
}
.pstext{
    font-size:28px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:#555555;
    line-height:54px;
}
.pstwo{
    font-size:28px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:Medium;
    color:#666666;
    line-height:54px;
}
.aliasinput{
    width:400px;
    margin-top: 40px;
    right:20px;
    position:absolute;
}
.btntext {
  width:64px;
  height:32px;
  font-size:32px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(255,255,255,1);
  line-height:32px;
  margin-top:28px;
}
.aliasinput::-webkit-input-placeholder,textarea::-webkit-input-placeholder{  /* WebKit, Blink, Edge */
  /* font-size:30px;
  text-align: center;
  color:rgba(153,153,153,0.8);  */
  width:156px;
  height:28px;
  font-size:26px;
  right:30px;
  position:absolute;
  font-weight:500;
  line-height:28px;
  color:rgba(170,170,170,1);
  font-family:PingFang-SC-Medium,PingFang-SC;
}
</style>
<script>
  import NavBar from "../components/titlebar_component.vue"
  const modal = weex.requireModule('modal')
  const stream = weex.requireModule('stream')
  const context = weex.requireModule('context')
  const picker = weex.requireModule("picker")
  const wjalert = weex.requireModule("weex-alert")
  export default {
    components: { NavBar },
    data () {
      return {
          title:"修改登录密码",
          timeStamp:''
       }
    },
    methods:{
        nextStep(){
            if(context.secureGetString('LoginType') == 'V'){
                 this.vistorpwd();
            }else{
                  this.novistorpwd();
            }
        },
        //游客修改登录密码
        vistorpwd(){
            this.$refs.oldpwd.getLength(data => {
                if(data <= 1){
                   wjalert.alert('原密码不能为空',"确定",data=>{})   
                }else if(data < 6 || data > 12){
                      wjalert.alert('密码长度不符合要求格式',"确定",data=>{})   
                }else{
                 this.$refs.newpwd.getLength(data=>{
                    if(data<1){
                        wjalert.alert('新密码不能为空',"确定",data=>{})  
                    }else if(data < 6 || data > 12){
                        wjalert.alert('密码长度不符合要求格式',"确定",data=>{})  
                    }else{
                      this.$refs.newrepeatpwd.getLength(data=>{
                          if(data<1){
                              wjalert.alert('确认密码不能为空',"确定",data=>{})  
                          }else if(data < 6 || data > 12){
                               wjalert.alert('密码长度不符合要求格式',"确定",data=>{})  
                          }else {
                              //时间戳交易
                                stream.fetch({
                                    method: "POST",
                                    url: '/refacmob/Timestamp.do',
                                    type:"json",
                                    headers:{ "Content-Type": 'application/json'}
                                },response =>{
                                    this.timeStamp = response.data.Timestamp;
                                    //获取密码键盘内容 密码
                                    this.$refs.oldpwd.getValue(this.timeStamp,oldpwd =>{
                                    //获取密码键盘内容 密码
                                    this.$refs.newpwd.getValue(this.timeStamp,newpwd =>{
                                    //获取密码键盘内容 密码
                                    this.$refs.newrepeatpwd.getValue(this.timeStamp,newrepeatpwd =>{
                                        this.goJson('/refacmob/VistorLoginPwdUpd.do',{
                                                OldPassword:oldpwd.replace(/\+/g,"%2B"),
                                                NewPassword:newpwd.replace(/\+/g,"%2B"),
                                                ConfirmPassword:newrepeatpwd.replace(/\+/g,"%2B")
                                        },response=>{
                                                context.sessionSetString("isLogin", "");
                                                context.sessionSetString('userinfo', '');
                                                context.clearToken();
                                                context.replaceStage("main.login?flag=1");
                                                modal.toast({message:'密码修改成功'})
                                          }) 
                                       })
                                    })
                                }) 
                            })
                          }
                      })             
                    }
                 }) 
              }
           })
        },
        //非游客修改登录密码
        novistorpwd(){
            this.$refs.oldpwd.getLength(data => {
                if(data <= 1){
                   wjalert.alert('原密码不能为空',"确定",data=>{})   
                }else if(data < 6 || data > 12){
                      wjalert.alert('密码长度不符合要求格式',"确定",data=>{})   
                }else{
                 this.$refs.newpwd.getLength(data=>{
                    if(data<1){
                        wjalert.alert('新密码不能为空',"确定",data=>{})  
                    }else if(data < 6 || data > 12){
                        wjalert.alert('密码长度不符合要求格式',"确定",data=>{})  
                    }else{
                      this.$refs.newrepeatpwd.getLength(data=>{
                          if(data<1){
                              wjalert.alert('确认密码不能为空',"确定",data=>{})  
                          }else if(data < 6 || data > 12){
                               wjalert.alert('密码长度不符合要求格式',"确定",data=>{})  
                          }else {
                              //时间戳交易
                                stream.fetch({
                                    method: "POST",
                                    url: '/refacmob/Timestamp.do',
                                    type:"json",
                                    headers:{ "Content-Type": 'application/json'}
                                },response =>{
                                    this.timeStamp = response.data.Timestamp;
                                    //获取密码键盘内容 密码
                                    this.$refs.oldpwd.getValue(this.timeStamp,oldpwd =>{
                                    //获取密码键盘内容 密码
                                    this.$refs.newpwd.getValue(this.timeStamp,newpwd =>{
                                    //获取密码键盘内容 密码
                                    this.$refs.newrepeatpwd.getValue(this.timeStamp,newrepeatpwd =>{
                                        this.goJson('/refacmob/LoginPwdUpdate.do',{
                                                OldPassword:oldpwd.replace(/\+/g,"%2B"),
                                                NewPassword:newpwd.replace(/\+/g,"%2B"),
                                                ConfirmPassword:newrepeatpwd.replace(/\+/g,"%2B")
                                        },response=>{
                                                context.sessionSetString("isLogin", "");
                                                context.sessionSetString('userinfo', '');
                                                context.clearToken();
                                                context.replaceStage("main.login?flag=1");
                                                modal.toast({message:'密码修改成功'})
                                          }) 
                                       })
                                    })
                                }) 
                            })
                          }
                      })             
                    }
                 }) 
              }
           })
        },
        jumpsucc(){
          this.jump('/modifypwdsucc');
       }
    }
 }
</script>
