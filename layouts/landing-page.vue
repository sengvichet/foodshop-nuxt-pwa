<template>
  <div class="">
    <nuxt/>
    <LandingPageFooter/>
  </div>
</template>

<script>
import Header from '~/components/General/Header.vue'
import LandingPageFooter from '~/components/General/LandingPageFooter.vue'
export default {
  middleware: "init",
  components: {
    Header,
    LandingPageFooter
  },
  data () {
    return {
      is_blur:this.$store.getters.theme.blur,
      shop_id:this.$store.getters.shop.shop_id,
      shop_name:this.$store.getters.shop.shop_name,
      shop_icon:this.$store.getters.shop.shop_icon,
    }
  },
  head () {
   return {
     title: this.shop_name,
     meta:[
       {name:'apple-mobile-web-app-title',content:this.shop_name},
      //  {name:'apple-mobile-web-app-status-bar-style',content:'black'}
     ],
     link: [
        //{rel: 'manifest', href: 'https://cdn.kompis.app/public/manifest/manifest-'+this.shop_id+'.json',crossorigin:"use-credentials" }
        {rel: 'shortcut icon', href: 'https://cdn.kompis.app/public/1559919117387-cc3c44b0-8933-11e9-a36f-c757cca65d08.png' },
        {rel: 'apple-touch-icon', href: 'https://cdn.kompis.app/public/1559919117387-cc3c44b0-8933-11e9-a36f-c757cca65d08.png' }
      ]
   }
  },
}
</script>

<style src="assets/css/new-app-styles.css"></style>
