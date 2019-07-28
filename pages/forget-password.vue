<template>
    <div>
    <ForgetPasswordModal ref="ForgetPasswordModal" />
  </div>
</template>

<script>
import ForgetPasswordModal from '~/components/Auth/ForgetPasswordModal.vue'
import {
  Auth
} from "aws-amplify";
import Icon from 'vue-awesome'

export default {

  components: {
    ForgetPasswordModal
  },
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      isLoggedIn:this.$store.getters.user.isAuthenticated
    }
  },
  mounted () {
    this.mixpanelTrack('Page View: Forget Password Page');
    this.$refs.ForgetPasswordModal.showForgetPasswordModal()
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
    showLoginModal () {
      this.$refs.LoginModal.showModal()
    },
    async logout () {
      await Auth.signOut();
      await this.$store.dispatch('setUser',{isAuthenticated:false,userInfo:null})
    }
  }

}

</script>
