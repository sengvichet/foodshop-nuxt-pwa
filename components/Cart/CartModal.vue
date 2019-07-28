<template>

    <ModalBody v-if="showModal"
               z_index="1"
               :footerType="'save'"
               :title="modal_title"
               modalWidth="60%"
               modalHeight=""
               :showSubmitButton="ableToCheckOut"
               :footerText="$t('shop.cart.select_delivery_date')"
               @clickedSave="showCheckOutModal"
               @close="closeModal">

  <template slot="modal-content">

    <div class="body">

      <CartItem
      v-if = "!isLoading"
      v-for="(item,index) in cart_items"
      :id_prop="item.id"
      :name_prop="item.name"
      :moq_prop="item.moq"
      :quantity_prop="item.quantity"
      :price_prop="item.price"
      :total_prop="item.price*item.quantity"
      @reload="reload"
      />

      <div v-if="discount" class="list-bar">
          <h5>{{$t('shop.cart.discount_text')}} ( {{discount}}% )</h5>
          <div class="cartItem__total--price">
            <h5>- {{Math.ceil(discount_value)}} kr</h5>
          </div>
      </div>

      <div class="list-bar">
          <h5>{{$t('shop.cart.shipping_text')}}</h5>
          <div class="cartItem__total--price">
            <h5>{{Math.ceil(freight)}} kr</h5>
          </div>
      </div>

      <div class="list-bar">
          <h5>{{$t('shop.cart.total_text')}}</h5>
          <div class="cartItem__total--price">
            <h5>{{Math.ceil(total)}} kr</h5>
          </div>
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
import CartItem from '~/components/Cart/CartItem.vue'
import ModalBody from '~/components/modals/ModalBody.vue'

export default {

  components: {
   Icon,
   CartItem,
   ModalBody
 },

  data() {
    return {
      showModal:false,
      modal_title:this.$t('shop.cart.title'),
      shop_id:this.$store.getters.shop.shop_id,
      isLoading: false,
      cart_items: this.$store.getters.cart,
      freight: this.$store.getters.shop.shipping_cost,
      discount: (this.$store.getters.user.discount) ? this.$store.getters.user.discount : 0,
      discount_value:0,
      total:0,
      ableToCheckOut:true
    }
  },

  methods : {

    reload() {
      this.isLoading = true
      this.$nextTick(function () {
        this.cart_items = this.$store.getters.cart
        this.calcuateTotal()
        this.isLoading = false
      })

    },
    calcuateTotal(){
      this.total = 0
      this.discount_value = 0
      this.ableToCheckOut = true
      for(var x in this.$store.getters.cart) {
        this.total +=  parseFloat(this.$store.getters.cart[x].price * this.$store.getters.cart[x].quantity)

        if (this.$store.getters.cart[x].quantity < this.$store.getters.cart[x].moq) {
          this.ableToCheckOut = false
        }

      }

      if (this.total > 0 && this.discount > 0) {

        this.discount_value = parseFloat(this.total * (this.discount / 100 )).toFixed(2)
        this.total = this.total - this.discount_value

      }


      if (this.$store.getters.cart.length>0){

      let include_shipping  = false

      for(var x in this.$store.getters.cart) {

        if (this.$store.getters.cart[x].quantity > 0) {
          include_shipping = true
        }

      }

      if (include_shipping) {
      this.total += parseFloat(this.freight)
      }


      }
      this.total = parseFloat(this.total).toFixed(2)
    },
    showCheckOutModal() {
      this.closeModal()
      this.$emit('showCheckOutModal')
    },

    showCartModal(){
        this.$store.dispatch('lockBody');
        this.showModal = true;
        this.$store.dispatch('setTheme', {
          blur: true
        })

        this.calcuateTotal()
      },
      closeModal(){
        this.$store.dispatch('freeBody');
        this.showModal = false;
        this.$store.dispatch('setTheme', {
          blur: false,
          is_home_page: true
        })
      }
  }

}
</script>
