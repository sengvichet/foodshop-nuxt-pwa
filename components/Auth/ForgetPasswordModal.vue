<template>
      <ModalBody v-if="showModal"
                ref="ForgetPasswordModal"
                 z_index="1"
                 :footerType="'save'"
                 :title="$t('shop.login.forget_password_text')"
                 modalWidth="50%"
                 modalHeight=""
                 showSubmitButton=true
                 :additionalLinksTitle="$t('shop.login.title')"
                 additionalLinksUrl='/login/'
                 :footerText="$t('shop.login.reset_password')"
                 @clickedSave="onSubmit"
                 @close="closeModal">

    <template slot="modal-content">

      <input class="list-bar input-text"
                 type="email" v-model="email" required :placeholder="$t('shop.login.email')"/>
      </input>

    </template>

    </ModalBody>

</template>

<script>
import {
  Auth,
  API
} from "aws-amplify";
import Icon from 'vue-awesome'
import ModalBody from '~/components/modals/ModalBody.vue'
export default {

  components: {
    Icon,
    ModalBody
  },


  data() {
    return {
      showModal: false,
      email: '',
      temporary_password: '',
      new_password: '',
      shop_id: this.$store.getters.shop.shop_id,
      isLoading: false
    }
  },
  async created() {
    await Auth.signOut();
  },
  methods: {

    async onSubmit() {

      try {
        this.isLoading = true
        await Auth.forgotPassword(this.email)
        this.$notify.success(this.$t('shop.login.forget_password_error'), 'success')
        this.isLoading = false
        this.$router.push('/menu')
      } catch (e) {
        bugsnagClient.notify(e)
        this.$notify.error(e.message, 'success')
        this.$refs.ForgetPasswordModal.stopLoading()
        this.isLoading = false
      }

    },

    showForgetPasswordModal(){
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
        this.$router.push('/shop/')
      }
  }

}
</script>
