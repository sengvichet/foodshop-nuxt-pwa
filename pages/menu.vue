<template>
  <div>
    <div v-bind:class="{ blur: is_blur }">
      <div v-if="showVideosPage" class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.videos')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
        <a
        href="#"
        class="list-bar__click-overlay"
        to="/videos"
        @click="mixpanelTrack('Menu Click: Videos'); goTo('/videos/');"
        />
      </div>

      <div v-if="isLoggedIn && !isShopOwner && userLevel == 'owner'" class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.employees')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
        <a
        href="#"
        class="list-bar__click-overlay"
        to="/videos"
        @click="mixpanelTrack('Menu Click: Employees'); goTo('/employees/');"
        />
      </div>

      <div v-if="isLoggedIn && !isShopOwner" class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.orders')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
        <a
        href="#"
        class="list-bar__click-overlay"
        to="/videos"
        @click="mixpanelTrack('Menu Click: Orders History'); goTo('/orders-history/');"
        />
      </div>

      <div  class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.contact')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
        <a
        href="#"
        class="list-bar__click-overlay"
        to="/videos"
        @click="mixpanelTrack('Menu Click: Contact'); goTo('/contact/');"
        />
      </div>

      <div v-if="!isLoggedIn" class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.sign_in')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
        <a
        href="#"
        class="list-bar__click-overlay"
        to="/videos"
        @click="mixpanelTrack('Menu Click: Login'); goTo('/login/');"
        />
      </div>

      <div v-if="isLoggedIn" class="list-bar">
        <h5 class="list-bar__title">{{$t('shop.menu.sign_out')}}</h5>
        <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />

        <a
        href="#"
        class="list-bar__click-overlay"
        @click="mixpanelTrack('Menu Click: Logout'); logout();"
        />
      </div>
    </div>
      <LoginModal ref="LoginModal" />
  </div>
</template>

<script>

import LoginModal from '~/components/Auth/LoginModal.vue'
import {
  Auth
} from "aws-amplify";
import Icon from 'vue-awesome'

export default {

  components: {
    LoginModal
  },
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      isLoggedIn:this.$store.getters.user.isAuthenticated,
      isShopOwner:this.$store.getters.user.isShopOwner,
      userLevel: (this.$store.getters.user.userInfo!=null) ? this.$store.getters.user.userInfo.user_type : '',
      showVideosPage:this.$store.getters.shop.show_videos_page
    }
  },
  created () {
    console.log(this.$store.getters.user.isAuthenticated);
    this.mixpanelTrack('Page View: Menu Page');
  },

  computed:{
  checkBlur() { return this.$store.getters.theme.blur },
  checkLoggedIn() { return this.$store.getters.user.isAuthenticated },
  checkIsShopOwner() { return this.$store.getters.user.isShopOwner },
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
    checkIsShopOwner(newValue) {
      if (this.$store.getters.user.isShopOwner) {
        this.isShopOwner = true
      }
      else {
        this.isShopOwner = false
      }
      this.userLevel = (this.$store.getters.user.userInfo!=null) ? this.$store.getters.user.userInfo.user_type : ''
    },
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
  },
  methods : {
    goTo (path) {
      this.$router.push(path)
    },
    showLoginModal () {
      this.$refs.LoginModal.showLoginModal()
    },
    async logout () {
      await Auth.signOut();
      await this.mixpanelTrack('Signout');
      await this.mixpanelRest()
      await this.$store.dispatch('setUser',{isAuthenticated:false,userInfo:null})
    }
  }

}

</script>
