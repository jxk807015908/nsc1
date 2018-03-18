<template>
  <div class="el-input"><input type="text" class="el-input__inner" :value="value" @input="updateValue($event.target)" @blur="blur" @keyup="keyup"></div>
</template>

<script>
  export default {
    props:['value','reg','max','min'],
    data(){
      return{
        oldVal:this.value
      }
    },
    methods: {
      updateValue(el) {
        let val=el.value;
        if(this.getResult(val)){
          this.oldVal=val;
          if(val<this.min){
            el.value=this.oldVal=this.min;
          }
          if(val>this.max){
            el.value=this.oldVal=this.max;
          }
        }else{
          el.value=this.oldVal;
        }
        this.$emit('input', this.oldVal)
      },
      blur(e){
        this.$emit('blur',e)
      },
      keyup(e){
        this.$emit('keyup',e)
      },
      getResult(val){
        if(!this.reg) return true;
        if(this.reg.constructor==RegExp){
          return this.reg.test(val)
        }else if(this.reg.constructor==Array||this.reg.constructor==Object){
         for(let key in this.reg){
           if(!this.reg[key].test(val)) return false
         }
         return true;
        }else{
          return true;
        }
      }
    }
  }
</script>

