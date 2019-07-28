import Vue from 'vue'
import mixpanel from 'mixpanel-browser';
Vue.mixin({

  created() {

    mixpanel.init((process.env.stage == 'prod') ? process.env.mixpanel.PROD_API_KEY : process.env.mixpanel.DEV_API_KEY);
  },

  methods: {
    mixpanelTrack(trackedEvent, data = null) {

      if (data) {
        data.shop_id = this.$store.getters.shop.shop_id
        mixpanel.track(trackedEvent, data);
      } else {
        mixpanel.track(trackedEvent, {
          shop_id: this.$store.getters.shop.shop_id
        });
      }

    },
    mixpanelAlias(alias) {

      mixpanel.alias('distinct_id', alias);
    },

    mixpanelIdentify(email) {

      mixpanel.identify(email);

    },

    mixpanelRest() {
      mixpanel.reset();

    },
    mixpanelSetNewPeople(data) {

      mixpanel.people.set(data);

    },
    mixpanelSetPeople(email, data) {

      mixpanel.people.set(email, data);

    }
  }
})