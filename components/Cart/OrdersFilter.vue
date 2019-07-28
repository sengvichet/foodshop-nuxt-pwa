<template>
  <div>
    <div v-if="!calendar" class="calendar-field">

      <input v-if="false" type="text" name="search">

      <a class="round-button" href="#" @click.prevent="showCalendar">
        <img src = "~assets/images/icons/Icon_calendar_dark_teal_large.svg"  />
      </a>
    </div>
    <div v-if="calendar" class="reprots-calendar">

      <img class="calendar-icon" src="~assets/images/icons/Icon_calendar_dark_teal_large.svg" />
      <img class="close" src="~assets/images/icons/Icon_Close_X_Dark_Teal.svg" @click.prevent="hideCalendar" />

      <datepicker @selected="dateSelected" :inline="true"></datepicker>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {

  components: {
    Datepicker
  },

  data(){
    return {
      calendar:false
    }
  },

  methods: {
    showCalendar() {
      this.calendar = true
    },
    hideCalendar() {
      this.calendar = false
      this.$emit('listOrders')
    },
    dateSelected(date) {

      this.$nextTick(function () {
        this.$emit('dateSelected',date.getDate()+'-'+(date.getMonth()+1 ) + "-" + date.getFullYear());

      })


    }

  }
}

</script>
