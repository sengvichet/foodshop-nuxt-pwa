<template lang="html">
  <div class="landing-page" v-bind:class="{ blur: is_blur }">
    <section class="header">
      <div class="logo-container">
        &nbsp;
      </div>
      <h1 class="heading">Denne ukas meny i KA53</h1>
    </section>

    <section class="menu-section">
      <div class="menu-list">
        <div v-for="day in days" v-if="day.isOpen" class="menu-day">
          <h2 v-if="!showDescriptions" class="menu-day__heading">{{$t(`shop.days_of_the_week.${day.name}`)}}</h2>
          <div class="menu-item-landingpage" :class="{ tallBox: showDescriptions }">
            <h2 v-if="showDescriptions" class="menu-day__heading">{{$t(`shop.days_of_the_week.${day.name}`)}}</h2>
            <h3 class="menu-item__heading">
              {{day.heading}}
            </h3>
            <p v-if="showDescriptions" class="menu-item__description">{{day.description}}</p>
            <h3 v-if="showDescriptions" class="menu-item__heading">{{$t(`shop.allergens_noun`)}}</h3>
            <span v-if="showDescriptions">
              <p v-for="(allergen, index) in day.allergens" v-if="allergen.value" class= "menu-item__allergens">{{$t(`shop.allergens.${allergen.name}`)}}</p>
            </span>

          </div>
        </div>
        <div class="menu-day">
          <h2 v-if="!showDescriptions" class="menu-day__heading">Hver dag tilbyr vi også</h2>
          <div class="menu-item-landingpage" :class="{ tallBox: showDescriptions }">
            <h2 v-if="showDescriptions" class="menu-day__heading">Hver dag tilbyr vi også</h2>
            <h3 class="menu-item__heading">
              Varm suppe, rik salatbar, fersk brød, pålegg og kalde og varme drikker.
            </h3>
            <p v-if="showDescriptions" class="menu-item__description">For spørsmål om allergener spør oss :)<br>Smakelig måltid!</p>
          </div>
        </div>
      </div>
    </section>

    <section class="shop-display">
      <h1 class="shop-section-heading">Bestill catering til ditt møterom</h1>
      <div class="nav-carousel">
        <div class="list-window">
          <div class="nav-ui">
            <div class="increment-button" @click="increment"></div>
            <div class="decrement-button" @click="decrement"></div>
          </div>
          <div class="list" :style="moveX">
            <h1  v-for="(category,index) in categories" :id="category.objectName" class="listitem" v-bind:class="{ bold: category.is_bold }"> {{ category.objectName }} </h1>
          </div>
        </div>
      </div>

      <div class="product-container">
        <Product
          v-for="(product,index) in products"
          :key="product.objectId"
          :product_id_prop="product.objectId"
          :product_name_prop="product.objectName"
          :product_desc_prop="product.objectDesc"
          :product_price_prop="product.objectPrice"
          :product_image_prop="product.objectImage"
          :product_category_prop="product.objectCategory"
          :show_inputs_prop="false"
          @updateTotal="updateTotal"
        />
      </div>
      <!-- link this directly to treats for now -->
      <a class="go-to-shop-link" href="#">Gå til butikken</a>

    </section>

    <section class="about-us">
      <h1 class="heading">Om oss</h1>
      <p class="about-us__description">Vi er en glad gjeng som lager mat for gjestene i vår kantine i Karenslyst Allé 53 på Skøyen i Oslo.</p>
      <p class="about-us__description">Catering til møterom er kun tilgjengelig for husets leietakere. Bestilling skjer via resepsjonist eller kontorsjef.</p>
      <p class="about-us__description">For eksterne catering henvendelser, ta kontakt med oss: </p>
      <p class="about-us__description"><strong>ka53@treats.no </strong><br> +47 22 06 00 68 </p>
      <p class="about-us__description">
        Treats As <br>
        Org. 915 684 742 <br>
        Karenslyst Allé 53 <br>
        0279 Oslo
      </p>


    </section>
  </div>
</template>

