<template>
    <div class="demo" >
      <NavBar
									 :style="{'padding-top':marginTop + 'px','height':marginTops+'px'}"
                   background-color="rgb(64,64,64)"
                   :use-default-return="returnFlag"
									 
                   >
            <div slot="left">
              <slot name="left">
                <image class="backIcon" :src="backArrow" @click="goBack"/>
              </slot>
            </div>
            <div slot="middle">
              <slot name="middle">
                <text class="title">{{title}}</text>
              </slot>
            </div>
            <div slot="right">
               <text class="addaccount" v-if="showpayee" @click="add">...</text>
            </div>      
      </NavBar>
      
  </div>
  
</template>

<script>
	import NavBar from "./TitleBar.vue"
  const modal = weex.requireModule('modal')
  const context = weex.requireModule("context")
  export default {
    components: { NavBar},
    props:{
        title:{
            type:String,
            default:"美团银行农村商业银行"
        },
        returnFlag:{
            type:Boolean,
            default:true
        },
        showpayee:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            backArrow:this.$store.state.imgBaseUrl + "/back@2x.png", 
            marginTop:context.getDeviceInfo().status_bar_height,
            marginTops:context.getDeviceInfo().status_bar_height+88,
            
        }
    },
    mounted(){
    },
    methods: {
       //添加收款人
       add(){
          this.jump('/addaccount');
       }
      }
  }
</script>
<style scoped>
.backIcon{
  width:30px;
  height:28px;
}
.title{
  color: rgb(255,255,255);
  font-size: 34px;
}
.addaccount{
  color: #ffffff;
  font-size: 50px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
