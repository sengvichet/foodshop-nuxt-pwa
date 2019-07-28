<template>

      <ModalBody v-if="showModal"
                 ref="CheckOutModal"
                 z_index="1"
                 :footerType="'next'"
                 :title="title"
                 modalWidth="50%"
                 modalHeight=""
                 isFooterModal=true
                 :showSubmitButton=true
                 :footerText="submit_button"
                 @clickedNext="onSubmit"
                 @close="closeModal">

    <template slot="modal-content">

      <div class="body">

        <select v-if="isLoggedIn" v-model="selectedScheduleType" @change="changeDeliveryScheduleType"  class="list-bar input__selector" >
          <option v-for="type in deliveryScheduleTypes" :disabled="type.disabled" :value="type.value"> {{type.text}} </option>
        </select>


        <div v-if="isLoggedIn && selectedScheduleType == 'once'" class="list-bar">
          <Datepicker
          :language="nbNO"
          monday-first
          @selected="dateSelected"
          :disabledDates="disabledDates"
          :placeholder="$t('shop.checkout.select_delivery_date')"
          ></Datepicker>
        </div>


        <select v-if="isLoggedIn && showCustomers" v-model="selectedCustomer" @change="getCustomerRelatedData"  class="list-bar input__selector" >
          <option v-for="customer in customers" :value="customer.value"> {{customer.text}} </option>
        </select>


        <select v-if="showCustomerEmployees" v-model="selectedCustomerEmployee"  class="list-bar input__selector" >
          <option v-for="customer in customerEmployees" :value="customer.value"> {{customer.text}} </option>
        </select>

        <div v-if="isLoggedIn">
          <div v-if="selectedScheduleType == 'weekly'" class="list-bar">
            <DailyCalendar
             @updateSelectedDays="updateSelectedScheduleDays"
             :selectedDays="ScheduleDates"
             :allowedOrderDates="allowedOrderDates"
            />
          </div>


          <select v-if="showDeliveryPoints" v-model="selectedDeliveryPoint"  class="list-bar input__selector" >
            <option v-for="deliveryPoint in deliveryPoints" :value="deliveryPoint.value"> {{deliveryPoint.text}} </option>
          </select>



          <select v-if="showDeliveryTimes" v-model="selectedDeliveryTime"  class="list-bar input__selector" >
            <option v-for="deliveryTime in deliveryTimes" :value="deliveryTime.value"> {{deliveryTime.text}} </option>
          </select>

        </div>

        <input v-if="isLoggedIn" class="list-bar input-text"
                   type="text"
                   v-model="comments"
                   :placeholder="$t('shop.checkout.comments')"/>



        <input v-if="!isLoggedIn" class="list-bar input-text"
                   type="text"
                   v-model="email"
                   :placeholder="$t('shop.login.email')"/>



        <input v-if="!isLoggedIn" class="list-bar input-text"
                   type="password"
                   v-model="password"
                   :placeholder="$t('shop.login.password')"/>


      </div>

    </template>

    </ModalBody>

</template>

<script>

import MinusPlusField from '~/components/General/MinusPlusField.vue'
import Datepicker from 'vuejs-datepicker';
import nbNO from 'vuejs-datepicker/dist/locale'
import {Auth,API} from "aws-amplify"
import Icon from 'vue-awesome'
import DailyCalendar from '~/components/General/DailyCalendar.vue'
import ModalBody from '~/components/modals/ModalBody.vue'