<script>

  import {
    API
  } from "aws-amplify";

  import Product from '~/components/Products/Product.vue'
  import LandingPageFooter from '~/components/General/LandingPageFooter.vue'

  export default {
    layout: 'landing-page',
    components: {
      Product,
      LandingPageFooter
    },

    data(){
      return{
        xpos: 0,
        currentItem: 1,
        categories:[],
        products:[],
        products_list:[],
        total:0,
        pageloading:false,
        shop_id:this.$store.getters.shop.shop_id,
        is_blur:this.$store.getters.theme.blur,
        showDescriptions: false,
        days: [
          {
            name: 'mon',
            isOpen: true,
            heading: 'Pizza plate',
            description: 'Epic pizza. With turtles.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'tue',
            isOpen: true,
            heading: 'Tasty food with delicious accessories',
            description: 'Gloriously good soup. With fish or something',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'wed',
            isOpen: true,
            heading: 'Tangerine tofu',
            description: 'Like orange flavoured steak. But with tofu.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'thu',
            isOpen: true,
            heading: 'Cooked catfish',
            description: 'The fishy version of a cat. Cooked.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'fri',
            isOpen: true,
            heading: 'Cheese hamberders',
            description: 'Cheesy hamberder. Mmmmm cheeeeese.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'sat',
            isOpen: false,
            heading: 'Tasty food with delicious accessories',
            description: 'Frosting is a fluffy, thick concoction that will hold its shape. You can pipe decorations with it like you see on cakes.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          },
          {
            name: 'sun',
            isOpen: false,
            heading: 'Tasty food with delicious accessories',
            description: 'Frosting is a fluffy, thick concoction that will hold its shape. You can pipe decorations with it like you see on cakes.',
            allergens: [
              {name: 'soy', value: false},
              {name: 'gluten', value: false},
              {name: 'milk', value: false},
              {name: 'peanuts', value: false},
              {name: 'eggs', value: false},
              {name: 'fish', value: false},
              {name: 'nuts', value: false},
              {name: 'shellfish', value: false},
              {name: 'celery', value: false},
              {name: 'mustard', value: false},
              {name: 'sesamy_seeds', value: false},
              {name: 'sulfites', value: false},
              {name: 'invertebrates', value: false},
            ]
          }
        ],
      }
    },

    async created() {
      if (window.innerWidth > 620){
        this.showDescriptions = true;
      }
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

<style lang="css" scoped>
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
    background-image: url('~assets/images/TreatsLogo.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .heading {
    color: var(--main-font-color);
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
    font-weight: 400;
    font-size: 16px;
    margin: 15px 0;
  }

  .menu-item__description{
    color: var(--main-font-color);
    font-weight: 300;
    font-size: 16px;
    text-align: center;
  }

  .menu-item__allergens {
    color: var(--main-font-color);
    font-weight: 300;
    font-size: 16px;
    display: inline;
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
  .list-window {
    position: relative;
    width: 450px;
    vertical-align: middle;
    overflow-x: hidden;
  }
  .list {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    align-self: center;
    transition: all .5s;
  }

  .increment-button {
    width: 140px;
    background-color: rgba(255,255,255,0);
  }
  .decrement-button {
    width: 140px;
    background-color: rgba(255,255,255,0);
  }

  .listitem {
    display: inline-block;
    flex-shrink: 0;
    flex-grow: 0;
    flex-basis: 150px;
    padding: 3px 5px;
    text-align: center;
    margin: 0;
    margin-bottom: 0 !important;
    font-size: 1.1em !important;
    /* font-family: 'Poppins' sans-serif;
    font-weight: 200; */
    word-break: normal;
    hyphens: auto;
  }

  .product-container {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .go-to-shop-link,
  .go-to-shop-link:visited {
    text-align: center;
    color: var(--secondary-font-color);
    margin: 10px 0;
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
    padding: 50px 0;
  }

  .about-us__description {
    text-align: center;
    color: var(--main-font-color);
    margin: 10px 0;
  }
</style>
