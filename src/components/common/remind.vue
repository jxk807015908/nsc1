<template>
  <div :class="{remind:true,checked:isChecked}" @click="messageCheck">
    <span v-if="data.isRead==='0'&&data.tipNum&&!isChecked" class="new">new</span>
    <i class="el-icon-close" @click.stop="deleteRemind"></i>
    <div v-if="data.messageType==='1'" class="chatObj">
      <el-badge :value="data.tipNum" class="item" v-if="data.tipNum&&data.isRead==='0'&&!isChecked">
        <span>1</span>
      </el-badge>
      <headPortrait v-if="data.remark==='group'&&groupIcon" :imgUrl="groupIcon" @imgClick="imgClick"
                    :indexPath="data.fromId"></headPortrait>
      <headPortrait v-if="data.remark==='friend'" @imgClick="imgClick" :indexPath="data.fromId"
                    :userId="data.fromId"></headPortrait>
      <span class="remindObjName">{{data.fromName||data.fromId}}</span>
    </div>
    <div v-if="data.messageType==='2'" class="remindTip">
      <p>你收到一条好友请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='3'" class="remindTip">
      <p>你又多了一位新朋友！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='4'" class="remindTip">
      <p>你被对方从好友中删除！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='5'" class="remindTip">
      <p>对方拒绝了你的好友邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='6'" class="remindTip">
      <p>你收到一条群邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='7'" class="remindTip">
      <p>对方拒绝了你的群邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='8'" class="remindTip">
      <p>你收到一条群请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='9'" class="remindTip">
      <p>对方拒绝了你的群请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
  </div>
</template>
<script>
  import headPortrait from './headPortrait'

  export default {
    name: 'remind',
    props: ['data', 'index', 'isChecked'],
    data: function () {
      return {
        groupIcon: null,
        detailData: {}
      };
    },
    mounted() {
      if (this.data.messageType === '1' && this.data.remark === 'group') {
        this.$http.post('/getGroupDetailData.do', {groupId: this.data.fromId}).then(res => {
          if (res.data.success) {
            this.groupIcon = res.data.data[0].UG_Icon;
          }
        })
      }
    },
    methods: {
      imgClick(userId) {
        let messageVm=this.$parent;
        while(messageVm.$el.className!=='myMessage'){
          messageVm=messageVm.$parent;
        }
        if(this.data.remark==='group'){
          console.log(this.$parent);
          messageVm.getGroupDetail(userId);
        }else{
          messageVm.getUserInfo(userId);
        }
      },
      messageCheck() {
        this.$emit('messageCheck', this.index)
      },
      deleteRemind() {
        this.$emit('deleteRemind', this.index)
      }
    },
    components: {
      headPortrait
    }
  }
</script>
<style lang="less">
  .remind {
    padding: 10px;
    position: relative;
    .new {
      position: absolute;
      color: lawngreen;
      font-size: 12px;
      transform: rotate(-30deg);
      left: 0;
      top: 0;
    }
    .remindTip{
      p {
        font-size: 12px;
        color: yellow;
      }
      .name {
        text-align: right;
        color: white;
      }
    }
    .el-icon-close {
      position: absolute;
      right: 2px;
      top: 2px;
      color: gray;
    }
    .el-icon-close:hover {
      color: black;
    }
    .headPortrait {
      width: 40px;
      height: 40px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
    .remindObjName {
      color: white;
    }
    .item {
      span {
        color: transparent;
      }
    }
  }

  .remind:not(.checked):hover {
    background: #545c55;
  }

  .remind.checked {
    background: #8c939d;
  }
</style>
