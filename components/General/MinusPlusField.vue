<template>
<div class="minusplusnumber">
    <div class="mpbtn mpbtn--minus" v-on:click="mpminus()">
        -
    </div>

    <div id="field_container">
        <input type="number" v-model="value" @input="update"  />
    </div>

    <div class="mpbtn mpbtn--plus" v-on:click="mpplus()">
        +
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import Notify from 'vue2-notify'

export default {
  props: {
      value: {
          default: 0
      },
      min: {
          default: 0,
          type: Number
      },
      max: {
          default: 10000,
          type: Number
      },
      id: {
        type: String
      }

  },
  methods: {
      mpplus: function() {
          if(window.navigator.onLine == false) {
            Vue.$notify('Please connect to internet to perform this action .', 'error');
            return;
          }
          if(this.max == undefined || (this.value < this.max)) {
              this.value = parseInt(this.value) + 1;

              this.$emit('updateValue',this.id,this.value)
              this.mixpanelTrack('Increment Quantity: Shop Page',{
                'Product ID':this.id,
                'Quantity':this.value
              })

          }
      },
      mpminus: function() {
          
          if((this.value) > this.min) {
              this.value = parseInt(this.value) - 1;

              this.$emit('updateValue',this.id,this.value)
              this.mixpanelTrack('Decrement Quantity: Shop Page',{
                'Product ID':this.id,
                'Quantity':this.value
              })

          }
      },

      update({ type, target }) {
        this.value = target.value
        this.$emit('updateValue',this.id,target.value)
      }


  },
  watch: {
      value: {
          handler: function (newVal, oldVal) {
            if (newVal < 0) {
              this.value = 0
            }
            else {
              this.value = newVal;
            }
          }
      }
  },
  created: function() {
      this.newValue = this.value;
      
      Vue.use(Notify, {

        position: 'top-center',
        visibility: 18000,
        permanent: true,

      })
  }
}
</script>

<style scoped>

  .mpbtn--plus{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .mpbtn--minus{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .minusplusnumber div {
    display:inline-block;
  }

  .minusplusnumber #field_container input {
    text-align: center;
    color: inherit;
    padding: 5px;
    width: 55px;
    border: none;
    background: transparent;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 5px;
    font-size: 2rem;
  }

  .minusplusnumber .mpbtn {
    cursor:pointer;
    width: 25px;
    height: 25px;
    border-radius: 3px;
    border: solid 1px #ffffff;
    color: #fff;
    font-size: 2rem;
  }

</style>
