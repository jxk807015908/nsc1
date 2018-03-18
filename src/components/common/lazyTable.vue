<template>
  <div class="lazy-table-box" ref="box">
    <table class="table">
      <thead>
      <th v-for="(item,index) in lazyHead">
        {{item}}
      </th>
      </thead>
      <tbody>
      <tr v-for="(tr,index) in lazyTbody" :class="{gray:index%2!=0}">
        <td v-for="(td,idx) in tr" :title="td">{{td}}<slot v-if="idx===tdIndex" name="handle" :idx="index" :tr="tr"></slot></td>
      </tr>
      </tbody>
    </table>
    <div class="lazy-loading-box" v-if="isLazyLoading&&isNeedLoading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
  import {getTop,lazyScroll} from '@/util/common'
  const theScroll=window.onscroll;
  export default {
    props: ['lazyHead', 'lazyTbody', 'isLazyLoading', 'isNeedLoading','tdIndex'],
    data() {
      return {
        toTop: '',
        flag: false
      }
    },
    destroyed() {
      //销毁时 取消事件
      window.onscroll=theScroll
      //this.$store.state.myScroll.lazyScroll && this.$store.commit('upMyScroll', 'lazyScroll')
    },
    watch: {
      lazyTbody: {
        handler() {
          if (!this.isNeedLoading) {//是否需要懒加载功能
            //this.$store.state.myScroll.lazyScroll && this.$store.commit('upMyScroll', 'lazyScroll')
            return;
          }
          this.$nextTick(() => {
            lazyScroll(this.$refs.box,()=>{
              this.$emit('toBottom');
            })
//            let el = this.$refs.box;
//            this.toTop = el.offsetHeight + getTop(el);
//            let bodyHeight = document.body.offsetHeight;
//            this.flag = true;
//            let lazyScroll = () => {
//              if ((pageYOffset + bodyHeight + 20) >= this.toTop && this.flag) {
//                this.flag = false;
//                this.$emit('toBottom');
//              }
//            }
            //window.onscroll增加lazyscroll方法
            //this.$store.commit('upMyScroll', {lazyScroll})
          })
        }
      }
    }
  }
</script>

<style lang='less'>
  .lazy-loading-box {
    width: 100%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    i {
      font-size: 30px;
    }
  }
</style>
