<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
