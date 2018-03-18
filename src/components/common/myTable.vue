<template>
  <div class="table-box" ref="box">
    <table class="table" ref="table">
      <thead>
      <th v-if="pageNow">
        <span v-if="isCheckBox" @click="checkAll" class="table-check-box"><i v-if="isCheckAll" class="el-icon-check"></i></span>
        序号
        <el-select v-model="checkedHead" multiple placeholder="请选择" @change="changeHead">
          <el-option
            v-for="item in tableHead"
            :key="item"
            :label="item"
            :value="item"
            :disabled="item=='操作'">
          </el-option>
        </el-select>
      </th>
      <th v-for="(item,index) in checkedHead" >
        {{item}}
      </th>
      </thead>
      <tbody v-if="!isLoading||isLazyScroll">
      <tr ref="tr" v-for="(tr,index) in tableList" :class="{gray:index%2!=0,trCheck:(index===trIndex||index===checkedIndex)&&isTrCheck}" @click="trClick(index)">
        <td v-if="pageNow">
          <span v-if="isCheckBox"  @click="tdCheck(index)" class="table-check-box"><i v-if="tr.isChecked" class="el-icon-check"></i></span>
          {{index + 1 + $store.state.pageSize * (pageNow - 1)}}
          <slot name="foldIcon" :idx="index"></slot>
        </td>
        <slot name="handle" :data="tr" :idx="index" :tr="tr"></slot>
        <td v-for="(td,key,index2) in tr" :title="td" v-if="isShow(key,index2)" v-html="td"></td>
      </tr>
      </tbody>
    </table>
    <!--<div v-if="isScroll!==false" v-show="showScroll" class="scroll-box" @scroll="toScroll" ref="scrollBox">-->
      <!--<div ref="myScroll"></div>-->
    <!--</div>-->
    <div class="loading-box" v-if="isLoading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
  import {suspendScroll,lazyScroll,suspendScrollInit,lazyScrollInit,deepDelete,hidePartlyTd} from '@/util/common'

  export default {
    props: [
      'checkedIndex',//外部控制选中行
      'tableHead',//表头
      'tableTbody',//表格内容
      'pageNow',//当前页码 控制序号
      'isLoading',//控制loading图标
      'isScroll',//是否需要悬浮滚动条 默认true
      'isCheckBox',//是否需要多选框 默认false
      'isTrCheck',//是否开启tr可选择 默认false
      'isLazyScroll',//是否需要懒加载 默认false
      'filterKey'
    ],
    data() {
      return {
        // childContent:[],
        checkedIndexArr:[],
        checkedHead:this.tableHead,
        trIndex:'',
        showScroll:true,
        isCheckAll:false,
        radio:''
      }
    },
    mounted(){
      this.tableHead.forEach((value, index) => {
        if(this.tableHead.includes('操作')) index--;
        this.checkedIndexArr.push(index)
      })
      this.theScroll=window.onscroll;//保存未初始化之前的onscoll事件
      this.theResize=window.onresize;//保存未初始化之前的onresize事件
      this.isScroll!==false&&suspendScroll(this.$refs.box,this.$refs.table)
      this.suspendScroll=window.onscroll;//保存初始化悬浮滚动条之后的onscoll事件
      this.isLazyScroll&&lazyScroll(this.$refs.box,()=>{
        this.$emit('toBottom')
      })
//      if(this.isScroll!==false)
//        window.onresize = ()=>{
//          if(theResize&&theResize.constructor==Function) theResize();
//          suspendScroll(this.$refs.box,this.$refs.table)
//        };
    },
    destroyed() {
      //销毁时 取消事件
      //if(this.isScroll!==false){
        window.onresize = this.theResize;
        window.onscroll=this.theScroll;
        //this.$store.state.myScroll.tableScroll && this.$store.commit('upMyScroll', 'tableScroll')
      //}
    },
    computed:{
      tableList(){
        if(this.filterKey&&this.tableTbody&&(this.tableTbody.constructor==Array||this.tableTbody.constructor==Object)){
          let obj=JSON.parse(JSON.stringify(this.tableTbody));
          // if(obj.constructor==Array){
          //   this.childContent=[];
          //   obj.forEach((item, index) => {
          //     if(item.childContent&&item.childContent.constructor==Object){
          //       this.childContent.push({
          //         disabled:item.childContent.disabled,
          //         operate:item.childContent.operate,
          //         index:index,
          //         content:item.childContent.data,
          //         isShow:false,
          //         number:item.childContent.data.length
          //       })
          //     }
          //   })
          // }
          deepDelete(obj,this.filterKey);
          return obj;
        }else{
          return this.tableTbody;
        }
      }
    },
    methods: {
      changeHead(checkedArr){
        this.checkedHead=this.tableHead.filter(item=>checkedArr.includes(item));
        this.checkedIndexArr=[];
        this.checkedHead.forEach(value=>{
          if(this.tableHead.includes('操作')){
            this.checkedIndexArr.push(this.tableHead.findIndex(value2=>value2==value)-1)
          }else{
            this.checkedIndexArr.push(this.tableHead.findIndex(value2=>value2==value))
          }
        });
      },
      isShow(key,index) {
        if(!this.checkedIndexArr.includes(index)){
          return false
        }
        let arr = ['isChecked']
        if (arr.some(item => item == key)) return false;
        return true;
      },
      //点击单选按钮
      tdCheck(n){
        this.tableTbody[n].isChecked=!this.tableTbody[n].isChecked;
        this.isCheckAll=this.tableTbody.every(item=>item.isChecked===true);
        this.$emit('update:tableTbody',this.tableTbody)
      },
      //点击全选按钮
      checkAll(){
        this.isCheckAll=!this.isCheckAll;
        for(let item of this.tableTbody){
          item.isChecked=this.isCheckAll;
        }
        this.$emit('update:tableTbody',this.tableTbody)
      },
      //选择行
      trClick(index) {
        if(this.trIndex === index) return;
        var tr=this.$refs.table.getElementsByTagName('tr');
        for(let j=0;j<tr.length;j++){
          tr[j].className=tr[j].className.replace(/trCheck/,'')
        }
        this.trIndex = index;
        this.$emit('trClick', index);
      },
      // insertTrClick(){
      //   var tr=this.$refs.table.getElementsByTagName('tr');
      //   this.$refs.tr.forEach((value, index) =>{
      //     let item=value;
      //     let i=0;
      //     while(item.nextSibling!=this.$refs.tr[index+1]){
      //       item=item.nextSibling;
      //       let item2=item;
      //       let index2=i;
      //       item2.onclick= () =>{
      //         if(item2.className.indexOf('trCheck')==-1){
      //           this.trIndex='';
      //           for(let j=0;j<tr.length;j++){
      //             tr[j].className=tr[j].className.replace(/trCheck/,'')
      //           }
      //           if(!item2.className)item2.className='';
      //           item2.className=item2.className+' trCheck';
      //           this.$emit('trClick',[index,index2]);
      //         }
      //       };
      //       i++;
      //     }
      //   })
      // }
      //滚动条联动
//      toScroll() {
//        this.$refs.table.style.left = '-' + this.$refs.scrollBox.scrollLeft + 'px';
//      },
      //添加横向滚动条
//      suspendScroll() {
//        if(this.isScroll===false) return;
//        if (this.$refs.table.offsetWidth == this.$refs.box.width) {
//          this.showScroll = false;
//          return
//        }
//        //获取盒子距离顶部的距离
//        let boxTop = getTop(this.$refs.box);
//        //获取body的高度
//        let bodyHeight = document.body.offsetHeight;
//        //滚动条的宽度=table的宽度
//        this.$refs.myScroll.style.width = this.$refs.table.offsetWidth + 'px';
//        let scrollBox = this.$refs.scrollBox;
//        scrollBox.style.width = this.$refs.box.offsetWidth + 'px';
//        //获取盒子高度
//        let boxHeight = this.$refs.box.offsetHeight;
//        let tableScroll = () => {
//          //获取显示区底部距离tableBox的距离
//          let nowTop = bodyHeight + pageYOffset - boxTop;
//          scrollBox.style.position = (nowTop < boxHeight && nowTop > 40) ? 'fixed' : 'absolute';
//        };
//        tableScroll();
//        this.$store.commit('upMyScroll', {tableScroll})
//      }
    },
    watch: {
      tableTbody: {
        handler() {
          this.trIndex = '';
          this.isCheckAll=false;
          this.$nextTick(()=>{
            // if(this.$refs.tr){
            //   insertTr(this.$refs.tr,{childContent:this.childContent,tableHead:this.tableHead,pageNow:this.pageNow,checkedIndexArr:this.checkedIndexArr},(index,data)=>{this.$emit('operate',index,data)});
            //   this.insertTrClick();
            // }
            this.isScroll!==false&&suspendScrollInit(this.$refs.box,this.$refs.table)
            this.isLazyScroll&&lazyScrollInit(this.$refs.box,()=>{
              this.$emit('toBottom')
            })
//            window.onscroll=()=>{
//              if(theScroll&&theScroll.constructor==Function) theScroll();
//              suspendScroll(this.$refs.box,this.$refs.table)();
//            }
          })
        },
        isLazyScroll(val){
          val?lazyScroll(this.$refs.box,()=>{
            this.$emit('toBottom')
          }):window.onscroll=this.suspendScroll;
        }
      },
      tableHead:{
        handler(){
          this.checkedHead=this.tableHead
        }
      },
      checkedIndexArr:{
        handler(){
          this.$nextTick(()=>{
            if(this.$refs.tr){
              hidePartlyTd(this.$refs.tr,this.checkedIndexArr,this.tableHead,this.pageNow);
              //insertTr(this.$refs.tr,{childContent:this.childContent,tableHead:this.tableHead,pageNow:this.pageNow,checkedIndexArr:this.checkedIndexArr},(index,data)=>{this.$emit('operate',index,data)});
              //this.insertTrClick();
              // var tr=this.$refs.table.getElementsByTagName('tr');
              // this.$refs.tr.forEach((value, index) =>{
              //   let item=value;
              //   let i=0;
              //   while(item.nextSibling!=this.$refs.tr[index+1]){
              //     item=item.nextSibling;
              //     let item2=item;
              //     let index2=i;
              //     item2.onclick= () =>{
              //       if(item2.className.indexOf('trCheck')==-1){
              //         this.trIndex='';
              //         for(let j=0;j<tr.length;j++){
              //           tr[j].className=tr[j].className.replace(/trCheck/,'')
              //         }
              //         if(!item2.className)item2.className='';
              //         item2.className=item2.className+' trCheck';
              //         this.$emit('trClick',[index,index2]);
              //       }
              //     };
              //     i++;
              //   }
              // } )
            }
            this.isScroll!==false&&suspendScrollInit(this.$refs.box,this.$refs.table)
          })
        }
      }
    }
  }
