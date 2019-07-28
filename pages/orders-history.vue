<template>
  <div>

    <div v-bind:class="{ blur: is_blur }">
      <div>
    <tabs
      :tabs="tabs"
      :currentTab="currentTab"
      :wrapper-class="'default-tabs'"
      :tab-class="'default-tabs__item'"
      :tab-active-class="'default-tabs__item_active'"
      :line-class="'default-tabs__active-line'"
      @onClick="handleClick"
    />

    <div v-if="isLoading" class="app-ui-overlay__centered-column">
        <LoadingAnimation/>
    </div>

      <div class="u-margin-bottom-big"/>

      <div v-if="!isLoading" class="app-ui-overlay__centered-column">
        <div v-if="currentTab!='recurring'" class="list-bar--inline-items u-margin-bottom-big">

          <Datepicker class="list-bar input__selector--narrow" @input="listOrders" name="filter_date_from"  :value="FromDate" v-model="FromDate">{{ FromDate }}</Datepicker>
          <img class="u-margin-right-default u-margin-left-default"
               src="~assets/images/icons/Icon_Right_Arrow_White_Large.svg"
               alt="to">
          <Datepicker class="list-bar input__selector--narrow--right" @input="listOrders" name="filter_date_to"  :value="ToDate" v-model="ToDate">{{ ToDate }}</Datepicker>
        </div>


        <AddFilterModal
          ref="AddFilterModal"
          v-if="!isLoading"
          :filter_types="filterTypes"
          :filter_data="{employees,productsList,orderStatus}"
          @add_filter="addFilter($event, ordersFilters)"/>

        <div class="u-margin-bottom-big"/>

        <p v-if="ordersFilters.length>0" class="app-ui-overlay__section-title">{{ $t('shop.orders.filters') }}</p>

        <div v-if="ordersFilters.length>0" class="filter-container u-margin-bottom-default" >
          <FilterBar v-for="(filter, index) in ordersFilters"
                     index="index"
                     @remove="removeFilter(ordersFilters, index)"
                     :type="filter.type.text"
                     :value="filter.value.text"/>
        </div>
      </div>



    <div v-if="!isLoading" class="content">
      <div v-if="currentTab === 'oustanding'">
        <Order
            v-for="(order,index) in outstanding"
            :key="index"
            :order="order"
            canEdit="no"
            @setCurrentOrder="setCurrentOrder"
            @listOrders="listOrders"
           />
      </div>
      <div v-if="currentTab === 'recurring'">
        <Order
          v-for="(order,index) in recurring"
          :key="index"
          :order="order"
          canEdit="no"
          @setCurrentOrder="setCurrentOrder"
          @listOrders="listOrders"
         />
      </div>
      <div v-if="currentTab === 'history'">
        <Order
          v-for="(order,index) in histroy"
          :key="index"
          :order="order"
          canEdit="no"
          @setCurrentOrder="setCurrentOrder"
          @listOrders="listOrders"
         />
      </div>
    </div>
  </div>
 </div>

  <OrderSummary
    ref="OrderSummaryModal"
    :canEdit="canEdit"
    :order="current_order"
    @listOrders="listOrders"
    />
</div>

</template>


<script>

import { API } from "aws-amplify";
import Order from '~/components/Cart/Order.vue'
import Tabs from 'vue-tabs-with-active-line';
import OrderSummary from '~/components/Cart/OrderSummary.vue'
import LoadingAnimation from '~/components/General/LoadingAnimation.vue'

import OrdersFilter from '~/components/Cart/OrdersFilter.vue'
import FilterBar from '~/components/General/FilterBar.vue'
import AddFilterModal from '~/components/General/AddFilterModal.vue'
import Datepicker from 'vuejs-datepicker';



