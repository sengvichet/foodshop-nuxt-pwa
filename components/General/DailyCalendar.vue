<template>
  <div class="daily-calendar">

    <div v-for="(day,index) in days_of_the_month" :class="[!day.is_selectable ? 'disabled' :'' ,isSelected(day.is_selected)]" class="cell" @click.prevent="selectDate(index)" >
      {{day.text}}
    </div>
  </div>
</template>

<script>


export default {
  props: {
    selectedDays :{
      type: Array,
      required:false
    },
    allowedOrderDates:{
      type: Array,
      required:false
    }
  },
  data () {
   return {
    selected_days_of_the_month:[],
    days_of_the_month:[
      {
        text: this.$t('shop.days_of_the_month.sun'),
        value: '0',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.mon'),
        value: '1',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.tue'),
        value: '2',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.wed'),
        value: '3',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.thu'),
        value: '4',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.fri'),
        value: '5',
        is_selected: false,
        is_selectable:false,
      },
      {
        text: this.$t('shop.days_of_the_month.sat'),
        value: '6',
        is_selected: false,
        is_selectable:false,
      }
    ]
   }
 },

 created (){
   for (var x in this.days_of_the_month){
   for (var y in this.allowedOrderDates) {
     if (this.allowedOrderDates[y] == this.days_of_the_month[x].value) {
       this.days_of_the_month[x].is_selectable = true

     }
   }
 }

   for (var x in this.selectedDays){
     this.days_of_the_month[this.selectedDays[x]].is_selectedDays = true
     this.selectDate(this.selectedDays[x])
   }

 },

  methods : {
    selectDate (day_index) {

      if (this.days_of_the_month[day_index].is_selectable){

      this.days_of_the_month[day_index].is_selected = !this.days_of_the_month[day_index].is_selected

      var index =  this.selected_days_of_the_month.indexOf(this.days_of_the_month[day_index].value)
      if ( index == -1 ){
      this.selected_days_of_the_month.push(this.days_of_the_month[day_index].value)
      }
      else {
        this.selected_days_of_the_month.splice(index, 1);
      }

      this.$emit('updateSelectedDays',this.selected_days_of_the_month)
      }

    },

    isSelected(status) {
      if (status) {
      return 'selected'
      }
      else {
        return ''
      }

    }

  }
}
</script>
<style scoped>
.daily-calendar{
  display:flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-grow: 1;
  }

  .daily-calendar .cell {
    width: 14.2%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #efefef;
    color: #00ca83;

  }


  .daily-calendar .cell:first-child {
    border-radius: 1rem 0 0 1rem;

  }

  .daily-calendar .cell:last-child {
    border-radius: 0 1rem 1rem 0;

  }

  .daily-calendar .cell:hover {
      cursor: pointer;
  }

  .daily-calendar > div.selected, .cell.selected {
    background: #00ca83;
    color: #fff;
  }

  .daily-calendar > .disabled {
    color: #efefef !important;
    cursor:default !important;
  }
  .daily-calendar > .disabled:hover {
    border-color: #efefef !important ;
  }

</style>
