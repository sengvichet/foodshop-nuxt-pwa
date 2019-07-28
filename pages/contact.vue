<template>
<div class="contact_margin">

  <div  v-bind:class="{ blur: is_blur }">
  <div class="list-bar list-bar__summary">

    <p class="list-bar__summary-center list-bar__summary-medium">{{contact_us_heading}}</p>
    <!--
    <p class="list-bar__summary-center list-bar__summary-large">{{$t('shop.contact.time')}}</p>
    <p class="list-bar__summary-center list-bar__summary-medium">{{$t('shop.contact.week_days')}}</p>
    -->
    <p class="list-bar__summary-center list-bar__summary-small">{{contact_us_phone}}</p>
    <p class="list-bar__summary-center list-bar__summary-small">{{contact_us_email}}</p>
    <p v-html="contact_us_address" class="list-bar__summary-center list-bar__summary-small"></p>

  </div>
  <div v-if="machine_service_is_active">
  <h3 class="center">{{machine_service_heading}}</h3>

  <button class="button-square" @click.prevent="showOrderServiceModal" >
    {{machine_service_button}}
  </button>
</div>

</div>


  <OrderServiceModal ref="OrderServiceModal" />

</div>
</template>

<script>

import OrderServiceModal from '~/components/Cart/OrderServiceModal.vue'
export default {
  components: {
    OrderServiceModal
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur }

  },
  watch: {
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
},
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      contact_us_heading : (this.$store.getters.shop.landing_page_settings.contact_us_heading) ? this.$store.getters.shop.landing_page_settings.contact_us_heading : '',
      contact_us_address : (this.$store.getters.shop.landing_page_settings.contact_us_address) ? this.$store.getters.shop.landing_page_settings.contact_us_address : '',
      contact_us_email : (this.$store.getters.shop.landing_page_settings.contact_us_email) ? this.$store.getters.shop.landing_page_settings.contact_us_email : '',
      contact_us_phone : (this.$store.getters.shop.landing_page_settings.contact_us_phone) ? this.$store.getters.shop.landing_page_settings.contact_us_phone : '',
      machine_service_is_active : (this.$store.getters.shop.machine_service_is_active) ? this.$store.getters.shop.machine_service_is_active : '',
      machine_service_heading : (this.$store.getters.shop.machine_service_heading) ? this.$store.getters.shop.machine_service_heading : '',
      machine_service_button : (this.$store.getters.shop.machine_service_button) ? this.$store.getters.shop.machine_service_button : ''
    }
  },
  created () {
    this.mixpanelTrack('Page View: Contact Page');
  },
methods: {
  showOrderServiceModal () {
    this.$refs.OrderServiceModal.showOrderServiceModal()
  }
}
}

</script>

<style >
 h3.center  {
   text-align: center;
   width: 100%;
   margin-top: 6rem;
   margin-bottom: 3rem;
 }
 .button-square {
    margin-right: auto ;
    margin-left: auto;
    height: 5rem;
    width: 70%;
    line-height: 2rem ;
    background: #07a742;
 }
</style>
