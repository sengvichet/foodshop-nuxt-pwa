<template>


  <ModalBody v-if="showModal"
             z_index="1"
             :footerType="'next'"
             :title="title"
             modalWidth="50%"
             modalHeight=""
             showSubmitButton=true
             :footerText="submit_button"
             @clickedNext="onSubmit"
             @close="closeModal">

<template slot="modal-content">


    <select v-if="isLoggedIn" v-model="selectedDeliveryPoint" class="list-bar input__selector" >
      <option v-for="deliveryPoint in deliveryPoints" :value="deliveryPoint.value"> {{deliveryPoint.text}} </option>
    </select>

    <textarea id="new_task_desc" v-if="isLoggedIn"
             class="list-bar input__text"
             v-model="comments"
             :placeholder="$t('shop.service.question')"
             :rows="8"
             :max-rows="8">
          </textarea>


          <input v-if="!isLoggedIn" class="list-bar input-text"
          type="text"
          v-model="email"
          :placeholder="$t('shop.login.email')"/>
         

          <input v-if="!isLoggedIn" class="list-bar input-text"
          type="password"
          v-model="password"
          :placeholder="$t('shop.login.password')"/>
          

</template>

</ModalBody>

</template>

<script>

import {Auth,API} from "aws-amplify"
import ModalBody from '~/components/modals/ModalBody.vue'
import Icon from 'vue-awesome'

export default {

  components: {
    Icon,
    ModalBody
 },
  data() {
    return {
      showModal:false,
      title:this.$t('shop.service.title'),
      submit_button:this.$t('shop.service.book'),
      email: '',
      password: '',
      user_email:'',
      comments:'',
      cart_items: [
        {
        id:"1",
        name:"Machine Service",
        price:"0",
        quantity:1
      }
    ],
      isLoggedIn:this.$store.getters.user.isAuthenticated,
      shop_id:this.$store.getters.shop.shop_id,
      isLoading:false,
      selectedDeliveryPoint: null,
      deliveryPoints: []
    }
  },

  async created () {
    if(this.isLoggedIn) {
      await this.listDeliveryPoints();
    }
  },
  computed:{

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
    }
  },
  methods : {

    async onSubmit (event) {

      if (this.isLoggedIn) {
          this.placeServiceOrder()
      }
      else {
        this.loggin()
      }

    },

        showOrderServiceModal(){
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

          },
    async placeServiceOrder () {

      this.isLoading = true
      if ( this.cart_items.length == 0 ||
        this.selectedDeliveryPoint == null )
      {
        this.$notify.error(this.$t('shop.checkout.invalid_entry'), 'success')
        this.isLoading = false
        return
      }

      await API.post("metamat", "/cart/service/"+this.shop_id,{
        body:{
        items: this.cart_items,
        comment:this.comments,
        delivery_point: this.selectedDeliveryPoint,
        delivery_date: null
      }

    }).then(async (cart_id) => {
      this.$notify.success(this.$t('shop.service.success'), 'success')
      this.mixpanelTrack('Service Ordered: Contact Page');
      this.$router.push('/')
      })


    },

    async loggin(){

    try {

      this.isLoading = true

      if ( !this.email || !this.password){

          this.$notify.error(this.$t('shop.login.invalid_entry'), 'success')
          return
      }

      let auth_result = await Auth.signIn(this.email.toLowerCase(), this.password)

      var currentUser = await Auth.currentSession()
       if (currentUser) {

      await API.get("metamat", "/cart/access/"+this.shop_id).then( async (permissions) => {

      if(permissions.length == 1){

        this.$store.dispatch('setUser', {
          userInfo: currentUser.idToken.payload
        })

        await this.listDeliveryPoints();
        this.user_email = this.email
        this.isLoggedIn = true
        this.isLoading = false

      }

      else {

        await Auth.signOut();
        this.$notify.error(this.$t('shop.login.not_allowed'), 'success')
        this.isLoading = false

      }

    })

       }


    } catch (e) {
    bugsnagClient.notify(e)
    this.$notify.error(e.message, 'success')

    }

    },

    async listDeliveryPoints () {

      await API.get("metamat", "/cart/delivery_points/"+this.shop_id+'/null').then((delivery_points) => {

        this.deliveryPoints = []
        this.deliveryPoints.push({value:null,text:this.$t('shop.checkout.select_delivery_point')})

        for (var x in delivery_points ){
          this.deliveryPoints.push({value:delivery_points[x].objectId,text:delivery_points[x].objectName})
        }

      })

    }

  }

}
</script>
