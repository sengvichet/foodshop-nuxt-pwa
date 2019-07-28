<template>


  <ModalBody
  v-if="showStatus"
  z_index="1"
  footerType="none"
  :title="modal_title"
  footerText="Save"
  modalWidth="50%"
  modalHeight=""
  @clickedSave="" @close="hideModal">
      <template slot="heading">

      </template>

      <template slot="subheading">
        <p class="moose__header-info">{{$t('shop.orders.ordered_on')}} <span class="moose__header-info__date">{{order_date}}</span></p>
      </template>
      <template slot="modal-content">


        <div class="list-bar list-bar__summary">


          <div v-if="canEdit=='yes' && false" class="checkbox checkbox-info checkbox-circle">
          <input :id="'order'+cart_id" type="checkbox" v-model="selectedOrder"  :value="cart_id">
          <label :for="'order'+cart_id" ></label>
          </div>


          <p class="order-summary" v-if="!on_behalf_of_user">

            <span class="order-summary order-summary__customer-name">{{user}}</span>
            {{$t('shop.orders.from')}}
            <span class="order-summary order-summary__company-name">{{company_name}}</span>
          </p>


          <p class="order-summary" v-if="on_behalf_of_user">
            <span class="order-summary order-summary__customer-name">{{user}}</span>
            for
            <span class="order-summary order-summary__customer-name">{{on_behalf_of_user}}</span>
            {{$t('shop.orders.from')}}
            <span class="order-summary order-summary__company-name">{{company_name}}</span>
          </p>


          <p class="order-summary">{{$t('shop.orders.wants_order_at')}}
            <span class="order-summary order-summary__delivery-point-name">{{delivery_point}}, </span>
            <span class="order-summary order-summary__delivery-point-address">{{delivery_point_address}}</span>
            {{$t('shop.orders.on')}} {{delivery_date}}
            <span v-if="delivery_time"> @ {{delivery_time}}</span>
          </p>

          <br />

          <div
          v-for="(item,index) in items"
          class="order-summary order-summary__products">
              <span class="order-summary order-summary__product__num">{{item.quantity}} x {{item.name}}</span>
              <span class="order-summary order-summary__product__price">{{parseFloat(item.price*item.quantity).toFixed(0)}} kr</span>
          </div>

          <div class="order-summary order-summary__products">
            <span class="order-summary order-summary__product__num">{{$t('shop.cart.discount_text')}}: {{discount}}%</span>
            <span class="order-summary order-summary__product__price">- {{discount_value}} kr</span>
          </div>

          <div class="order-summary order-summary__products">
            <span class="order-summary order-summary__product__num">{{$t('shop.cart.shipping_text')}}</span>
            <span class="order-summary order-summary__product__price">{{freight}} kr</span>
          </div>

          <div class="order-summary order-summary__products">
            <p class="order-summary">Total</p>
            <p class="order-summary order-summary__price">{{parseFloat(total).toFixed(0)}} kr</p>
          </div>

          <br>

          <p class="order-summary order-summary__comment-title">Comments</p>
          <p class="order-summary order-summary__comment-details">{{comment}}</p>



        </div>

        <div >



          <DeleteButton v-if="can_delete" @was_clicked="deleteOrderSubmit()"
                  :prompt="$t('shop.general.are_you_sure_cant_undo')"/>


        </div>


        <b-button v-if="canEdit=='yes'" size="sm" variant="success" @click.prevent="shipOrder" type="submit">Mark as shipped <icon name="refresh" v-if="isLoading" scale="0.75" spin></icon></b-button>
      </template>
    </ModalBody>

</template>

<!--
 ######   ######  ########  #### ########  ########
##    ## ##    ## ##     ##  ##  ##     ##    ##
##       ##       ##     ##  ##  ##     ##    ##
 ######  ##       ########   ##  ########     ##
      ## ##       ##   ##    ##  ##           ##
##    ## ##    ## ##    ##   ##  ##           ##
 ######   ######  ##     ## #### ##           ##    -->

