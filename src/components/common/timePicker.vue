
<template>
  <div class="block">
    <el-date-picker
      :value="value"
      @input="updateVal"
      value-format="yyyy-MM-dd HH:mm:ss"
      format="yyyy-MM-dd HH:mm"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="change"
      align="right">
    </el-date-picker>
  </div>
</template>

<script>
  import {timeFormat} from '@/util/common'

  export default {
    props: ['value'],
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              let now = new Date();
              let start = new Date(timeFormat(now,'yyyy/MM/dd'));
              let end = new Date(start.getTime() + 24 * 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近7天',
            onClick(picker) {
              let now = new Date();
              let end = new Date(timeFormat(now.getTime()+24 * 3600 * 1000,'yyyy/MM/dd'));
              let start = new Date(end.getTime() - 7 * 24 * 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近30天',
            onClick(picker) {
              let now = new Date();
              let end = new Date(timeFormat(now.getTime()+24 * 3600 * 1000,'yyyy/MM/dd'));
              let start = new Date(end.getTime() - 30 * 24 * 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    methods: {
      updateVal(val) {
        this.$emit('input', val)
      },
      change(){
        this.$emit('change')
      }
    }
  }
</script>

<style lang='less'>
  .block {
    width: 350px;
    float: left;
    margin-right:30px;
    .el-date-editor {
      width: 100%;
      height: 34px;
      padding-top: 0;
      padding-bottom: 0;
      .el-range-input {
        height: 90%;
      }
      .el-range__close-icon {
        display: none;
      }
    }
  }
</style>
