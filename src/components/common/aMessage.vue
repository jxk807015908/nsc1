<template>
  <div :class="{aMessage:true,atRight:isAtRight}">
    <img :class="{fl:!isAtRight,fr:isAtRight}" src="../../assets/imgages/userBaseHeadImg.png" alt="">
    <div :class="{fl:!isAtRight,fr:isAtRight}">
      <span>{{name}}</span>
      <p>{{message}}</p>
    </div>
  </div>
</template>
<script>
    export default {
        name:'aMessage',
        props:['name','message','isAtRight'],
        data: function () {
            return {

            };
        }
    }
</script>
<style lang="less">
  .aMessage{
    overflow: hidden;
    margin-bottom: 10px;
    >img{
      border-radius: 20px;
      width: 40px;
      height: 40px;
    }
    >div{
      margin-left: 10px;
      margin-right: 10px;
      span{
        color: #8c939d;
      }
      p{
        max-width: 200px;
        margin-top: 10px;
        background: white;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 10px;
      }
    }
  }
  .atRight{
    text-align: right;
  }
</style>
