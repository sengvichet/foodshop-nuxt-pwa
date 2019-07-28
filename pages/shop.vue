<template lang="html">
  <div>

    <div v-if="pageloading" class="app-ui-overlay__centered-column">
        <LoadingAnimation/>
      </div>
    
  <div v-if="!pageloading" class="nav-carousel-custom">

    <carousel :perPage="1" :adjustableHeight="true" :navigationEnabled="true" :pagination-enabled="false" 
              :navigationNextLabel="'>'" :navigationPrevLabel="'<'" :centerMode="true" ref="carousel" 
              @navigation-click="SlideCarousel" @page-change="PageUpdate">

      <slide v-for="category in categories_list" :id="category.objectName">
        <h1 :id="category.objectName" class="listitem" v-bind:class="{ bold: category.is_bold }">{{ category.objectName }}</h1>
      </slide>
    </carousel>

    <!-- prev dev's work -->
    <!-- <div class="list-window">
      <div class="nav-ui">
        <div class="increment-button" @click="increment">
          <span> < </span>
        </div>
        <div class="decrement-button" @click="decrement">
          <span> > </span>
        </div>
      </div>
      <div class="list" :style="moveX">
        <h1  v-for="(category,index) in categories_list"  :id="category.objectName" class="listitem" v-bind:class="{ bold: category.is_bold }"> {{ category.objectName }}</h1>
      </div>
    </div> -->
  </div>

  <div v-if="!pageloading" class="list-bar__container">
    <Product
        v-for="(product,index) in products"
        :key="product.objectId"
        :product_id_prop="product.objectId"
        :product_name_prop="product.objectName"
        :product_desc_prop="product.objectDesc"
        :product_price_prop="product.objectPrice"
        :product_image_prop="product.objectImage"
        :product_category_prop="product.objectCategory"
        :product_minimum_order_quantity_prop="product.objectMinimumOrderQuantity"
        @updateTotal="updateTotal"
    />
  </div>
  <section>
    <AddHomeScreen v-if="showInstallMessage"/>
  </section>
</div>
</template>
<script>

import {
  API
} from "aws-amplify";
import LoadingAnimation from '~/components/General/LoadingAnimation.vue'
import Product from '~/components/Products/Product.vue'
import { Carousel, Slide } from 'vue-carousel'
import AddHomeScreen from '~/components/General/AddHomeScreen.vue'
export default {
  components: {
    Product,
    LoadingAnimation,
    Carousel,
    Slide,
    AddHomeScreen
  },
  layout:'wide',
  data(){
    return{
        xpos: 0,
        currentItem: -1,
        categories:[],
        categories_list:[],
        products:[],
        products_list:[],
        total:0,
        pageloading:true,
        shop_id:this.$store.getters.shop.shop_id,
        showInstallMessage: false
    }
  },

  async created() {

    if (!this.$store.getters.shop.show_landing_page) {

        const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test( userAgent );
      }

      const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

      if (isIos() && !isInStandaloneMode()) {

        this.showInstallMessage = true;

        setTimeout(() => { this.showInstallMessage = false }, 10000)
      }
    }

    try {
      this.mixpanelTrack('Page View: Main Shop Page');
      await this.listCategories();
      await this.listProducts();

    } catch (e) {
      bugsnagClient.notify(e)
      this.$notify.error(e.message, 'success')
    }
    
    //init product list
    let category_id = this.categories_list[0].objectId

    for (var x in this.categories_list ){
      this.categories_list[x].is_bold = false
    }
    this.categories_list[0].is_bold = true

    this.products = []
    for (var x in this.products_list) {

      if (this.products_list[x].objectCategory == category_id) {
        this.products.push(this.products_list[x])
      }
    }
  },
  computed:{
    moveX(){
      return `transform: translateX(${this.xpos}px)`
    }
    
  },
  methods: {
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

     }).then(async ()=>{

      for (var x in this.categories ){
        this.categories[x].products_count  = 0
        for (var y in this.products_list) {

          if (this.products_list[y].objectCategory == this.categories[x].objectId) {
            this.categories[x].products_count ++
          }
        }
        if (this.categories[x].products_count > 0 ) {
          this.categories_list.push(this.categories[x])
        }
      }

      if (this.categories_list.length > 0) {
        if (this.categories_list.length  == 1 ) {
          await this.increment()
        }
        else {
          await this.increment()
          await this.decrement()
        }
      }

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

      this.mixpanelTrack('Prev Category: Shop Page')

      if(this.currentItem < this.categories_list.length-1){
        this.xpos -= 130;
        this.currentItem++;
        this.setProducts(this.currentItem)
        this.pageloading = false

      }
      console.log(this.products);
    },
    increment(){
      this.mixpanelTrack('Next Category: Shop Page')
      if(this.currentItem > 0){

      this.xpos += 130;
      this.currentItem--;
      this.setProducts(this.currentItem)
      this.pageloading = false

      }
      console.log(this.products);
    },
    setProducts(category_index) {

      if (this.categories_list[category_index]){
        this.pageloading = true

        let category_id = this.categories_list[category_index].objectId

        for (var x in this.categories_list ){
          this.categories_list[x].is_bold = false
        }
        this.categories_list[category_index].is_bold = true

        this.products = []
        for (var x in this.products_list) {

          if (this.products_list[x].objectCategory == category_id) {
            this.products.push(this.products_list[x])
          }
        }
      }
    },
    SlideCarousel(data) {

      if (data == 'forward') {
        this.decrement()
      } else {
        this.increment()
      }
    },
    PageUpdate(page) {
      this.setProducts(page)
      this.pageloading = false
    }
  }
}
</script>
<style lang="css">
body {
  box-sizing: border-box;
}

.container {
  text-align: center;
}
.nav-carousel {
  display: flex !important;
  position: relative;
  margin-bottom: 5px;

  justify-content:center;
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
.list-window {
  position: relative;
  width: 550px;
  vertical-align: middle;
  overflow-x: hidden;
}
.list {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;
  align-self: center;
  transition: all .5s;

}

.increment-button {
  width: 170px;
  background: rgb(255,251,248);
  background: linear-gradient(90deg, rgba(255,251,248,1) 0%, rgba(255,251,248,1) 20%, rgba(255,251,248,0) 100%);
  font-size: 22px;
}
.decrement-button {
  width: 170px;
  background: rgb(255,251,248);
  background: linear-gradient(90deg, rgba(255,251,248,0) 0%, rgba(255,251,248,1) 80%, rgba(255,251,248,1) 100%);
  font-size: 22px;
}
.increment-button span , .decrement-button span {
  display:block;
  width: 30px;
  font-weight: bold;
  height: 100%;
}

.increment-button:hover , .decrement-button:hover{
  cursor: pointer;
}

.decrement-button span  {

  float: right;
  text-align: right;

}

.listitem {
  display: inline-block;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 140px;
  padding: 3px 10px;
  text-align: center;
  margin: 0;
  margin-bottom: 0 !important;
  font-size: 1.1em !important;
  /* font-family: 'Poppins' sans-serif;*/
  font-weight: 200;
  word-break: normal;
  hyphens: auto;
}

.product-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

/* #container {
  padding: 0 60px;
} */
.nav-carousel-custom {
  width: 85%;
  margin: auto;
  margin-bottom: 20px;
}

.VueCarousel-slide {
  text-align: center;
}

.label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.VueCarousel-navigation-button {
  font-size: 22px;
  font-weight: 700;
  font-family: Poppins,sans-serif !important;
}

.add-home-content {
  z-index: 99;
  margin-left: -15px;
  margin-bottom: 6rem;
}
</style>
