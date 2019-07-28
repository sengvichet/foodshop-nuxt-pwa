<template>

  <ModalBody v-if="showModal"
             z_index="1"
             :title="modal_title"
             modalWidth="50%"
             modalHeight=""
             showSubmitButton=false
             footerText=""
             @clickedSave=""
             @close="closeModal">

<template slot="modal-content">

  <div class="body">

    <div class="list-bar list-bar__summary">

    <p class="list-bar__summary-title">{{$t('shop.thanks.your_order')}}</p>
    <p
    v-for="(item,index) in items"
    >{{item.quantity}} x {{item.name}}</p>


    <p class="list-bar__summary-title">{{$t('shop.thanks.delivery_at')}}</p>
    <p>{{delivery_point_name}}</p>
    <p>{{delivery_point_address}}</p>

    <p v-if="delivery_date!='01-01-1970'" class="list-bar__summary-title">{{$t('shop.thanks.before')}}</p>
    <p v-if="delivery_date!='01-01-1970'"><span v-if="delivery_time">kl.</span> {{delivery_time}} {{$t('shop.thanks.delivery_time')}} {{delivery_date}}</p>

  </div>
  </div>

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
 data () {
     return {
       isLoading:false,
       showModal:false,
       delivery_date:'',
       delivery_time:'',
       delivery_point_name:'',
       delivery_point_address:'',
       items:[],
       modal_title:this.$t('shop.thanks.title')
     }
   },
   async created() {

     this.isLoading = true
     await API.get("metamat", "/cart/"+this.$route.params.cartId).then((cart) => {

       this.delivery_point_name = cart.cart.delivery_point_name
       this.delivery_point_address= cart.cart.delivery_point_address

       this.delivery_date = this.formatTimeStampDate(cart.cart.delivery_date)

       if (cart.cart.delivery_time) {
         this.delivery_time = cart.cart.delivery_time
       }

       this.items = cart.cart.items

       this.isLoading = false
       //this.showThankYouModal()
       setTimeout(async function(){
         await Auth.signOut();
         await Auth.cleanCachedItems()
         window.location = '/shop/'
       }.bind(this), 30000  )
     })


   },
   methods : {
         showThankYouModal () {
           this.$store.dispatch('setTheme', {
             blur: true
           })
           this.showModal = true
         },
         async closeModal () {
           this.showModal = false
           this.$store.dispatch('setTheme', {
             blur: false
           })
           await Auth.signOut();
           await Auth.cleanCachedItems()
           this.$router.push('/shop')
         }
   }

}
</script>
