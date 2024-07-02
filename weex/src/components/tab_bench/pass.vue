<template>
    <div class="container">
        <div class="content">
            <!-- 展示内容 -->
            <table class="showTable" v-for="item in showList" :key="item.id">
                <tr>
                    <td>{{item.type}}</td>
                    <td>¥{{item.money}}</td>
                </tr>
                <tr>
                    <td>交易时间:{{item.time}}</td>
                    <td>{{item.status}}</td>
                </tr>
            </table>

            <!-- 底部 -->
            <ul class="footer">
                <li>
                    <text>共{{row}}笔</text>
                    <text>总金额￥{{total}}</text>
                </li>
                <li @click="typeFun">确认通过</li>
            </ul>
            
            <!-- 交易类型弹框 -->
            <wxc-popup style="z-index: 1;" popup-color="#fff" :show="isTypeShow" pos="bottom" height="500" @wxcPopupOverlayClicked="cancelTypeFun">
                <div class="password">
                    <wxc-minibar left-text=" " title="安全认证" background-color="#fff" text-color="#000">
                        <image slot="right" :src="rightimg" class="right" @click="cancelTypeFun"></image>
                    </wxc-minibar>
                    <text class="title">云盾密码</text>
                    <input type="text" placeholder="请输入6-8位云盾密码" class="text">
                    <p class="forget">忘记云盾密码</p>
                    <wxc-button text="确认" type="white"></wxc-button>
                </div>
            </wxc-popup>
        </div>
    </div>
</template>

<style scoped>
.password .right{
    width: 40px;
    height: 40px;
}
.password .title{
    border-top: 1px solid #E4E4E4;
    padding: 30px 30px 0 30px;
}
.password .text{
    border: 1px solid #E4E4E4;
    padding: 20px;
    margin: 10px 30px;
}
.password .forget{
    text-align: right;
    color: #169BD5;
    padding: 20px 30px;
    font-size: 0.9em;
}
.password .wxc-btn{
    margin: auto;
    background-color: #BDBDBD;
    border-radius: none;
}


.container {
  background-color: #ececec;
}
.content {
  width: 750px;
  position: relative;
  flex-direction: column;
}
.showTable {
    width: 96%;
    background: #fff;
    border-bottom: 1px solid #F3F3F3;
    font-size: 12px;
    padding: 20px 0 10px 0;
}
.showTable tr:first-child td{
    font-size: 30px;
}
.showTable tr:last-child td{
    font-size: 24px;
    height: 60px;
}
.showTable tr td:last-child{
    text-align: right;
}
.showTable tr td .cell-bottom-border {
    border: none;
    padding: 0px;
    width: 40px;
}
.footer {
    background: #fff;
    width: 96%;
    height: 170px;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #F3F3F3;
}
.footer li:first-child{
    width: 95%;
    margin: 0 auto;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.footer li:last-child{
    background: #666666;
    height: 90px;
    text-align: center;
    line-height: 80px;
    color: #fff;
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
            row: 8,
            total: '20000.00',
            showList: [
                { type:"单笔转账", money:"100,000.00", time:"2019/02/10 12:34:12", status:"待审核", id: "001"},
                { type:"银企对账", money:"500.00", time:"2014/11/14 12:34:12", status:"待审核", id: "002"},
                { type:"代发工资", money:"80,000.00", time:"2011/12/18 12:34:12", status:"待审核", id: "003"},
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
