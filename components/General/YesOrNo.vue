<template lang="html">
    <div class="list-bar list-bar--black-translucent u-flex-col">
      <slot></slot>
      <button @click="no"
              class="button-square button-square--no
                     u-width-100
                     u-margin-bottom-default
                     moose__footer-button-text margin-top">{{$t('shop.general.no')}}</button>

      <button @click="yes"
               class="button-square
                      button-square--yes
                      u-width-100
                      moose__footer-button-text">{{$t('shop.general.yes')}}</button>
      </div>
</template>

<script>
export default {
  name: 'YesOrNo',
  methods:{
    yes(){
      this.$emit('yes');
      if(process.env.stage === 'dev'){
        console.log('dev, YesOrNo: clicked yes!');
      }
    },
    no(){
      this.$emit('no');
      if(process.env.stage === 'dev'){
        console.log('dev, YesOrNo: clicked no!');
      }
    }
  }
}
</script>

<style lang="css">
.margin-top {
  margin-top: 10rem;
}
</style>
