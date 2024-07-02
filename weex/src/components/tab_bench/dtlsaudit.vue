<template>
    <div class="container">
        <div class="content">
            <!-- 展示内容 -->
            <table border="0" cellpadding="0" cellspacing="0" class="showTable">
                <tr>
                    <td v-for="(item, index) in showList" :key="item.id">
                        <text>{{item.status}}</text>
                        <hr class="table_hr" v-if="index != 2"/>
                    </td>
                </tr>
                <tr>
                    <td v-for="item in showList" :key="item.id">{{item.name}}</td>
                </tr>
                <tr>
                    <td v-for="item in showList" :key="item.id">{{item.time}}</td>
                </tr>
            </table>

            <!-- 金额信息 -->
            <div class="moneyShow">
                <p>¥{{moneySma}}</p>
                <span>{{moneyBig}}</span>
            </div>
            
            <!-- 收付信息 -->
            <div class="cashShow">
                <div>
                    <p>收</p>
                    <h2>收款方信息</h2>
                </div>
                <text>账号：北京科蓝软股份限公司</text>
                <text>名称：北京科蓝软系统股份有限公司</text>
                <text>名称：北京科系统股有限公司</text>
            </div>
            <div class="cashShow">
                <div>
                    <p>付</p>
                    <h2>付款方信息</h2>
                </div>
                <text>名称：北京科蓝软股份限公司</text>
                <text>名称：北京科蓝软系统股份有限公司</text>
                <text>名称：北京科系统股有限公司</text>
            </div>
            <div class="cashShow">
                <div>
                    <p>其</p>
                    <h2>金额及其他信息</h2>
                </div>
                <text>转账金额：北京蓝股公司</text>
                <text>名称：北科股公司</text>
                <text>转账用途：北统限公司</text>
                <text>名称：北京蓝软系有限公司</text>
            </div>

            <!-- 底部 -->
            <ul class="footer">
                <li>取消</li>
                <li @click="typeFun">确认</li>
            </ul>
            
            <!-- 交易类型弹框 -->
            <wxc-popup style="z-index: 1;" popup-color="#fff" :show="isTypeShow" pos="bottom" height="300" @wxcPopupOverlayClicked="cancelTypeFun">
                <div class="password">
                    <wxc-minibar left-text=" " title="拒绝原因" background-color="#fff" text-color="#000">
                        <image slot="right" :src="rightimg" class="right" @click="cancelTypeFun"></image>
                    </wxc-minibar>
                    <input type="text" placeholder="请输入拒绝原因" class="text">
                    <wxc-button text="确认" type="white"></wxc-button>
                </div>
            </wxc-popup>
        </div>
    </div>
</template>

<style scoped>
.container {
  background-color: #ececec;
  min-height: 1200px;
}
.content {
  width: 750px;
  position: relative;
  flex-direction: column;
  padding-bottom: 100px;
}
.showTable {
    width: 97%;
    background: #fff;
    padding: 20px 0 20px 20px;
}
.showTable tr td{
    font-size: 0.7em;
    overflow: hidden;
    padding: 10px;
}
.showTable tr:first-child td{
    padding: 10px 0;
}
.showTable tr td .weex-text{
    float: left;
    font-size: 1em;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background: #999;
    color: #fff;
    border-radius: 50%;
}
.showTable tr td .table_hr{
    width: 67%;
    height: 2px;
    background: #333; 
    float: right;
    margin: 36px 2% 0 0;
}

.moneyShow{
    background: #fff;
    margin-top: 10px;
    padding: 40px 0;
}
.moneyShow p{
    font-size: 1.3em;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}
.moneyShow span{
    text-align: center;
}

.cashShow {
    background: #fff;
    border-top: 1px solid #ddd;
    padding: 20px 40px;
}
.cashShow>div {
  flex-direction: row;
  justify-content: normal;
  align-items: center;
}
.cashShow>div p{
    width: 60px;
    height: 60px;
    line-height: 70px;
    text-align: center;
    background: #666;
    color: #fff;
    border-radius: 50%;
}
.cashShow>div h2{
    font-size: 1.1em;
    font-weight: bold;
    padding-left: 40px;
}
.cashShow>.weex-text {
    font-size: 1em;
    text-indent: 30px;
    line-height: 60px;
}

.footer {
    background: #fff;
    width: 96%;
    height: 100px;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.footer li{
    width: 50%;
    height: 90px;
    text-align: center;
    line-height: 80px;
    color: #fff;
}
.footer li:first-child{
    background: #999;
}
.footer li:last-child{
    background: #666;
}
.password .right{
    width: 40px;
    height: 40px;
}
.password .text{
    border-bottom: 1px solid #E4E4E4;
    padding: 20px;
    margin: 10px 30px;
}
.password .wxc-btn{
    margin: auto;
    background-color: #BDBDBD;
    border-radius: none;
}
.password .wxc-minibar{
    border-bottom: 1px solid #E4E4E4;
}
</style>

<script>
    import { WxcPopup, WxcMinibar, WxcSearchbar, WxcButton } from 'weex-ui';

    export default {
    components: {
        WxcPopup,
        WxcMinibar,
        WxcSearchbar,
        WxcButton
    },
    data() {
        return {
            moneySma: "500,000.00",
            moneyBig: '伍拾万圆整',
            showList: [
                { status:"经办", name:"张三", time:"2019/02/10 12:34:12", id: "001"},
                { status:"通过", name:"李四", time:"2014/11/14 12:34:12", id: "002"},
                { status:"拒绝", name:"原因", time:"2011/12/18 12:34:12", id: "003"},
            ],
            isTypeShow: false,
            rightimg: './imgs/tab_bench/u237.svg'
        }
    },
    computed: {},
    methods: {
        typeFun () {
            this.isTypeShow = true;
        },
        cancelTypeFun () {
            this.isTypeShow = false;
        }
    },
    created() {}
    };
</script>
