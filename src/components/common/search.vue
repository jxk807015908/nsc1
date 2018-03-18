<template>
  <div class="search-box clearfix" ref="mySearch">
    <slot name="content"></slot>
    <div class="btn-box fl">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="clear">清空</el-button>
    </div>
    <slot name="btn"></slot>
    <paging :total="total" :pageNow="pageNow" @changePage="changePage" v-if="total>$store.state.pageSize"></paging>
  </div>
</template>

<script>
  import paging from '@/components/common/paging'

  export default {
    props: ['total', 'searchData','pageNow'],
    name:'search',
    components: {
      paging
    },
    created(){
      this.mySearchData=JSON.parse(JSON.stringify(this.searchData));//深拷贝
    },
    mounted() {
      let inputList = this.$refs.mySearch.getElementsByTagName('input');
      for (let item of inputList) {
        item.onkeyup = (e) => {
          (e.keyCode || e.which) == 13 && this.search();
        }
      }
    },
    methods: {
      search() {
        this.$emit('search')
      },
      clear() {
        let data = JSON.parse(JSON.stringify(this.mySearchData))
        this.$emit('update:searchData', data)
      },
      changePage(page) {
        this.$emit('changePage', page)
      }
    }
  }
</script>

<style lang='less'>
  .btn-box {
    margin-top: 24px;
  }

  .search-box {
    background:#fff;
    padding: 15px 28px 20px 28px;
    margin-bottom:10px;
    border: 1px solid #e9e9e9;
    border-top:0;
    >div{
      margin-top: 24px;
    }
    >button{
      margin-top: 24px;
    }
    .min-right{
      margin-right:8px;
    }
    .input-content{
      margin-top:0 ;
      >div{
        margin-top: 24px;
      }
    }
    .el-pagination {
      float: right;
    }
  }
  .input-box {
    margin-right: 30px;
    div {
      width: 180px;
    }
    input {
      height: 34px;
    }
    label {
      float: left;
      font-size: 14px;
      margin-right: 8px;
      height:34px;
      line-height:34px;
    }
  }
  .input-box-clear {
    clear: left;
    margin-top: 24px;
    margin-right: 20px;
  }
  .min-input-box {
    > .el-select, .el-input {
      width: 90px;
    }
  }
</style>
