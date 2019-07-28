<template lang="html">
  <div v-if="!pageloading" class="landing-page" v-bind:class="{ blur: is_blur }">
    <section class="header">
      <div class="logo-container" v-bind:style="{ backgroundImage:  'url(' + shop_logo + ')' }">
        &nbsp;
      </div>
      <a
       href="#"
       v-if="cta_button_top_is_active"
       class="go-to-shop-link"
       @click="mixpanelTrack('Click: Go To Shop Top'); goTo('/shop/');"
       >{{cta_button_top_text}}</a>
      <br>
      <h1 class="heading">{{heading}}</h1>
    </section>

    <section v-if = "days_is_active" class="menu-section">
      <div class="menu-list">

          <div v-for="day, index in days" v-if="day.isOpen" class="menu-day">
            <h2 class="menu-day__heading">{{$t(`shop.days_of_the_week.${day.name}`)}}</h2>
            <div @click="expand(index)" class="menu-item-landingpage" :class="{ tallBox: showDescriptions[index] }">

              <h3 class="menu-item__heading">
                {{day.heading}}
              </h3>
              <p  class="menu-item__description">{{day.description}}</p>
              <h3 class="menu-item__heading">{{$t(`shop.allergens_noun`)}}</h3>
              <div class="menu-item__list">
                <span v-for="(allergen, index) in day.allergens" v-if="allergen.value" class= "menu-item__allergens">{{$t(`shop.allergens.${allergen.name}`)}}</span>
              </div>
            </div>
          </div>

        <div class="menu-day">
          <h2 class="menu-day__heading">{{extra_day.heading}}</h2>
          <div class="menu-item-landingpage" :class="{ tallBox: showDescriptions[0] }">
            <p v-html="extra_day.description"  class="menu-item__description"></p>
          </div>
        </div>
      </div>

    </section>


    <a
    href="#"
    v-if="cta_button_bottom_is_active"
    class="go-to-shop-link"
    @click.prevent="mixpanelTrack('Click: Go To Shop Bottom');goTo('/shop/')"
    >{{cta_button_bottom_text}}</a>


    <section class="about-us">

      <h1 class="heading">{{about_us_heading}}</h1>
      <p v-html="about_us_text" class="about-us__description"></p>

      <h1 class="heading">{{contact_us_heading}}</h1>
      <p class="about-us__description"><strong>{{contact_us_email}}</strong><br> {{contact_us_phone}}</p>
      <p v-html="contact_us_address" class="about-us__description"></p>
  
    </section>
    <section>
      <AddHomeScreen v-if="showInstallMessage"/>
    </section>
  </div>
</template>