export default {

  components: {
    MinusPlusField,
    Datepicker,
    Icon,
    DailyCalendar,
    ModalBody
 },
  data() {
    return {
      nbNO:nbNO,
      showModal:false,
      disabledDates: {},
      title:'',
      submit_button:'',
      email: '',
      password: '',
      user_email:'',
      isLoggedIn:false,
      comments:'',
      cart_items: this.$store.getters.cart,
      shop_id: this.$store.getters.shop.shop_id,
      shop_company_id:this.$store.getters.shop.shop_company_id,
      isLoading:false,
      freight: this.$store.getters.shop.shipping_cost,
      total:0,
      selectedDeliveryPoint: null,
      selectedCustomerEmployee:null,
      selectedDeliveryTime: null,
      selectedCustomer: null,
      selectedDeliveryDate:null,
      selectedScheduleType:null,
      deliveryPoints: [],
      customerEmployees: [],
      deliveryTimes: [],
      allowedOrderDates:[],
      deliveryScheduleTypes: [
      {value:null,text:'Ønsker du gjentagende ordre?'},
      {value:'once',text:'Kun en gang',disabled:false},
      {value:'weekly',text:'Ukentlig planlagt levering',disabled:false}
      ],
      ScheduleDates:[],
      customersList:[],
      customers:[],
      showCustomers:false,
      showDeliveryPoints:false,
      showCustomerEmployees:false,
      showDeliveryTimes:false

    }
  },
  computed:{

  checkLoggedIn() { return this.$store.getters.user.isAuthenticated },
  },
  watch: {
    checkLoggedIn(newValue) {

      if (this.$store.getters.user.isAuthenticated) {
        this.isLoggedIn = true
      }
      else {
        this.isLoggedIn = false
      }
    }
  },
  methods : {

    async onSubmit (event) {

      if (this.isLoggedIn) {
          this.placeOrder()
      }
      else {
      await  this.loggin()
      }

    },
  async  getCustomerRelatedData () {

    await  this.listDeliveryPoints()
    await  this.listCustomerEmployees()

    },
    changeDeliveryScheduleType () {
      if (this.selectedScheduleType == 'once') {
        this.ScheduleDates = []
      }
    },
    updateSelectedScheduleDays (days) {

      this.ScheduleDates = days

    },

    showCheckOutModal () {

      window.scrollTo(0, 0);

      this.isLoggedIn = this.$store.getters.user.isAuthenticated

      if (this.cart_items.length == 0 ){

        this.$router.push('/')
        return
      }

        if (this.isLoggedIn){

          this.customersList = this.$store.getters.user.customers

          if (this.customersList ) {
            this.listCustomers()
            this.showCustomers = true
          }


        this.buildDisabledDates();
        this.listDeliveryPoints();

        this.title = this.$t('shop.checkout.select_delivery_date')
        this.submit_button = this.$t('shop.checkout.order_now')

        }
        else {
          this.title = this.$t('shop.checkout.sign_in')
          this.submit_button = this.$t('shop.checkout.select_delivery_date')
        }

        this.calcuateTotal()

        this.$store.dispatch('lockBody');
        this.showModal = true;
        this.$store.dispatch('setTheme', {
          blur: true
        })
    },
    goToCart() {
        this.closeModal()
        this.$emit('showCartModal')
    },
    closeModal() {
      this.$store.dispatch('freeBody');
      this.showModal = false;
      this.$store.dispatch('setTheme', {
        blur: false,
        is_home_page: true
      })
    },
    async placeOrder () {

      this.isLoading = true
      if ( this.cart_items.length == 0 ||
        (this.selectedDeliveryDate == null && this.selectedScheduleType == 'once') ||
        (this.ScheduleDates == null && this.selectedScheduleType == 'weekly') ||
        this.selectedDeliveryPoint == null ||
        this.selectedScheduleType == null
      )
      {
        this.$notify.error(this.$t('shop.checkout.invalid_entry'), 'success')
        this.$refs.CheckOutModal.stopLoading()
        this.isLoading = false
        return
      }

      await API.post("metamat", "/cart/"+this.shop_id,{
        body:{
        items: this.cart_items,
        comment:this.comments,
        delivery_point: this.selectedDeliveryPoint,
        delivery_time: this.selectedDeliveryTime,
        delivery_date: this.selectedDeliveryDate,
        company_id : this.selectedCustomer,
        customer_employee_id : this.selectedCustomerEmployee,
        schedule_dates:this.ScheduleDates,
        schedule_type:this.selectedScheduleType,
        tzo:this.getTimezoneOffset()
      }

    }).then(async (cart_id) => {
      this.isLoading = false
      this.$store.dispatch('setCart',[])
      this.$store.dispatch('setBroadcast',Math.floor(Math.random() * 1000000000))
      this.cart_items = []
      this.comments = ''
      this.selectedDeliveryPoint = ''
      this.selectedDeliveryDate = ''
      this.closeModal()
      //  await Auth.signOut();
      //this.isLoggedIn = false
      this.$router.push('/thanks/'+cart_id)
      })


    },


    dateSelected (date) {
      this.selectedDeliveryDate = this.formatDate(date)
    },

    formatDate(date) {
    return date.getFullYear()+ '-' + ((date.getMonth() + 1) < 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1)) +'-'+ ((date.getDate() <10 ) ? '0'+date.getDate() :date.getDate())
  },

    async loggin(){

    try {

      this.isLoading = true

      if ( !this.email || !this.password){

          this.$notify.error(this.$t('shop.login.invalid_entry'), 'success')
          this.$refs.CheckOutModal.stopLoading()
          return
      }

      let auth_result = await Auth.signIn(this.email.toLowerCase(), this.password)

      var currentUser = await Auth.currentSession()
       if (currentUser) {

      await API.get("metamat", "/cart/access/"+this.shop_id).then( async (permissions) => {

        if(permissions.length == 1 || this.shop_company_id ==  currentUser.idToken.payload['custom:company_id']){

          let isShopOwner = (this.shop_company_id ==  currentUser.idToken.payload['custom:company_id']) ? true : false

          if (isShopOwner) {

            await API.get("metamat", "/customers/" + this.shop_id).then((customers) => {
              this.$store.dispatch('setUser', {
                userInfo: currentUser.idToken.payload,
                isAuthenticated:true,
                isShopOwner:isShopOwner,
                customers:customers
              },
              )

              this.customersList = customers
              this.listCustomers()
              this.showCustomers = true
            })

          }

          else {
            this.$store.dispatch('setUser', {
              userInfo: currentUser.idToken.payload,
              isAuthenticated:true,
              isShopOwner:isShopOwner
            },
            )

            await this.listDeliveryPoints();

          }


          this.buildDisabledDates();
          this.user_email = this.email
          this.isLoggedIn = true
          this.isLoading = false

        }

        else {

          await Auth.signOut();
          this.$notify.error(this.$t('shop.login.not_allowed'), 'success')
          this.isLoading = false


        }
    })

       }


    } catch (e) {
      bugsnagClient.notify(e)
    this.$notify.error(e.message, 'success')

    }

    },

     listCustomers () {

        this.customers = []
        this.customers.push({value:null,text:this.$t('shop.checkout.select_customer')})

        for (var x in this.customersList ){
          this.customers.push({value:this.customersList[x].objectId,text:this.customersList[x].objectName})
        }
    },

    async listDeliveryPoints () {

      this.showDeliveryPoints = false

      await API.get("metamat", "/cart/delivery_points/"+this.shop_id+"/"+this.selectedCustomer).then((delivery_points) => {

        this.deliveryPoints = []
        this.deliveryPoints.push({value:null,text:this.$t('shop.checkout.select_delivery_point')})

        for (var x in delivery_points ){
          this.deliveryPoints.push({value:delivery_points[x].objectId,text:delivery_points[x].objectName})
        }

        if (this.deliveryPoints.length > 1 ){
          this.showDeliveryPoints = true
        }

      })

    },

    async listCustomerEmployees () {

      this.showCustomerEmployees = false

      await API.get("metamat", "/cart/employees/"+this.shop_id+"/"+this.selectedCustomer).then((employees) => {


        this.customerEmployees = []
        this.customerEmployees.push({value:null,text:this.$t('shop.checkout.select_customer_employee')})

        for (var x in employees ){
          this.customerEmployees.push({value:employees[x].user_id,text:employees[x].first_name + ' '+employees[x].last_name})
        }

        if (this.customerEmployees.length > 1 ){
          this.showCustomerEmployees = true
        }


      })

    },

  async buildDisabledDates () {

   let allowed_order_dates = []
   let disallowed_order_dates = [0,1,2,3,4,5,6]

   let delivery_time_from = 0
   let delivery_time_to = 0
   let order_deadline = 1
   let order_deadline_time = 16
   let show_delivery_time  = false
   let allow_recurring_orders = false

   await API.get("metamat", "/cart/info/" + this.shop_id).then((shopInfo) => {
     allowed_order_dates = (shopInfo.orderDates) ? shopInfo.orderDates : [1,2,3,4,5]
     allow_recurring_orders = (shopInfo.allowRecurringOrders) ? shopInfo.allowRecurringOrders : false
     this.allowedOrderDates = allowed_order_dates
     delivery_time_from = shopInfo.deliveryTimeFrom
     delivery_time_to = shopInfo.deliveryTimeTo
     order_deadline = (shopInfo.orderDeadline) ? shopInfo.orderDeadline : 1
     order_deadline_time = (shopInfo.orderDeadlineTime) ? shopInfo.orderDeadlineTime : 16
     show_delivery_time = (shopInfo.showDeliveryTime) ? shopInfo.showDeliveryTime  : false
     this.showDeliveryTimes = show_delivery_time

   })

   if (!allow_recurring_orders) {
     this.deliveryScheduleTypes[2].disabled = true
     this.selectedScheduleType = this.deliveryScheduleTypes[1].value
   }



   if (this.showCustomers) {
      // this is a company owner logged in.
      allowed_order_dates = [0,1,2,3,4,5,6]
      this.allowedOrderDates = [0,1,2,3,4,5,6]
      order_deadline = 0
      delivery_time_from = 0
      delivery_time_to = 23
      order_deadline_time = 24
      this.showDeliveryTimes = true
   }

   if (this.showDeliveryTimes) {
     this.deliveryTimes = []
     this.deliveryTimes.push({value:null,text:this.$t('shop.checkout.select_delivery_time')})
     let minutes_list = ['00','15','30','45']
     for (var i = delivery_time_from; i <= delivery_time_to; i++) {
        for (var j in minutes_list) {
       this.deliveryTimes.push({value:("0" + i).slice(-2) + ':'+minutes_list[j],text:("0" + i).slice(-2) + ':'+minutes_list[j]})
     }
     }

   }

   for (var x in allowed_order_dates) {
     let index  = allowed_order_dates[x]

     if (index == 7) {
       index = 0
     }

     for (var y in disallowed_order_dates) {
       if (disallowed_order_dates[y] == index) {
         disallowed_order_dates.splice(y, 1);
       }
     }

   }

   var d = new Date();
   var current_hour = d.getHours();
   var todayTimeStamp = +new Date;
   var oneDayTimeStamp = 1000 * 60 * 60 * 24 * order_deadline


   if (current_hour >= order_deadline_time - 1){

    if (order_deadline == 0) {
    oneDayTimeStamp = 1000 * 60 * 60 * 24 * 1;
    }
    else {
      oneDayTimeStamp = 1000 * 60 * 60 * 24 * (parseInt(order_deadline)+1) ;
    }

   }

    var diff = todayTimeStamp + oneDayTimeStamp;
    var yesterdayDate = new Date(diff);
    console.log(yesterdayDate);
    this.disabledDates = {to: new Date(yesterdayDate.getFullYear(),yesterdayDate.getMonth(), yesterdayDate.getDate()), days: disallowed_order_dates}

  },
    reload() {

      this.$nextTick(function () {

        this.cart_items = this.$store.getters.cart
        this.calcuateTotal()

      })

    },
    calcuateTotal(){
      this.total = 0

      for(var x in this.$store.getters.cart) {
        this.total +=  parseFloat(this.$store.getters.cart[x].price * this.$store.getters.cart[x].quantity)
      }
      this.total += parseFloat(this.freight)
    }


  }

}
</script>
<style scoped>
.vdp-datepicker__calendar {
  border-radius: 1rem !important;
  width: 100% !important;
  border: 1px solid #efefef;
  padding: 1rem;
  margin-top: -12rem;
}
</style>
<style >

.vdp-datepicker {
  width: 100%;
}

.vdp-datepicker input  {
  font-size: 1.6rem;
  color: #000;
  font-weight: 600;
  width: 100%;
}

.vdp-datepicker__calendar .cell {
  color: #00ca83;
}

.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid #00ca83;
  border-radius: 1rem;
}
.vdp-datepicker__calendar .cell.day-header {
  font-size: 100%;
  color:#000;
}
.vdp-datepicker__calendar .disabled {
  color: #efefef !important;
  cursor:default !important;
}


.vdp-datepicker__calendar .cell.selected {
  background: #00ca83;
  border-radius: 1rem;
  color: #fff;
}
</style>
