<template>
  <div class="register">

  </div>
</template>

<script>
  export default {
    name: "register",
    data: function () {
      return {}
    },
    mounted(){
      console.log(this.$route);
      console.log(this.$router);
      this.$http.get('/emailReg.do',{
        params:{
          uid:this.$route.query.uid
        }
      }).then(res=>{
        if(res.data.success){
          this.$message({message:'注册成功',type:'success'});
        }
        this.$router.push({name: 'login'})
      })
    }
  }
</script>

<style lang="less">
  .register {

  }
</style>