<script>

  import {
    API
  } from "aws-amplify";

  import Product from '~/components/Products/Product.vue'
  import LandingPageFooter from '~/components/General/LandingPageFooter.vue'
  import AddHomeScreen from '~/components/General/AddHomeScreen.vue'
  export default {
    layout: 'landing-page',
    components: {
      Product,
      LandingPageFooter,
      AddHomeScreen
    },

    data(){
      return{
        xpos: 0,
        currentItem: 1,
        categories:[],
        products:[],
        products_list:[],
        total:0,
        pageloading:true,
        shop_id:this.$store.getters.shop.shop_id,
        is_blur:this.$store.getters.theme.blur,
        // showDescriptions: [],
        showExtradescription: true,
        days: [],
        heading: null,
        shop_logo: (this.$store.getters.shop.shop_logo) ? this.$store.getters.shop.shop_logo :'~assets/images/shop-logo.png',
        about_us_heading: null,
        about_us_text: null,
        contact_us_heading:null,
        contact_us_address: null,
        contact_us_email: null,
        contact_us_phone: null,
        extra_day: {},
        days_is_active:false,
        cta_button_top_text:null,
        cta_button_top_is_active:false,
        cta_button_bottom_text:null,
        cta_button_bottom_is_active:false,
        showInstallMessage: false
      }
    },

    beforeCreat()  {

    },

    async created() {

      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test( userAgent );
      }

      const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

      if (isIos() && !isInStandaloneMode()) {

        this.showInstallMessage = true;

        setTimeout(() => { this.showInstallMessage = false }, 10000)
      }

      this.mixpanelTrack('Page View: Landing Page');

      if (!this.$store.getters.shop.show_landing_page) {

        await this.$router.push('/shop/')
      }

        this.days = (this.$store.getters.shop.landing_page_settings.days) ? this.$store.getters.shop.landing_page_settings.days : []
        this.heading = (this.$store.getters.shop.landing_page_settings.heading) ? this.$store.getters.shop.landing_page_settings.heading : ''
        this.about_us_heading = (this.$store.getters.shop.landing_page_settings.about_us_heading) ? this.$store.getters.shop.landing_page_settings.about_us_heading : ''
        this.about_us_text = (this.$store.getters.shop.landing_page_settings.about_us_text) ? this.$store.getters.shop.landing_page_settings.about_us_text : ''
        this.contact_us_heading = (this.$store.getters.shop.landing_page_settings.contact_us_heading) ? this.$store.getters.shop.landing_page_settings.contact_us_heading : ''
        this.contact_us_address = (this.$store.getters.shop.landing_page_settings.contact_us_address) ? this.$store.getters.shop.landing_page_settings.contact_us_address : ''
        this.contact_us_email = (this.$store.getters.shop.landing_page_settings.contact_us_email) ? this.$store.getters.shop.landing_page_settings.contact_us_email : ''
        this.contact_us_phone = (this.$store.getters.shop.landing_page_settings.contact_us_phone) ? this.$store.getters.shop.landing_page_settings.contact_us_phone : ''
        this.extra_day = (this.$store.getters.shop.landing_page_settings.extra_day) ? this.$store.getters.shop.landing_page_settings.extra_day : {}
        this.days_is_active = (this.$store.getters.shop.landing_page_settings.days_is_active) ? this.$store.getters.shop.landing_page_settings.days_is_active : false
        this.cta_button_top_text = (this.$store.getters.shop.landing_page_settings.cta_button_top_text) ? this.$store.getters.shop.landing_page_settings.cta_button_top_text : ''
        this.cta_button_top_is_active = (this.$store.getters.shop.landing_page_settings.cta_button_top_is_active) ? this.$store.getters.shop.landing_page_settings.cta_button_top_is_active : false
        this.cta_button_bottom_text = (this.$store.getters.shop.landing_page_settings.cta_button_bottom_text) ? this.$store.getters.shop.landing_page_settings.cta_button_bottom_text : ''
        this.cta_button_bottom_is_active = (this.$store.getters.shop.landing_page_settings.cta_button_bottom_is_active) ? this.$store.getters.shop.landing_page_settings.cta_button_bottom_is_active : false


      // if (window.innerWidth > 620){
      //   this.showExtradescription = false;
      // }

      try {


        await this.listCategories();
        await this.listProducts();




      } catch (e) {
        bugsnagClient.notify(e)
        this.$notify.error(e.message, 'success')
      }

    },
  
    computed:{
    checkBlur() { return this.$store.getters.theme.blur },
    showDescriptions(){
      var showDescriptions = [];
      for(let i = 0; i < this.days.length; i++){
        if (window.innerWidth > 620){
          showDescriptions.push(true);
        } else {
          showDescriptions.push(false);
        }
      }
      return showDescriptions;
    },
    moveX(){
      return `transform: translateX(${this.xpos}px)`
    },
    },
    watch: {

    checkBlur(newValue) {
      this.is_blur = this.$store.getters.theme.blur

    }
    },

    methods: {
      goTo (path) {
        this.$router.push(path)
      },
      expand(index){
        this.showDescriptions[index] == true ? this.showDescriptions[index] = false : this.showDescriptions[index] = true;
        console.log('expand', index);
        console.log(this.showDescriptions);
      },

      async listCategories () {

       this.categories = []

      await API.get("metamat", "/cart/categories/"+this.shop_id).then((categories) => {

         this.categories = categories
         for (var x in this.categories ){
           this.categories[x].is_bold = false
         }
         this.pageloading = false

       })

     },
     async listProducts () {

       this.products = []

       await API.get("metamat", "/cart/products/"+this.shop_id).then((products) => {

         this.products_list = products

       }).then(()=>{
         this.setProducts(1)

         this.pageloading = false
       })

     },
     updateTotal() {

       let cart = this.$store.getters.cart
       this.total = 0

       for (var x in cart) {

         this.total += (parseFloat(cart[x].price) * cart[x].quantity )

       }

     },
      decrement(){

        if(this.currentItem < this.categories.length-1){
          this.xpos -= 140;
          this.currentItem++;
          this.setProducts(this.currentItem)

        }
      },
      increment(){

        if(this.currentItem > 0){
        this.xpos += 140;
        this.currentItem--;
        this.setProducts(this.currentItem)

        }
      },
      setProducts(category_index) {

        if (this.categories[category_index]){
        this.pageloading = true

        let category_id = this.categories[category_index].objectId

        for (var x in this.categories ){
          this.categories[x].is_bold = false
        }
        this.categories[category_index].is_bold = true

        this.products = []
        for (var x in this.products_list) {

          if (this.products_list[x].objectCategory == category_id) {
            this.products.push(this.products_list[x])
          }
        }
      }
      }
    }
  }
