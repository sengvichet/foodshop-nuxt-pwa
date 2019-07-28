<template>
<div>
  <div class="app-ui-overlay app-ui-overlay__wide" >
    <Header/>
    <div class="app-ui-overlay__content">
        <nuxt/>
    </div>
  </div>
  <Footer/>

</div>
</template>

<script>
import Header from '~/components/General/Header.vue'
import Footer from '~/components/General/Footer.vue'
export default {
  middleware: "init",
  components: {
    Header,
    Footer
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
      //  {name:'apple-mobile-web-app-status-bar-style',content:'white'}
     ],
     link: [
        //{rel: 'manifest', href: 'https://cdn.kompis.app/public/manifest/manifest-'+this.shop_id+'.json',crossorigin:"use-credentials" }
        {rel: 'shortcut icon', href: this.shop_icon },
        {rel: 'apple-touch-icon', href: this.shop_icon }
      ]
   }
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur }
  },
  watch: {
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
  }
}
</script>

<style src="assets/css/new-app-styles.css"></style>
