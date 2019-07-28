<template>

  <ModalBody v-if="showModal"
             ref="LoginModal"
             z_index="1"
             :footerType="'save'"
             :title="modal_title"
             modalWidth="50%"
             modalHeight=""
             showSubmitButton=true
             :additionalLinksTitle="$t('shop.login.forget_password_text')"
             additionalLinksUrl='/forget-password/'
             :footerText="$t('shop.login.login_button')"
             @clickedSave="onSubmit"
             @close="closeModal">

<template slot="modal-content">

  <input class="list-bar input-text"
             type="text"
             v-model="email"
             :placeholder="$t('shop.login.email')"/>

  <input class="list-bar input-text"
             type="password"
             v-model="password"
             :placeholder="$t('shop.login.password')"/>


</template>

</ModalBody>

</template>

<script>
import {
  Auth,API
} from "aws-amplify";
import Icon from 'vue-awesome'
import ModalBody from '~/components/modals/ModalBody.vue'
import Vue from 'vue'
import Notify from 'vue2-notify'
export default {

  components: {
   Icon,
   ModalBody
 },

  data() {
    return {
      showModal: false,
      modal_title: this.$t('shop.login.title'),
      email: '',
      password: '',
      shop_id:this.$store.getters.shop.shop_id,
      shop_company_id:this.$store.getters.shop.shop_company_id,
      isLoading: false
    }
  },
   created() {
     Vue.use(Notify, {

        position: 'top-center',
        visibility: 18000,
        permanent: true,

      })
  },

  methods : {

    async onSubmit(event) {
      console.log(window.navigator.onLine)
      if(window.navigator.onLine == false) {
        this.$notify.error('Please connect to internet to perform this action .', 'error');
        this.isLoading = false
        return;
      } else {
        try {

          if (!this.email || !this.password) {

            this.$notify.error(this.$t('shop.login.invalid_entry'), 'success')
            this.$refs.LoginModal.stopLoading()
            return
          }

          this.isLoading = true

          let auth_result = await Auth.signIn(this.email.toLowerCase(), this.password)

          var currentUser = await Auth.currentSession()
          if (currentUser) {

            this.mixpanelIdentify(this.email)
            this.mixpanelTrack('Login');

            let first_name = (currentUser.idToken.payload['custom:first_name']) ? currentUser.idToken.payload['custom:first_name'] : ''
            let last_name = (currentUser.idToken.payload['custom:last_name']) ? currentUser.idToken.payload['custom:last_name'] : ''

            this.mixpanelSetNewPeople({
              $email: this.email.toString(),
              $first_name: first_name,
              $last_name: last_name
            })

            await API.get("metamat", "/cart/access/" + this.shop_id).then(async (permissions) => {

              if (permissions.length == 1 || this.shop_company_id == currentUser.idToken.payload['custom:company_id']) {

                let isShopOwner = (this.shop_company_id == currentUser.idToken.payload['custom:company_id']) ? true : false

                if (isShopOwner) {

                  await API.get("metamat", "/customers/" + this.shop_id).then((customers) => {
                    this.$store.dispatch('setUser', {
                        userInfo: currentUser.idToken.payload,
                        isAuthenticated: true,
                        isShopOwner: isShopOwner,
                        customers: customers
                      },
                    )
                  })

                } else {
                  let discount = (permissions[0].discount) ? permissions[0].discount : 0
                  this.$store.dispatch('setUser', {
                      userInfo: currentUser.idToken.payload,
                      isAuthenticated: true,
                      isShopOwner: isShopOwner,
                      discount: discount
                    },
                  )
                }

                //  this.isLoading = false
                //window.location = '/menu/'
                this.$refs.LoginModal.close()
                this.$router.push('/menu/')
                //  this.closeModal()

              } else {

                await Auth.signOut();
                this.$notify.error(this.$t('shop.login.not_allowed'), 'success')
                this.isLoading = false
                this.email = ''
                this.password = ''

              }

            })

          }


        } catch (e) {
          bugsnagClient.notify(e)
          this.$notify.error(e.message, 'success')
          this.isLoading = false
          this.email = ''
          this.password = ''

        }
      }
},

  showLoginModal(){
      this.$store.dispatch('lockBody');
      this.showModal = true;
      this.$store.dispatch('setTheme', {
        blur: true
      })
    },
    closeModal(){
      this.$store.dispatch('freeBody');
      this.showModal = false;
      this.$store.dispatch('setTheme', {
        blur: false
      })
      //this.$router.push('/menu/')
    },

  }

}
</script>
<style>
.forgot-passord-text {
  text-align: center;
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  font-size: 0.85em;
}
</style>
