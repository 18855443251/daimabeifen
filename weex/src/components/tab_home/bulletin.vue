<template>
<div class="menu-bulletin">
  <div class="bulletin">
    <text class="title">{{title}}</text>
    <text class="footer_title">{{footer}}</text>
  </div>
</div>
</template>
<style scoped>
.menu-bulletin{
  width: 690px;
  height: 140px;
  /* border: 1px solid #000; */
  border-bottom-color: #d7d7d7;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-top-color: #d7d7d7;
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: #d7d7d7;
  border-right-style: solid;
  border-right-width: 1px;
  border-left-color: #d7d7d7;
  border-left-style: solid;
  border-left-width: 1px;
  border-radius: 30px;
  position: absolute;
  background-color: #fff;
  top: 200px;
  left: 30px;
}
  .bulletin {
    padding: 20px;
  }
  .title{
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 32px;
  }
  .footer_title{
    text-align: right;
    font-size: 26px;
    color:#999999;
  }
</style>
<script>
export default {
  data() {
    return {
      title: '美团银行行企业手机银行上线了！',
      footer: '指尖金融，触手可及'
    };
  }
};
</script>
