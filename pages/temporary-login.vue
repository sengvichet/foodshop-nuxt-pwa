<template>
    <div>
    <CreatePasswordModal ref="PasswordModal" />
  </div>
</template>

<script>

import LoginModal from '~/components/Auth/LoginModal.vue'
import CreatePasswordModal from '~/components/Auth/CreatePasswordModal.vue'
import {
  Auth
} from "aws-amplify";
import Icon from 'vue-awesome'

export default {

  components: {
    LoginModal,
    CreatePasswordModal
  },
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      isLoggedIn:this.$store.getters.user.isAuthenticated
    }
  },
  mounted () {
    this.mixpanelTrack('Page View: Temporary Login Page');
    this.$refs.PasswordModal.showCreatePasswordModal()
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
