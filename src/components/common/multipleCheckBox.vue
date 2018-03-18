<template>
  <div class="multiple-check-box">
    <div class="left-box">
      <h3>{{parentTitle}}</h3>
      <ul class="parent-list fl">
        <li v-for="(item,index) in parentList" @click="checkParent(item,index)" :class="{active:parentIndex===index}"><span class="check-box" @click="changeParentStatus(index)"><span v-if="item[parentStatusKey]==1">-</span><i v-if="item[parentStatusKey]==2" class="el-icon-check"></i></span>{{item[parentNameKey]}}</li>
      </ul>
    </div>
    <div class="right-box">
      <h3><span v-for="item in childTitleList">{{item}}</span></h3>
      <ul class="child-list fl">
        <li v-for="(item,index) in childList"  @click="checkChild(item,index)"><span class="check-box"><i v-if="item[childStatusKey]" class="el-icon-check"></i></span><span v-for="span in  childNameKey">{{item[span]}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props:[
      'parentTitle',
      'parentList',
      'childList',
      'childTitleList',
      'parentStatusKey',//父级列表状态字段
      'childStatusKey',//子级列表状态字段
      'parentNameKey',//父级列表展示字段
      'childNameKey',//子级列表展示字段
      'childKey',//子级列表唯一标识
      'childListName',//父级列表名字段
      'parentKey',//父级列表唯一标识
      'childIndexKey'//
    ],
    data(){
      return{
        parentIndex:''
      }
    },
    methods:{
      //点击父级列表 更换子级列表
      checkParent(obj,n){
        if(this.parentIndex===n) return;
        this.parentIndex=n;
        this.$emit('checkParent',obj,n)
      },
      //选择子集列表
      checkChild(obj,n){
        this.childList[n][this.childStatusKey]=!this.childList[n][this.childStatusKey];
        if(this.childList.every((obj)=>obj[this.childStatusKey]===true)){
          this.parentList[this.parentIndex][this.parentStatusKey]=2;
        }else{
          this.parentList[this.parentIndex][this.parentStatusKey]=this.childList.some((obj)=>obj[this.childStatusKey]===true)?1:0;
        }
        this.parentList[this.parentIndex][this.childListName]=this.childList.filter((obj)=>obj[this.childStatusKey]===true);
        this.$emit('update:parentList',this.parentList)
      },
      //更换父级列表状态 0为不选 1为半选 2位全选
      changeParentStatus(n){
        let status=this.parentList[n][this.parentStatusKey];
        this.parentList[n][this.parentStatusKey]=(status==0||status==1)?2:0;
        let isChecked=this.parentList[n][this.parentStatusKey]==2?true:false;
        for(let item of this.childList){
          item[this.childStatusKey]=isChecked;
        }
        this.parentList[n][this.childListName]=this.childList.filter((obj)=>obj[this.childStatusKey]===true);
        this.$emit('update:parentList',this.parentList)
        this.$emit('update:childList',this.childList)
        this.$emit('changeParentStatus',n)
      }
    },
    watch:{
      //监听子级列表 根据父级状态更新子集列表状态
      childList:{
        handler(obj){
          if(obj.length>0){
            let n=obj[0][this.childIndexKey];
            for(let item of obj){
              let isChecked;
              if(this.parentList[n][this.parentStatusKey]==1){
                isChecked=this.parentList[n][this.childListName].some(one=>one[this.childKey]==item[this.childKey])
              }else{
                isChecked=this.parentList[n][this.parentStatusKey]==2?true:false;
              }
              item[this.childStatusKey]=isChecked;
            }
            this.parentList[n][this.childListName]=obj.filter((one)=>one[this.childStatusKey]===true);
            this.$emit('update:childList',obj)
          }
        }
      },
      //监听父级列表 获取索引
      parentList:{
        handler(obj){
          this.parentIndex='';
          if(obj.constructor==Array){
            for(let i=0;i<obj.length;i++){
              if(obj[i][this.parentStatusKey]!=0){
                this.parentIndex=i;
                this.$emit('checkParent',this.parentList[this.parentIndex],this.parentIndex)
                return;
              }
            }
          }
        }
      }
    }
  }
</script>

<style lang='less'>
  .multiple-check-box{
    overflow: hidden;
    >div{
      width:50%;
      float:left;
      overflow: hidden;
    }
    h3{
      text-align: center;
      height:40px;
      line-height:40px;
      color:#fff;
      background: #38ADFF;
    }
    .right-box{
      border:0;
    }
    .parent-list{
      border-left:1px solid #EFEFEF;
    }
    ul{
      width:100%;
      height:240px;
      overflow: auto;
      border-bottom:1px solid #EFEFEF;
      border-right:1px solid #EFEFEF;
      li{
        height:32px;
        line-height: 32px;
        padding-left:12px;
        overflow: hidden;
        cursor: default;
      }
      li:hover,li.active{
        background:#D8EFFF;
      }
      .check-box{
        float: left;
        margin-top:8.5px;
        margin-right:8px;
        width:15px;
        height: 15px;
        border:1px solid #999999;
        border-radius: 4px;
        text-align:center;
        line-height:15px;
        overflow: hidden;
        cursor: pointer;
        span{
          display: block;
          font-size:18px;
          line-height: 10px;
        }
        .el-icon-check{
          font-size:14px;
        }
      }
    }
  }
</style>
