<template>
    <div>
        <nav-bar title="请选择网点"></nav-bar>
        <div class="searchTopBox">
            <div class="searchInputBox" :style="searchInput?hasInputSearch:''">
               <image class="searchIcon" src="./imgs/searchIcon.png"/>
               <input type="text" :class="[searchInput?'hasSearchInput':'emptySearchInput']" v-model="searchInput" placeholder="请输入行号或关键字查询"  @blur="searchList" />
            </div>
            <text v-if="searchInput" class="cancelSearch" @click="cancelSearch">取消</text>
        </div>
        <SplitDiv />
        <list loadmoreoffset='5' @loadmore="loadmore">
            <cell v-for="(item,index) in showNetWorkList" :key="index" @click="choseNetBank(item)">
                <div class="everyCol">
                    <text class="textSty">{{item.Name}}</text>
                    <text class="textSty">{{item.Value}}</text>
                </div>
            </cell>  
        </list>
    </div>
</template>
<script>
import NavBar from "@/components/titlebar_component.vue";
import SplitDiv from "../../components/splitDiv.vue";
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
export default {
    components: { NavBar ,SplitDiv},
    data(){
        return{
            searchInput:'',
            hasInputSearch:{
                width:'600px'
            },
            hasInput:{
                width:'500px'
            },
            showNetWorkList:[]
        }
    },
    created(){
        // this.showNetWorkList=this.$store.state.netWorkList;
        this.getNetBankName();
    },
    methods:{
        //选中一个网点名称
        choseNetBank(item){
            this.$store.state.transferSubmitData.PayeeNetName=item;
            this.$store.state.transferSubmitData.isCheckBankInner='disable';
            this.goBack();
        },
        cancelSearch(){
            this.searchInput='';
            if(this.showNetWorkList.length==0){
                this.searchList();
            }
        },
        getNetBankName(){
            if(this.$store.state.transferSubmitData.PayeeBank&&this.$store.state.cityCode){
                var params={
                    PayeeBankId:this.$store.state.transferSubmitData.PayeeBank,//银行代码'402'
                    CityCode:this.$store.state.cityCode//市代码'1422'
                }
                if(this.$store.state.transferSubmitData.PayeeBankName.includes("江苏银行")){
                    params.Jiangsu="江苏银行";
                }
                this.post("/eweb/PayeeBankDeptListQry.do",params,response=>{
                    this.showNetWorkList=response.data.List;
                });
            }
        },
        searchList(){
            this.showNetWorkList=[];//搜索之前先清空
            if(this.$store.state.transferSubmitData.PayeeBank&&this.$store.state.cityCode){
                let params={
                    PayeeBankId:this.$store.state.transferSubmitData.PayeeBank,//银行代码'402'
                    CityCode:this.$store.state.cityCode,//市代码'1422'
                    DeptNameSeach:this.searchInput.replace('/\s/')
                }
                this.post("/eweb/PayeeBankDeptListQry.do",params,response=>{
                    this.showNetWorkList=response.data.List;
                });
            }
        },
        //查询网点名称
        loadmore(){
            
        }
    }
}
</script>>
<style scoped>
    input:focus{
        outline: none;
    }
    .splitDiv{
        height: 20px;
        background-color: rgba(249,249,249,1);
    }
    .textSty{
        width:690px;
        font-size:30px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:54px;
    }
    .everyCol{
        border-bottom-width: 1px;
        border-bottom-color: rgba(234,234,234,1);
        padding-top:20px;
        padding-bottom: 20px;
        margin-left: 30px;
        background-color: #fff;
    }
    .searchTopBox{
        margin-top:20px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .searchInputBox{
        /* width:690px; */
        height:60px;
        border-radius:8px;
        border-width: 1px;
        border-color:#DDDDDD;
        align-self: center;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-left: 29px;
    }
    .searchIcon{
        width: 25px;
        height:25px;
        margin-right: 17px;
    }
    .emptySearchInput{
        width:600px;
        height:50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(170,170,170,1);
    }
    .hasSearchInput{
        width:500px;
        height:50px;
        font-size:26px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(170,170,170,1);
    }
    .cancelSearch{
        color: #E6022C;
    }
</style>>