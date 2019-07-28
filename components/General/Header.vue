<template>
  <div class="header"  v-bind:class="{ blur: is_blur }">
    <div class="header__logo">
    <nuxt-link v-if="!shop_logo" to="/"><img class="header__logo-image" src = "~assets/images/shop-logo.png"  /></nuxt-link>
    <nuxt-link v-if="shop_logo" to="/"><img class="header__logo-image" :src = "shop_logo"  /></nuxt-link>

  </div>
</div>
</template>



<script>

export default {

  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      shop_logo: this.$store.getters.shop.shop_logo
    }
  },

  computed:{
  checkBlur() { return this.$store.getters.theme.blur },
  },
  watch: {
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur

  }
  }

}

</script>
