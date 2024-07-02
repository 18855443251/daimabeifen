<template>
    <div class="btn">
        <text class="btntext">{{btntext}}</text>
    </div>
</template>
<script>
    export default {
        props:["btntext"]
    }
</script>
<style scoped>
    .btn {
        flex-direction: row;
        margin-top: 80px;
        margin-bottom:80px;
        justify-content: space-around;
    }
    .btntext {
        width: 670px;
        height: 88px;
        color: #fff;
        font-size: 32px;
        line-height:88px;
        text-align: center;
        background-image: -webkit-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: -o-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: -moz-linear-gradient(right, #FB5D7A, #E6022C);
        background-image: linear-gradient(to right, #FB5D7A, #E6022C);
        border-radius: 12px;
    }
</style>