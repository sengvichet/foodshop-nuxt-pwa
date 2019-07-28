<template lang="html">
  <div class="">
    <LoaderButton
      v-if="!showPrompt"
      @was_clicked="doStuff()"/>

    <YesOrNo
      v-if="showPrompt"
      @yes="emitClick()"
      @no="showPrompt = false">
      <p class="app-ui-overlay__section-title
            u-text-align-center"> {{prompt}} <p/>

    </YesOrNo>

  </div>
</template>

<script>
import LoaderButton from '~/components/Inputs/LoaderButton.vue'
import YesOrNo from '~/components/General/YesOrNo.vue'

export default {
  components: {
    LoaderButton,
    YesOrNo
  },
  props: [
    'prompt'
  ],
  data(){
    return {
      showPrompt: false
    }
  },
  computed: {

  },
  created(){

  },
  methods: {
    doStuff(){
      if(this.prompt){
        this.showPrompt = true;
      } else{
        this.emitClick();
      }
    },
    emitClick(){
      this.showPrompt = false;
      this.$emit('was_clicked');

    }
  }
}
</script>

<style lang="css" scoped>

</style>
