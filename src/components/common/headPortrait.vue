<template>
  <div class="headPortrait">
    <!--<friendDetailDialog :dialogFlag.sync="friendDetailFlag" :openData="detailData"></friendDetailDialog>-->
    <!--<groupDetailDialog :dialogFlag.sync="groupDetailFlag" :openData="detailData"></groupDetailDialog>-->
    <div v-if="hasDetail">
      <el-tooltip placement="top">
        <div slot="content">
          <p>ID:{{userId}}</p>
          <p>昵称:{{data.nickName}}</p>
          <p>备注:{{data.remark}}</p>
        </div>
        <div>
          <div v-show="status === 0" class="shelter" @click.stop="imgClick"></div>
          <img src="../../assets/imgages/userBaseHeadImg.png" alt="" class="headImg" @click.stop="imgClick">
          <img ref="uerHead" :src="url" alt="" :class="{headImg:true,userHeadImg:true,yourHead:userId===this.$store.state.userId}" @click.stop="imgClick">
        </div>
      </el-tooltip>
    </div>
    <div v-else>
      <div v-show="status === 0" class="shelter" @click.stop="imgClick"></div>
      <img src="../../assets/imgages/userBaseHeadImg.png" alt="" class="headImg" @click.stop="imgClick">
      <img ref="uerHead" :src="url" alt="" :class="{headImg:true,userHeadImg:true,yourHead:userId===this.$store.state.userId}" @click.stop="imgClick">
    </div>
  </div>
</template>
<script>
  // import friendDetailDialog from '../contacts/myFriendMoudle/friendDetailDialog'
  // import groupDetailDialog from '../contacts/myGroupsMoudle/groupDetailDialog'
    export default {
        name:'headPortrait',
        props:['userId','isSave','imgUrl','indexPath','status','hasDetail','data'],
        data: function () {
            return {
              // friendDetailFlag:false,
              // detailData:{},
              // groupDetailFlag:false
            };
        },
        computed:{
            url(){
              if(this.isSave){
                if(this.imgUrl){
                  return `http://${this.$store.state.statisFileIp}${this.imgUrl}`
                }else{
                  return this.userId===null?'':`http://${this.$store.state.statisFileIp}/headProtrait/${this.userId}.jpg`
                }
              }else{
                if(this.imgUrl){
                  return `http://${this.$store.state.statisFileIp}${this.imgUrl}?time=${new Date().getTime()}`
                }else{
                  return this.userId===null?'':`http://${this.$store.state.statisFileIp}/headProtrait/${this.userId}.jpg?time=${new Date().getTime()}`
                }
              }
            }
        },
        methods:{
          // getGroupDetailData(groupId) {
          //   return this.$http.post('/getGroupDetailData.do', {groupId: groupId})
          // },
          // getGroupMembers(groupId) {
          //   return this.$http.post('/getGroupMembers.do', {groupId: groupId})
          // },
          imgClick(){
            // if(this.imgUrl){
            //   Promise.all([this.getGroupDetailData(this.indexPath), this.getGroupMembers(this.indexPath)]).then(result => {
            //     // console.log(result);
            //     if (result[0].data.success && result[1].data.success) {
            //       this.detailData = {
            //         groupId: result[0].data.data[0].UG_ID,
            //         groupName: result[0].data.data[0].UG_Name,
            //         groupIntro: result[0].data.data[0].UG_Intro,
            //         groupNotice: result[0].data.data[0].UG_Notice,
            //         groupIcon: result[0].data.data[0].UG_Icon,
            //         createTime: result[0].data.data[0].UG_CreateTime,
            //         adminId: result[0].data.data[0].UG_AdminID,
            //         members: []
            //       };
            //       result[1].data.data.forEach(obj => {
            //         this.detailData.members.push({
            //           groupNick: obj.UGU_GroupNick,
            //           memberId: obj.UGU_UserID,
            //           joinTime: obj.UGU_CreateTime,
            //           authority: obj.UGU_Authority
            //         })
            //       });
            //       this.groupDetailFlag = true;
            //     }
            //   });
            // }else{
            //   this.$http.post('/getUserInfo.do',{userId:this.indexPath}).then(res=>{
            //     if(res.data.success){
            //       this.detailData={
            //         userId:res.data.data[0].U_LoginID,
            //         nickName:res.data.data[0].U_NickName,
            //         age:res.data.data[0].U_Age,
            //         birthday:res.data.data[0].U_Birthday,
            //         phone:res.data.data[0].U_Telephone,
            //         email:res.data.data[0].U_Email,
            //         name:res.data.data[0].U_Name,
            //         sex:res.data.data[0].U_Sex
            //       };
            //       this.friendDetailFlag=true;
            //     }
            //   })
            // }
            this.$emit('imgClick',this.indexPath)
          }
        },
      components:{
        // friendDetailDialog,
        // groupDetailDialog
      }
        // watch:{
        //   userId(val){
        //     if(val===null)return
        //       // this.$refs.uerHead.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`;
        //   }
        // }
    }
</script>
<style lang="less">
  .headPortrait{
    /*height: 50px;*/
    /*width: 50px;*/
    position: relative;
    overflow: hidden;
    .shelter{
      z-index: 99;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      background: black;
      opacity: 0.5;
    }
    .headImg{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: white;
      vertical-align: top;
    }
    .userHeadImg{
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
    }
  }
</style>
