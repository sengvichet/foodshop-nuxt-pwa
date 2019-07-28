<template>
  <div class="app-footer" >
    <!-- mobile -->
    <div v-if="$device.isMobile && !is_home_page" class="app-footer__item app-footer__item--back">
      <a  class="app-footer__menu-icon app-footer__menu-icon--back " href="javascript:history.go(-1)">
        <img src="~assets/images/iconBackButton.svg"/>
      </a>
    </div>
    <!-- web, tablet -->
    <div v-if="!$device.isMobile" class="app-footer__item app-footer__item--back">
      <a  class="app-footer__menu-icon app-footer__menu-icon--back " href="javascript:history.go(-1)">
        <img v-if="!is_home_page" src="~assets/images/iconBackButton.svg"/>
      </a>
    </div>

    <!-- mobile -->
    <div v-if="$device.isMobile && (!ableToCheckOut || cart_items.length == 0)" class="app-footer__item">
      <a class="app-footer__menu-icon" href="#" @click.prevent="navigate">
        <img class="menu-icon" src="~assets/images/iconMenuButton.svg" />
      </a>
    </div>
    <!-- web, tablet -->
     <div v-if="!$device.isMobile" class="app-footer__item">
      <a class="app-footer__menu-icon" href="#" @click.prevent="navigate">
        <img class="menu-icon" src="~assets/images/iconMenuButton.svg" />
      </a>
    </div>
    <!-- mobile -->
    <div v-if="$device.isMobile && (!is_home_page || (is_home_page && cart_items.length > 0))" class="app-footer__item">
      <div v-if="cart_items.length > 0" class="app-footer__cart-elments">
        <a v-if="ableToCheckOut" class="checkout" href="#" @click.prevent="showCheckOutModal">{{$t('shop.footer.checkout_cta')}}</a>
        <div class="cart-total" @click.prevent="showCartModal">
        <p>{{Math.ceil(total)}} kr</p>
        <p>{{$t('shop.footer.tax')}}</p>
        </div>
      </div>
      <CheckOutModal
        ref="CheckOutModal"
        @showCartModal="showCartModal"
      />
      <CartModal
        ref="CartModal"
        @showCheckOutModal="showCheckOutModal"
      />
    </div>
    <!-- web, tablet -->
    <div v-if="!$device.isMobile" class="app-footer__item">
      <div v-if="cart_items.length > 0" class="app-footer__cart-elments">
        <a v-if="ableToCheckOut" class="checkout" href="#" @click.prevent="showCheckOutModal">{{$t('shop.footer.checkout_cta')}}</a>
        <div class="cart-total" @click.prevent="showCartModal">
<<<<<<< HEAD
        <p>{{total}} kr</p>
=======
<<<<<<< HEAD
        <p>{{total}} kr</p>
=======
        <p>{{Math.ceil(total)}} kr</p>
>>>>>>> 53858391016b546416d37122272897272e112997
>>>>>>> d9a5690b5a609590701e6f7f8f50eeabfb51de9f
        <p>{{$t('shop.footer.tax')}}</p>
        </div>
      </div>
      <CheckOutModal
        ref="CheckOutModal"
        @showCartModal="showCartModal"
      />
      <CartModal
        ref="CartModal"
        @showCheckOutModal="showCheckOutModal"
      />
    </div>
  </div>
</template>
<script>
import CheckOutModal from '~/components/Cart/CheckOutModal.vue'
import CartModal from '~/components/Cart/CartModal.vue'

export default {
  components: {
    CheckOutModal,
    CartModal
  },

  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      show_footer:true,
      cart_items:[],
      total:0,
      freight: this.$store.getters.shop.shipping_cost,
      discount: (this.$store.getters.user.discount) ? this.$store.getters.user.discount : 0,
      discount_value:0,
      to_url:'/',
      is_home_page:true,
      ableToCheckOut:true
    }
  },

  created () {
    this.updateTotal(this.cart_items)
    if (this.$route.path == '/') {
        this.is_home_page = true
    }
  },

  computed:{
    checkBlur() { return this.$store.getters.theme.blur },
    checkFooter() { return this.$store.getters.theme.show_footer },
    checkCart() { return this.$store.getters.broadcast },
    checkPath() { return this.$route.path },
  },

  watch: {
    checkBlur(newValue) {
      this.is_home_page = this.$store.getters.theme.is_home_page
    },
    checkFooter(newValue) {
      this.show_footer = this.$store.getters.theme.show_footer
    },
    checkPath(newValue) {
      if (newValue == '/') {
          this.is_home_page = true
      }
      else {
        this.is_home_page =false
      }
      this.to_url = newValue
    },
    checkCart(newValue) {
      this.cart_items = this.$store.getters.cart
      this.updateTotal(this.$store.getters.cart)

      this.ableToCheckOut = true

      for(var x in this.cart_items) {

        if (this.cart_items[x].quantity < this.cart_items[x].moq) {
          this.ableToCheckOut = false
        }

      }


    }
  },

  methods: {
    navigate() {
      if (this.to_url == '/menu') {
        this.$router.go(-1)
      }
      else {
        this.$router.push('/menu')
      }
    },
    showCheckOutModal () {
      this.$refs.CartModal.closeModal()
      this.$refs.CheckOutModal.showCheckOutModal()
      this.show_footer = false
    },
    showCartModal () {
      this.$refs.CheckOutModal.closeModal()
      this.$refs.CartModal.showCartModal()
      this.show_footer = false
    },
    updateTotal(cart) {

      this.total = 0
      this.discount_value = 0
      this.ableToCheckOut = true

      for(var x in cart) {
        this.total +=  parseFloat(cart[x].price * cart[x].quantity)

        if (cart[x].quantity < cart[x].moq) {
          this.ableToCheckOut = false
        }

      }

      if (this.total > 0 && this.discount > 0) {

        this.discount_value = parseFloat(this.total * (this.discount / 100 )).toFixed(2)
        this.total = this.total - this.discount_value

      }

      if (cart.length>0){

      let include_shipping  = false

      for(var x in cart) {

        if (cart[x].quantity > 0) {
          include_shipping = true
        }

      }

      if (include_shipping) {
      this.total += parseFloat(this.freight)
      }


      }
      this.total = parseFloat(this.total).toFixed(2)

    }
  }
}

</script>
<style lang="css">
  .checkout {
    width: 50% !important;
    margin: 0px !important;
    padding: 0px !important;
    text-align: center !important;
  }
  .app-footer__cart-elments {
    justify-content: space-between !important;
  }
</style>
