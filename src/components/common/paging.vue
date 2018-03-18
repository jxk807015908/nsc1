<template>
  <el-pagination
    :page-size="$store.state.pageSize"
    :current-page="pageNow"
    @current-change="changePage"
    layout="prev, pager, next"
    :total="total">
  </el-pagination>
</template>

<script>
    export default {
      props:['total','pageNow'],
      methods:{
        changePage(page){
          this.$emit('changePage',page)
        }
      }
    }
</script>

<style lang='less'>
  .el-pagination{
    font-weight: normal;
    .btn-prev,.btn-next,.el-pager .number{
      box-sizing: border-box;
      border:1px solid #c6c6c6;
      border-radius: 2px;
      width:32px;
      height:32px;
      padding:0;
      text-align: center;
      line-height:32px
    }
    .number{
      margin:0 2px
    }
    .el-pager .number.active{
      background:#38ADFF;
      color:#fff;
      border:0;
    }
  }
</style>
