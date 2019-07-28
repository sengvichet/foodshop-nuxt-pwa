<template>
<div>
<div class="footer" v-if="show_footer"  v-bind:class="{ blur: is_blur }">

<!-- <a class="menu-icon" href="#" @click.prevent="navigate">
  <img class="menu-icon" src="~assets/images/iconMenuButton.svg" />
</a>

<nuxt-link v-if="!is_home_page" class="menu-back" to="/landing-page">
  <img src="~assets/images/iconBackButton.svg" />
</nuxt-link> -->


  <div v-if="cart_items.length>0" class="cart-elments">
    <a class="checkout" href="#" @click.prevent="showCheckOutModal">{{$t('shop.footer.checkout_cta')}}</a>
    <div class="cart-total" @click.prevent="showCartModal">
    <p>{{total}} kr</p>
    <p>{{$t('shop.footer.tax')}}</p>
    </div>
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
      show_footer:false,
      cart_items:[],
      total:0,
      to_url:'/',
      is_home_page:true
    }
  },

  created () {
    this.updateTotal(this.cart_items)
    if (this.$route.path == '/landing-page') {
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
      if (this.$store.getters.theme.show_footer) {
        this.show_footer = true;

      }
    },
    checkPath(newValue) {
      if (newValue == '/landing-page') {
          this.is_home_page = true
      }
      else {
        this.is_home_page =false
      }
      this.to_url = newValue
    },
    checkCart(newValue) {
      if (this.$store.getters.cart) {
        this.show_footer = true;
      } else {
        this.show_footer = false;
      }
      this.cart_items = this.$store.getters.cart
      this.updateTotal(this.$store.getters.cart)
    }
  },

  methods: {
    navigate() {
      if (this.$route.path === '/landing-page') {
        this.$router.push('/menu')
      }
      else {
        this.$router.push('/landing-page')
      }
    },
    showCheckOutModal () {
      this.$refs.CartModal.hideModal()
      this.$refs.CheckOutModal.showModal()
      this.show_footer = false
    },
    showCartModal () {
      this.$refs.CheckOutModal.hideModal()
      this.$refs.CartModal.showModal()
      this.show_footer = false
    },
    updateTotal(cart) {
      this.total = 0
      for (var x in cart) {
        this.total += (parseFloat(cart[x].price) * cart[x].quantity )
      }
      this.total = this.total + 65
    }
  }
}

</script>
<style scoped>
  .footer {

    height: 54px;
    background-color: #f1f0f0;
    width: 100%;
    position: fixed;
    bottom: 0px;
    text-align: center;
  }
  .footer .menu-icon {
    padding-top: 22px;

  }

  .footer .menu-back {
    position: absolute;
    left: 30px;
    top: 15px;
  }
  .footer .cart-elments {
    width: 310px;
    position: absolute;
    right: 0px;
    top: 0px;
    font-family: Poppins;
  }

  .footer .cart-elments a.checkout:link {
    width: 140px;
    background: #08bd4b;
    height: 54px;
    color: #fff !important;
    display: block;
    line-height: 54px;
    margin-top: 0px;

    font-weight: normal;
    float: left;
  }
  .footer .cart-elments a.checkout:visited{
    color: #fff;
  }
  .footer .cart-elments .cart-total:hover {
    cursor: pointer;
  }
  .footer .cart-elments .cart-total {
    width: 150px;
    height: 100%;
    float: right;
    text-align: right;
    padding-right: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-image: url('~assets/images/iconCartButton.svg');
    background-repeat: no-repeat;
    background-position: left;
    margin-left: 20px;
  }
  .footer .cart-elments .cart-total p:nth-child(1) {
    margin-bottom: 0px;
    font-size: 1.1em;

  }
  .footer .cart-elments .cart-total p:nth-child(2) {
    margin-bottom: 0px;
    font-size: .7em;
    margin-top: -5px;

  }
</style>
