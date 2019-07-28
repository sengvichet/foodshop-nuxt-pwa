<template>
    <ModalBody v-if="showModal"
               z_index="1"
               ref="createPasswordModal"
               :footerType="'save'"
               :title="$t('shop.login.create_password_title')"
               modalWidth="50%"
               modalHeight=""
               showSubmitButton=true
               :footerText="$t('shop.login.login_button')"
               @clickedSave="onSubmit"
               @close="closeModal">

  <template slot="modal-content">

    <input class="list-bar input-text"
               type="email" v-model="email" required :placeholder="$t('shop.login.email')"/>
    </input>

    <input class="list-bar input-text"
               type="password" v-model="temporary_password" required :placeholder="$t('shop.login.temporary_password')"/>
    </input>

    <input class="list-bar input-text"
               type="password" v-model="new_password" required :placeholder="$t('shop.login.new_password')" />
    </input>

  </template>

  </ModalBody>

</template>

<script>
import {
  Auth,API
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
      showModal:false,
      email: '',
      temporary_password: '',
      new_password:'',
      shop_id:this.$store.getters.shop.shop_id,
      isLoading: false
    }
  },
  async created () {

   await Auth.signOut();

 },
  methods : {

    async onSubmit() {

    try {
      this.isLoading = true
      let user = await Auth.signIn(this.email, this.temporary_password)
      await Auth.completeNewPassword(user,this.new_password,user.challengeParam.requiredAttributes)
      await Auth.signOut();
      await Auth.signIn(this.email,this.new_password)
      this.$router.push('/menu/')

    } catch (e) {
    bugsnagClient.notify(e)
    this.$notify.error(e.message, 'success')
    this.$refs.createPasswordModal.stopLoading()
    this.isLoading = false


    }

},

showCreatePasswordModal(){
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
    this.$router.push('/shop')
  }

  }

}
</script>