<script>
import {
  API
} from "aws-amplify";
import Icon from 'vue-awesome'
import ModalBody from '~/components/modals/ModalBody.vue'
import DeleteButton from '~/components/General/DeleteButton.vue'
export default {
  components: {
    Icon,
    ModalBody,
    DeleteButton
  },
  props: {
    canEdit:{
      type:String
    },
    order:{
      type:Object,
      required:true
    }
  },
  data () {
   return {
     modal_title:this.$t('shop.orders.order_summary'),
     showStatus:false,
     users:[],
     isLoading:false,
     selectedOrder:'',
     user:'',
     order_date:'',
     ship_date:'',
     on_behalf_of_user:false,
     can_delete:false,
     delivery_point:null,
     delivery_point_address:null,
     delivery_time:null,
     company_name:null,
     comment:null,
     freight:null,
     discount:null,
     discount_value:null,
     total:null,
     delivery_date:null,
     items:null,
     cart_id:null,
     shop_id:null,
     schedule_dates:[],
     schedule_type:null,
     days_of_the_month:[]
   }
 },
 created() {

   this.days_of_the_month[1] = this.$t('shop.days_of_the_month.mon') ;
   this.days_of_the_month[2] = this.$t('shop.days_of_the_month.tue') ;
   this.days_of_the_month[3] = this.$t('shop.days_of_the_month.wed') ;
   this.days_of_the_month[4] = this.$t('shop.days_of_the_month.thu') ;
   this.days_of_the_month[5] = this.$t('shop.days_of_the_month.fri') ;
   this.days_of_the_month[6] = this.$t('shop.days_of_the_month.sat') ;
   this.days_of_the_month[7] = this.$t('shop.days_of_the_month.sun') ;



 },

  methods : {

     showModal (order) {

       this.order = order
       this.on_behalf_of_user = false
       this.can_delete = false

       this.delivery_point = this.order.delivery_point.objectName
       this.delivery_point_address = this.order.delivery_point.objectAddress
       this.delivery_date - this.order.delivery_date
       this.company_name = this.order.user_company.objectName
       this.comment = this.order.comment
       this.freight = this.order.freight
       this.discount = (this.order.discount)? parseFloat(this.order.discount).toFixed(0) : 0
       this.discount_value = (this.order.discount_value) ? parseFloat(this.order.discount_value).toFixed(0) : 0
       this.total = this.order.total
       this.delivery_time = this.order.delivery_time
       this.items = this.order.items
       this.cart_id = this.order.cartId
       this.shop_id = this.order.shopId
       this.schedule_dates = this.order.schedule_dates
       this.schedule_type = this.order.schedule_type

       this.users[0]= this.order.user
       this.user = this.getUser(this.users[0].Username)

       if (this.order.on_behalf_of != null) {
          this.users[1]= this.order.on_behalf_of
          this.on_behalf_of_user = this.getUser(this.users[1].Username)
        }


       this.order_date = this.formatTimeStampTime(this.order.createdAt)

       if (this.schedule_type == 'weekly'){

        this.delivery_date = ''

        for (var x in this.schedule_dates) {
          console.log(this.days_of_the_month[this.schedule_dates[x]]);
          this.delivery_date += this.days_of_the_month[this.schedule_dates[x]]
          this.delivery_date +=', '
        }

        this.delivery_date  = this.delivery_date.substring(0, this.delivery_date.length-2);

       }
       else {
       this.delivery_date = this.formatTimeStampDate(this.order.delivery_date)
     }

     if (
     (this.order.orderStatus == 'pending' && (new Date().getTime()) < (this.order.delivery_date )) ||
     (this.order.orderStatus == 'pending' && this.order.schedule_type == 'weekly' )
     ) {

       let order_deadline = this.$store.getters.shop.order_deadline
       let order_deadline_time = this.$store.getters.shop.order_deadline_time

       let today = new Date();
       let dead_line_date = new Date();
       dead_line_date.setDate(today.getDate());
       dead_line_date.setHours(order_deadline_time, 0, 0, 0)

       if (((this.order.delivery_date - dead_line_date.getTime()) / 1000 / (1*24*60*60)) > order_deadline) {
         this.can_delete = true
       }

       if (this.order.schedule_type == 'weekly'){
         this.can_delete = true
       }


     }

        this.$store.dispatch('lockBody');
       this.$store.dispatch('setTheme', {
         blur: true
       })
       this.showStatus = true

     },
     hideModal () {
       this.showStatus = false
       this.$store.dispatch('setTheme', {
         blur: false
       })
       this.$store.dispatch('freeBody');
     }
    ,
    async deleteOrderSubmit(event) {


              try {

              this.mixpanelTrack('Delete Order: Order History Page')
              this.isLoading = true
              await API.del("metamat", "/cart/orders/ship/" + this.shop_id, {
                body: {
                  cart_id: this.cart_id
                }
              });

              this.$emit('listOrders')
              this.hideModal()
              this.isLoading = false
              this.$notify.success('Order deleted', 'success')



            } catch (e) {
              bugsnagClient.notify(e)
              this.isLoading = false
              this.$notify.error('Can delete this order', 'success')
            }

    },

    async shipOrder() {

      try {
        if (this.selectedOrder!=''){

          this.isLoading = true

      await API.put("metamat", "/cart/orders/ship/" + this.shop_id, {
        body: {
          cart_id: this.cart_id
        }
      });

      this.$emit('listOrders')

      this.$refs.orderSummary.hide()
      this.isLoading = false
      this.$notify.success('Order marked as shipped', 'success')

    }

    } catch (e) {
      bugsnagClient.notify(e)
      this.isLoading = false
      this.$notify.error('Can not make this order as shipped', 'success')
    }


    },

    getUser (user_id) {

      let first_name = ''
      let last_name = ''

      for (var x in this.users)  {

        if (this.users[x].Username == user_id) {

          for (var y in this.users[x].UserAttributes) {

            if (this.users[x].UserAttributes[y].Name == 'custom:first_name'){
              first_name = this.users[x].UserAttributes[y].Value
            }
            if (this.users[x].UserAttributes[y].Name == 'custom:last_name'){
              last_name = this.users[x].UserAttributes[y].Value
            }

          }

        }
      }
      return first_name + ' ' + last_name

    },

    async showOrderSummaryModal(){

      this.$refs.orderSummary.show()
  }
}
}

</script>

<!--
 ######  ######## ##    ## ##       ########
##    ##    ##     ##  ##  ##       ##
##          ##      ####   ##       ##
 ######     ##       ##    ##       ######
      ##    ##       ##    ##       ##
##    ##    ##       ##    ##       ##
 ######     ##       ##    ######## ######## -->

<style lang="css">
.order-date,
.product-name,
.price,
.num {
  font-weight: normal;
}
.customer-name,
.company-name,
.comment-title,

.total {
  font-weight: bold;
  font-size: 17px;
}
.total span {
  font-weight: normal;
}
.price {
  float: right;
}
.foot-delete {
  background: #FF482E !important;
}

.order-details {
  text-align: left;
}

.order-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
</style>
