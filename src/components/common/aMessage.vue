<template>
  <div :class="{aMessage:true,atRight:isAtRight}">
    <!--<img :class="{fl:!isAtRight,fr:isAtRight}" src="../../assets/imgages/userBaseHeadImg.png" alt="">-->
    <headPortrait @imgClick="imgClick" :indexPath="data.senderId" :isSave="false" :class="{fl:!isAtRight,fr:isAtRight}" :userId="data.senderId"></headPortrait>
    <div class="content" :class="{fl:!isAtRight,fr:isAtRight}">
      <span id="name">{{name}}</span>
      <div v-if="data.messageType!==4" v-html="data.message"></div>
      <div v-if="data.messageType===4" class="file-wrap">
        <img :src="file.iconPath" alt="">
        <div>
          <p>{{file.name}}</p>
          <!--<a @click="download">下载</a>-->
          <a :href="`/downloadFile.do?filePath=${data.filePath}`">下载</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import headPortrait from './headPortrait'
    export default {
        name:'aMessage',
        props:['name','isAtRight','expressArr','data'],
        data: function () {
            return {
              message:'',
              // file:{
              //   name:'',
              //   path:'',
              //   iconPath:''
              // }
            };
        },
        computed:{
          file(){
            let temp ={
              name:'',
              path:'',
              iconPath:''
            };
            if(this.data.messageType===4){
              let arr=this.data.filePath.split('/');
              temp.name=arr[arr.length-1];
              temp.path='http://'+this.$store.state.statisFileIp+this.data.filePath;
              temp.iconPath='http://'+this.$store.state.statisFileIp+'/file/baseIcon/file1.jpg';
            }
            return temp;
          }
        },
        mounted(){
          // console.log('messageType:',this.data.messageType);
          // if(this.data.messageType===4){
          //   let arr=this.data.filePath.split('/');
          //   this.file.name=arr[arr.length-1];
          //   this.file.path='http://'+this.$store.state.statisFileIp+this.data.filePath;
          //   this.file.iconPath='http://'+this.$store.state.statisFileIp+'/file/baseIcon/file1.jpg';
          // }
        },
        methods:{
          download(){
            this.$message({type:'success',message:'正在下载'});
            this.$http.get('/downloadFile.do',{
              params:{
                filePath:this.data.filePath
              }
            }).then((res)=>{
              window.open(res, '_blank');
              this.$message({type:'success',message:'下载完成'});
            })
            // window.open(this.file.path, '_blank');
          },
          imgClick(indexPath){
            this.$emit('imgClick',indexPath);
          }
        },
        components:{
          headPortrait
        }
    }
</script>
<style lang="less">
  .aMessage{
    overflow: hidden;
    margin-bottom: 20px;
    .headPortrait{
      overflow: hidden;
      width: 40px;
      height: 40px;
    }
    /*>img{*/
      /*border-radius: 20px;*/
      /*width: 40px;*/
      /*height: 40px;*/
    /*}*/
    .content{
      margin-left: 10px;
      margin-right: 10px;
      span{
        color: #8c939d;
      }
      >div{
        max-width: 500px;
        margin-top: 10px;
        background: white;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 10px;
        word-wrap:break-word;
        img{
          min-width: 50px;
          max-width: 300px;
        }
        video{
          min-width: 50px;
          max-width: 300px;
        }
      }
      .file-wrap{
        overflow: hidden;
        font-size: 12px;
        img{
          float: left;
          height: 100px;
        }
        >div{
          max-width: 100px;
          height: 100px;
          float: left;
          clear: none;
          overflow: hidden;
          text-align: center;
          position: relative;
          p{
            /*font-size: 12px;*/
            /*float: left;*/
            margin-top: 10px;
          }
          a{
            color: #66b1ff;
            position: absolute;
            bottom:10px;
          }
          a:hover{
            cursor: pointer;
          }
        }
      }
    }
  }
  .atRight{
    text-align: right;
    >div{
      #name{
        color: blue;
      }
    }
  }
</style>
