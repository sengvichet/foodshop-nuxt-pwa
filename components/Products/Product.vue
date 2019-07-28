<template>

  <div class="list-bar list-bar__product">
    <div class="list-bar__product-image" :style="{'background-image': 'url(' + product_image_prop + ')' }">

      <div class="list-bar__inputs">
        <MinusPlusField v-if="show_inputs_prop" :id="product_id_prop" :value="current_quantity" @updateValue="updateValue" />
      </div>
      <span v-if="current_quantity < product_minimum_order_quantity_prop && current_quantity > 0" class="list-bar__product-moq">{{$t('shop.products.moq')}} {{product_minimum_order_quantity_prop}}</span>
    </div>

    <div class="list-bar__product-text">
      <div class="list-bar__product-heading-and-edit">
        <h5 class="list-bar__product-title">{{product_name_prop}}</h5>
      </div>
      <p class="list-bar__product-description">{{product_desc_prop}}</p>
      <p class="list-bar__price">{{Math.ceil(product_price_prop)}} kr <span>per stykk</span></p>

    </div>
  </div>

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
      product_minimum_order_quantity_prop : {
        type:String,
        required:true
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
      },
      show_inputs_prop: {
        type: Boolean,
        required: false,
        default: true
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
              moq:this.product_minimum_order_quantity_prop,
              id: this.product_id_prop,
              quantity:quantity
            }

          }

          else {
            cart.push({
              name: this.product_name_prop,
              price: this.product_price_prop,
              moq:this.product_minimum_order_quantity_prop,
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
