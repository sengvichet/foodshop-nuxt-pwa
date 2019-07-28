<template>
  <ModalBody v-if="showModal"
             z_index="1"

             :title="modal_title"
             modalWidth="75%"
             modalHeight=""
             showSubmitButton=false
             @clickedSave="onSubmit"
             @close="closeModal">

<template slot="modal-content">

<div v-html="content"></div>

</template>

</ModalBody>

</template>

<script>

import ModalBody from '~/components/modals/ModalBody.vue'
export default {
  components: {
   ModalBody
 },

 props : {
   modal_title: {
     type: String,
     required: true
   },
   video_emded_url: {
     type: String,
     required: true
   }
 },

  data() {
    return {
      showModal: false,
      isLoading: false,
      modal_title:'',
      video_emded_url:'',
      content:''
    }
  },
  methods : {

  showWatchVideoModal(){
    console.log(123);
    console.log(this.video_emded_url);

      this.content= `<iframe width="100%" height="400" src="`+this.video_emded_url+`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      this.$store.dispatch('lockBody');
      this.showModal = true;
      this.$store.dispatch('setTheme', {
        blur: true
      })
    },
    closeModal(){
      this.$store.dispatch('freeBody');
      this.mixpanelTrack('Video Close: Videos Page')
      this.showModal = false;
      this.$store.dispatch('setTheme', {
        blur: false
      })
    },

  }

}
</script>
