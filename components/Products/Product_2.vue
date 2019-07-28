<template>

  <b-col v-if="!isLoading" lg="5" md="12"  class="product ml-auto mr-auto">
    <div class="image">
      <img :src="product_image_prop" />
    </div>
    <div class="product__text-box">
      <div>
        <h5>{{product_name_prop}}</h5>
        <p>{{product_desc_prop}}</p>
      </div>
      <div class="quantity-price">
        <div class="quantity">
          <MinusPlusField :id="product_id_prop" :value="current_quantity" @updateValue="updateValue" />
        </div>
        <div class="price">
          <p>{{product_price_prop}} kr <span>per stykk</span></p>
        </div>
      </div>
    </div>
  </b-col>

</template>
<script>

import MinusPlusField from '~/components/General/MinusPlusField.vue'

export default {

  components: {
    MinusPlusField
  },
  props : {
    product_id_prop: {
      type: String,
      required: true
    },
    product_name_prop: {
      type: String,
      required: true
    },
    product_desc_prop: {
      type: String,
      required: true
    },
    product_price_prop: {
      type: String,
      required: true
    },
    product_image_prop: {
      type: String,
      required: true
    },
    product_category_prop: {
      type: String,
      required: true
    }

  },
  data () {

    return {
      current_quantity:0,
      product_item: {},
      isLoading:false

    }
  },
  created() {


      this.isLoading = true

      for(var x in this.$store.getters.cart) {
        if (this.$store.getters.cart[x].id == this.product_id_prop){
          this.current_quantity = this.$store.getters.cart[x].quantity
        }
      }

      this.isLoading = false

  },
  computed:{
  checkCart() { return this.$store.getters.broadcast }
},
watch: {

  checkCart(newValue) {

    for(var x in this.$store.getters.cart) {
      if (this.$store.getters.cart[x].id == this.product_id_prop){
        this.current_quantity = this.$store.getters.cart[x].quantity
      }
    }

  }
},
  methods:{
    updateValue (product_id,quantity) {

        this.isLoading = true
        this.current_quantity = quantity
        let cart = this.$store.getters.cart


        let index = -1 ;

        index =   cart.findIndex(x => x.id == product_id);

        if (index >= 0 ){
          cart[index] = {
            name: this.product_name_prop,
            price: this.product_price_prop,
            id: this.product_id_prop,
            quantity:quantity
          }

        }

        else {
          cart.push({
            name: this.product_name_prop,
            price: this.product_price_prop,
            id: this.product_id_prop,
            quantity:quantity
          })
        }

         this.$nextTick(function () {
         this.$store.dispatch('setCart',cart)
         this.$store.dispatch('setBroadcast',Math.floor(Math.random() * 1000000000))

      })

        this.$emit('updateTotal')


        this.isLoading = false



    }
  }
}
</script>
