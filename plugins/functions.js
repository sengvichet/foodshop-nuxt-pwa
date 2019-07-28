import Vue from 'vue'
import moment from "moment";
Vue.mixin({

  data() {
    return {

    }
  },
  methods: {

    formatTimeStampDate(timestamp) {
      moment.locale('no');
      return moment(new Date(timestamp)).format('DD-MM-YYYY');

    },
    formatTimeStampTime(timestamp) {
      moment.locale('no');
      return moment(new Date(timestamp)).format('DD-MM-YYYY hh:mm');

    },
    getTimezoneOffset() {
      return (new Date().getTimezoneOffset())
    }

  }

})