export default {

  components: {
    Order,
    Tabs,
    OrderSummary,
    LoadingAnimation,
    OrdersFilter,
    FilterBar,
    AddFilterModal,
    Datepicker
  },
  data() {
    return {
      tabs:[{
        title: this.$t('shop.orders.oustanding'),
        value: 'oustanding',
      }, {
        title: this.$t('shop.orders.recurring'),
        value: 'recurring',
      },
      {
        title: this.$t('shop.orders.history'),
        value: 'history',
      }
      ],
      currentTab: 'oustanding',

      is_blur:this.$store.getters.theme.blur,
      isLoading:false,
      shop_id:this.$store.getters.shop.shop_id,
      canEdit:'no',
      outstanding:[],
      current_order:{},
      histroy:[],
      recurring:[],
      filterData:{},
      FromDate:null,
      ToDate: null,
      filterTypes: [
        {value: 'employees', text: this.$t('shop.orders.employees')},
        {value: 'productsList', text: this.$t('shop.orders.products')},
        {value: 'orderStatus', text: this.$t('shop.orders.order_status')}
      ],
      userLevel: '',
      employees: [],
      productsList: [],
      orderStatus:[
        {value: 'canceled', text: this.$t('shop.orders.canceled')},
        {value: 'pending', text: this.$t('shop.orders.pending')},
        {value: 'completed', text: this.$t('shop.orders.completed')}
      ],
      ordersFilters: [{"type":{"value":"orderStatus","text":"Order Status"},"value":{"value":"pending","text":"Pending"}}],
      invoicingFilters: [{"type":{"value":"orderStatus","text":"Order Status"},"value":{"value":"pending","text":"Completed"}}],
      recurringFilters:[{"type":{"value":"orderStatus","text":"Order Status"},"value":{"value":"pending","text":"Pending"}}],
    }
  },
  created () {
    this.mixpanelTrack('Page View: Orders History Page');
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur }
  },
  watch: {
    ordersFilters: function (val) {

      this.listOrders()

    },
    checkBlur(newValue) {
      this.is_blur = this.$store.getters.theme.blur
    }
  },
    async created() {
        
      try {

        this.setDates()

        
        this.isLoading = true
        await this.listOrders();
        await this.listProducts();
        await this.listUsers();
        this.isLoading = false

      } catch (e) {
        bugsnagClient.notify(e)
        this.$notify.error(e.message, 'success')
      }

    },

  methods : {
    setDates() {
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      let yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      this.FromDate = today
      this.ToDate = tomorrow
    },
    async handleClick(newTab) {

      this.userLevel = (this.$store.getters.user.userInfo!=null) ? this.$store.getters.user.userInfo.user_type : ''

      this.mixpanelTrack('Tab Click: Order History Page - '+ newTab)
      this.setDates();
      if (newTab == 'recurring') {
        this.ToDate = null
        this.FromDate = null
      }

      this.isLoading = true
      await this.listOrders();
      this.currentTab = newTab;
      this.isLoading = false
    },

     setCurrentOrder(order) {

      this.mixpanelTrack('Order Click: Order History Page')
      this.current_order = order
      this.$refs.OrderSummaryModal.showModal(order)
    },

    async listOrders() {

      this.histroy = []
      this.outstanding = []
      this.recurring = []
      await API.post("metamat", "/cart/customer/orders/"+this.shop_id,{
        body:{
          filters: {
            from: new Date(this.FromDate).setHours(0,0,0),
            to: new Date(this.ToDate).setHours(23,59,59),
            filters:this.ordersFilters
          }
        }
      }).then((orders) => {

        let today = new Date();
        let today16 = new Date();
        today16.setHours(16, 0, 0, 0);
        let today16_time_stamp = today16.getTime()


        for(var x in orders ){

           if (orders[x].schedule_type == 'weekly') {
             this.recurring.push(orders[x])
           }
           else {
             if (orders[x].delivery_date >= today16_time_stamp) {
              this.outstanding.push(orders[x])
            }
            else {
              this.histroy.push(orders[x])
            }
           }

        }

      })

    },

   async dateSelected (selected_date){


     this.isLoading = true

     await this.listOrders()

     for (var x in this.histroy) {

       let date =  new Date(this.histroy[x].createdAt)
       let order_date = (date.getDate())+'-'+(date.getMonth()+1)+'-'+(date.getFullYear())

       if (order_date != selected_date ){

           this.histroy.splice(x, 1)

       }
   }

   this.isLoading = false
 },

 async listProducts () {


   await API.get("metamat", "/cart/products/"+this.shop_id).then((products) => {

     for (var x in products) {
       this.productsList.push({text:products[x].objectName,value:products[x].objectId})
     }

   })

 },

 async listUsers() {

     this.employees = []

    await API.get("metamat", "/users").then((users) => {

       for (var x in users) {
         let first_name = ''
         let last_name = ''
         for (var y in users[x].Attributes){

           if (users[x].Attributes[y].Name == 'custom:first_name'){
             first_name = users[x].Attributes[y].Value
           }
           if (users[x].Attributes[y].Name == 'custom:last_name'){
             last_name = users[x].Attributes[y].Value
           }

         }
         this.employees.push({text: first_name + ' ' + last_name, value:users[x].Username})
       }
     })
 },


 addFilter(filter, filterArray){

   this.mixpanelTrack('Filter Add: Orders Page - ' + filter.type.text);
   this.$refs.AddFilterModal.closePopup()
   filterArray.push(
     {
       type: filter.type,
       value: filter.value
     }
   );
 },
 removeFilter(filterArray, index){
   filterArray.splice(index, 1);
 },

}
}

</script>