</script>
<style lang="css">
:root {
  --main-font-color: #BA5F29;
  --secondary-font-color: #456363;
  --main-background-color: #FFFBF8;
}
body {
  box-sizing: border-box;
  background-color: var(--main-background-color);
}
.landing-page {
  background-color: var(--main-background-color);
}
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo-container{
  margin: 35px 0;
  width: 250px;
  height: 102px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.heading {
  color: var(--main-font-color);
  font-weight: normal;
  font-size: 50px;
  text-align: center;
}
.menu-section {
  padding: 35px 0;
}
.shop-display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  background-color: white;
}
.menu-list {
  max-width: 620px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 10px auto;
}
.menu-day {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 290px;
  margin: 20px 10px;
}
.menu-day__heading {
  color: var(--main-font-color);
  font-weight: 600;
  font-size: 16px;
}
.menu-item-landingpage {
  background-color: white;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  padding: 20px;
  width: 100%;
  min-height: 100px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.tallBox {
  min-height: 230px
}
.menu-item__heading{
  color: var(--main-font-color);
  font-weight: bold;
  font-size: 16px;
  margin: 15px 0;
}
.menu-item__description{
  color: var(--main-font-color);
  font-weight: 300;
  font-size: 16px;
  text-align: center;
  min-height: 6rem;
}
.menu-item__list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap:wrap;
}
.menu-item__allergens {
  color: var(--main-font-color);
  font-size: 16px;
  display: flex;
  margin: 0 3px;
}
.shop-section-heading {
  color: var(--secondary-font-color);
  font-size: 40px;
  text-align: center;
  margin-bottom: 40px;
}
.container {
  text-align: center;
}
.nav-carousel {
  display: inline-block;
  position: relative;
  margin-bottom: 5px;
  margin-left: auto;
  margin-right: auto;
}
.nav-ui {
  z-index: 100000000;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  position: absolute;
}
.bold {
  font-weight: bold !important;
}

.product-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.go-to-shop-link,
.go-to-shop-link:visited {
  color: white;
  background-color: var(--main-font-color);
  font-size: 30px;
  text-align: center;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  max-width: 300px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.about-us {
  max-width: 620px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 10px auto;
  max-width: 590px;
  padding: 50px 20px;
}
.about-us__description {
  text-align: center;
  color: var(--main-font-color);
  margin: 10px 0;
  white-space: pre-wrap;
}
</style>
