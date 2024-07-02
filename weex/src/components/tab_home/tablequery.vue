<template>
  <div class="query">
    <table border="0" cellpadding="0" cellspacing="0">
      <tr>
        <th v-for="item in thead" :key="item.name" :width="item.width" align="right">{{item.name}}</th>
      </tr>
      <tr v-for="items in tbody" :key="items.td1">
        <td>
          <image :src='items.imgurl' class="icon"></image>
          <span>{{items.td1}}</span>
        </td>
        <td>{{items.td2}}</td>
        <td>{{items.td3}}</td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
.query {
  border-bottom: 15px solid #fff;
}
.query table{
  width: 100%;
}
.query table tr th{
  text-align: right;
  height: 64px;
  background: #fff;
  font-size: 0.9em;
  color: #999;
  padding: 0 30px;
}
.query table tr th:first-child,
.query table tr td:first-child {
  text-align: left;
}
.query table tr td{
  text-align: right;
  height: 80px;
  padding: 0 30px;
}
.query table tr:nth-child(odd) td{
  background: #F2F2F2;
}
.query table tr:nth-of-type(even) td{
  background: #E4E4E4;
}
.query table tr td .icon{
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 40px;
}
</style>
<script>
export default {
  data() {
    return {
      thead: [{
        name:'币种',
        width: '40%'
      },{
        name:'现汇买入价',
        width: '30%'
      },{
        name:'现汇卖出价',
        width: '30%'
      }],
      tbody: [{
        td1: '美元（USD)',
        td2: '709.31',
        td3: '717.36',
        imgurl: './imgs/tab_home/menu/transactiondetails.png'
      },{
        td1: '日元（JPY)',
        td2: '6.65',
        td3: '6.7',
        imgurl: './imgs/tab_home/menu/addaccount.png'
      },{
        td1: '欧元（EUR)',
        td2: '789.31 ',
        td3: '792.36',
        imgurl: './imgs/tab_home/menu/fund.png'
      },{
        td1: '英镑（GBP)',
        td2: '889.31 ',
        td3: '887.36',
        imgurl: './imgs/tab_home/menu/more.png'
      }]
    };
  }
};
</script>
