<template>

    <div class="list-bar cart-item">
      <div class="cart-item__title">
      <h5 class="list-bar__title">{{name}}</h5>
      <p v-if="quantity<moq" class="product__moq">{{$t('shop.products.moq')}} {{moq}}</p>
    </div>
    <div class="cart-item__details">
      <MinusPlusField :value="quantity" :id="product_id" @updateValue="updateValue" />
      <a  href="#" @click.prevent="deleteCartItem" >
        <img class="cart-item__details--delete"  src ="~assets/images/button-round-delete.svg"  />
      </a>
      <h5 class="cartItem__sum-and-edit__total">{{Math.ceil(parseFloat(total).toFixed(2))}}&nbsp;kr</h5>
    </div>
    </div>


</template>

<script>

import MinusPlusField from '~/components/General/MinusPlusField.vue'


export default {

  components: {
    MinusPlusField
  },
  props:{
    id_prop: {
      type:String,
      required:true
    },
    name_prop: {
      type:String,
      required:true
    },
    moq_prop: {
      type:String,
      required:true
    },
    price_prop: {
      type:String,
      required:true
    },
    quantity_prop: {
      type:Number,
      required:true
    },
    total_prop: {
      type:Number,
      required:true
    }
  },
  data () {
    return {
      product_id:this.id_prop,
      name:this.name_prop,
      moq:this.moq_prop,
      price:this.price_prop,
      total: this.total_prop,
      quantity:this.quantity_prop,
      product_item: {}
    }
  },
  created() {

    this.product_item = {
      name: this.name,
      price: this.price,
      moq: this.moq,
      id: this.product_id,
      total:this.total,
      quantity:this.quantity
    }
  },
  methods:{
    deleteCartItem() {


      let cart = this.$store.getters.cart
      this.$nextTick(function () {

        for(var x in cart) {
          if (cart[x].id == this.product_id){
            cart.splice(x, 1);
          }
        }

        this.$store.dispatch('setCart',cart)
        this.$store.dispatch('setBroadcast',Math.floor(Math.random() * 1000000000))
        this.$emit('reload')

      })
    },
    updateValue(product_id,quantity) {

      this.$nextTick(function () {
        this.quantity = quantity
        this.total =  this.price * quantity
        this.total = parseFloat(this.total).toFixed(2)

        this.product_item = Object.assign({}, this.product_item, {
          name: this.name,
          price: this.price,
          total:this.price * quantity,
          id: this.product_id,
          quantity:quantity
        })

        let cart = this.$store.getters.cart

        let index = -1 ;

        index =   cart.findIndex(x => x.id == product_id);


        cart[index] = this.product_item


        this.$store.dispatch('setCart',cart)
        this.$store.dispatch('setBroadcast',Math.floor(Math.random() * 1000000000))
        this.$emit('reload')


      })


    }
  }
}
</script>
<style>
.product__moq {
  font-size: 11px;
  color: red;
  margin-top: 0px;
}
</style>