</script>

<style lang='less'>
  .table-box-border{
    border: 1px solid #e9e9e9;
  }
  .table-box {
    background:#fff;
    overflow: hidden;
    padding-bottom: 20px;
    position: relative;
    .el-radio__label{
      display:none;
    }
  }
  .scroll-box {
    overflow: auto;
    position: fixed;
    z-index: 1000;
    bottom: 0;
    width: 100%;
    div {
      height: 1px;
    }
  }
  .trCheck {
    background: #D8EFFF;
  }

  .table {
    border-collapse: collapse;
    width: 100%;
    position: relative;
    .tr-insert{
      td{
        height:auto;
        div{
          height:40px;
          line-height: 40px;
          transition:all 0.4s;
        }
      }
    }
    .tr-hidden{
      td{
        div{
          height:0;
          overflow:hidden;
        }
      }
    }
    tr{
      .fold{
        border: 5px solid transparent;
        border-top-color: black;
        width: 0;
        height: 0;
        display: inline-block;
        margin-top: 7px;
        position: absolute;
        margin-left: 2px
      }
      .fold-active{
        border-color: transparent;
        border-right-color: black;
        margin-top: 5px;
        margin-left: 0;
      }
    }
    th, td {
      transition:2s;
      font-weight: normal;
      height: 40px;
      text-align: center;
      word-break: keep-all;
      white-space: nowrap;
      max-width: 160px;
      min-width: 80px;
      padding: 0 10px;
    }
    td {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    td:hover {
      cursor: default;
    }
    a{
      cursor: pointer;
    }
    a.disabled{
      color: #000000;
      cursor: default;
    }
    thead {
      background: #38ADFF;
      color: #fff;
      font-size: 14px;
      .el-select {
        margin-left: -18px;
        .el-select__tags{
          display: none;
        }
        .el-input__inner{
          color: transparent;
          width: 0;
          background:transparent;
          border: none;
        }
        .el-select__caret{
          color: white;
        }
      }
    }
  }

  .td-btn-group {
    color: #1200FF;
    a {
      color: #1200FF;
    }
    a.disabled {
      color: #B1B1B1;
      cursor: default;
    }
  }

  .loading-box {
    width: 100%;
    text-align: center;
    height: 100px;
    line-height: 100px;
    i {
      font-size: 40px;
    }
  }

  .table-check-box {
    display: inline-block;
    margin-right: 5px;
    position: relative;
    background: #fff;
    width: 15px;
    height: 15px;
    top: 3px;
    border: 1px solid #999999;
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
    color: #000;
    .el-icon-check {
      font-size: 14px;
    }
  }
</style>
