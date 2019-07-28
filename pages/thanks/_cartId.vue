<template>
    <div>
    <ThankYouModal ref="ThankYouModal" />
  </div>
</template>

<script>

import {Auth,API} from "aws-amplify"
import ThankYouModal from '~/components/Cart/ThankYouModal.vue'

export default {

  components: {
    ThankYouModal
  },
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      isLoggedIn:this.$store.getters.user.isAuthenticated
    }
  },
  mounted () {
    this.mixpanelTrack('Page View: Thank You Page');
    this.$refs.ThankYouModal.showThankYouModal()
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur },
  checkLoggedIn() { return this.$store.getters.user.isAuthenticated },
  },
  watch: {

    checkLoggedIn(newValue) {

      if (this.$store.getters.user.isAuthenticated) {
        this.isLoggedIn = true
      }
      else {
        this.isLoggedIn = false
      }
    },
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
  },
  methods : {
    showThankYouModals () {
      this.$refs.ThankYouModal.showThankYouModal()
    },
    async logout () {
      await Auth.signOut();
      await this.$store.dispatch('setUser',{isAuthenticated:false,userInfo:null})
    }
  }

}

</script>
