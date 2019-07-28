<template>
<b-container>

  <b-tabs class="nav-center"  v-bind:class="{ blur: is_blur }">

  <b-tab
  v-if = "!pageloading"
  v-for="(category,index) in categories"
  :title="category.objectName">
    <b-container>
      <b-row>
      <Product
            v-if = "category.objectId == product.objectCategory && !pageloading"
            v-for="(product,index) in products"
            :key="product.objectId"
            :product_id_prop="product.objectId"
            :product_name_prop="product.objectName"
            :product_desc_prop="product.objectDesc"
            :product_price_prop="product.objectPrice"
            :product_image_prop="product.objectImage"
            :product_category_prop="product.objectCategory"
            @updateTotal="updateTotal"
        />
      </b-row>
  </b-container>

  </b-tab>

</b-tabs>

</b-container>
</template>
<script>
import {
  API
} from "aws-amplify";

import Product from '~/components/Products/Product.vue'

export default {

  components: {
    Product
  },

  data() {
    return {
      categories:[],
      products:[],
      total:0,
      pageloading:false,
      shop_id:this.$store.getters.shop.shop_id,
      is_blur:this.$store.getters.theme.blur
    }
  },

  async created() {

    try {

      this.pageloading = true
      await this.listCategories();
      await this.listProducts();

    } catch (e) {
      this.$notify.error(e.message, 'success')
    }

  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur },
  },
  watch: {

  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
    
  }
  },
  methods : {

     listCategories () {

      this.categories = []

     API.get("metamat", "/cart/categories/"+this.shop_id).then((categories) => {

        this.categories = categories
        this.pageloading = false

      })

    },
    listProducts () {

      this.products = []

      API.get("metamat", "/cart/products/"+this.shop_id).then((products) => {

        this.products = products
        this.pageloading = false

      })

    },
    updateTotal() {

      let cart = this.$store.getters.cart
      this.total = 0

      for (var x in cart) {

        this.total += (parseFloat(cart[x].price) * cart[x].quantity )

      }

    }

  }

}
</script>
