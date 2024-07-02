<template>
  <div class="all">
      <div class="select-item">
        <list class="listitem">
          <cell v-for="(item, index) in proviceList" :key="index" append="tree" @click="selectprovince(index,item.Value)">
            <text class="cityitem" :style="{color:(index === selectindex)?'#00BBE4':'gray'}"> {{item.Name}} </text>
          </cell>
        </list>    
        <list class="listitem">
          <cell v-for="(item ,index) in cityList" :key="index" append="tree" @click="selectcity(index,item.Value)">
            <text class="cityitem" :style="{color:(index === selectcityindex)?'#00BBE4':'gray'}"> {{item.Name}}</text>
          </cell>
        </list>
     </div>
    <text class="addbutton basebutton" @click="selectedaddress">确定</text>   
 </div>   
</template>
<script>
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
  export default { 
    data() {
      return{
        selectindex:0,
        selectcityindex:0,
        proviceList:[],//当前省列表
        cityList:[{Name:"北京市",Value:'1000'}],//当前市列表
        selectplace:''
      }
    },
    created(){
        this.getProvince();
    },
    methods: {
      //确定按钮
      selectedaddress(){
         this.selectplace = this.proviceList[this.selectindex].Name+' '+ 
                            this.cityList[this.selectcityindex].Name+' '+
                            this.cityList[this.selectcityindex].Value;                   
         this.$emit('haveselectedaddress',this.selectplace);
      },
      unselectedaddress(){
         this.$emit('haveselectedaddress','');                  
      },
      //根据省份获取城市数据      
      selectprovince(num,value){
          this.selectindex = num;
          const params = {
               ProvinceCode:value
           }
           stream.fetch({
                method: 'POST',
                url: '/refacmob/CityListQry.do',
                type: 'json',
                body:JSON.stringify(params),
                headers:{ "Content-Type": 'application/json'}
            },response => {
                if(response.data._RejCode == '000000'){
                     this.cityList = response.data.List;
                }
           })  
       },
       //获取省份数据
       getProvince(){
          const params = {}
          stream.fetch({
              method: 'POST',
              url: '/refacmob/ProvinceListQry.do',
              type: 'json',
              body:JSON.stringify(params),
              headers:{ "Content-Type": 'application/json'}
          },response => {
             if(response.data._RejCode == '000000'){
                  this.proviceList = response.data.List;
             }
           }) 
       },
      selectcity(num,value){
        this.selectcityindex = num; 
      },
    }
  }
  </script>
<style scoped>
.all{
  background-color: rgba(0, 0, 0, 0.65);
  width:750px;
  height:1334px;
}
.list-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    z-index: 10;
    background-color: black;
    opacity: 0.65;
  }
  .select-item{
    flex-direction: row;
    flex-wrap: nowrap;    
    background-color: #ffffff;
    align-items: center;
    justify-content: space-around;
    height: 580px;
    width: 750px;
    overflow-y: auto;
    position: fixed;
    left:0px;
    bottom: 80px;
  }  
   .listitem{
     margin-top: 20px;
     margin-bottom: 20px;
     width: 250px;
     height:550px;
     flex-grow:1;   
  } 
  .cityitem{
    color: gray;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 32px;
  }   
  .basebutton{
    color:white;
    background-color: #00BBE4; 
    font-size:32px; 
    height:80px;
    width:750px;
    line-height: 80px;  
    text-align: center; 
    position: fixed;
    left:0px;
    bottom: 0px;
  }
</style>
