<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch:{
    $route(to,from){
      // console.log('to',to);
      // console.log('from',from);
      if(to.name==='login'){
        this.$store.dispatch('socketDisconnect');
        sessionStorage.clear();
      }
    }
  }
}
</script>

<style lang="less">
  body,html{
    height: 100%;
    overflow: hidden;
  }
  #app{
    height: 100%;
  }
</style>
