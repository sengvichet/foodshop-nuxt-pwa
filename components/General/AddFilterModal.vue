<template lang="html">
  <div class="">
    <div class="round-button" href="#" @click.prevent="showNewFilterModal">
      <img src="~assets/images/icons/Icon_Filter_Large.svg"/>
    </div>
    <ModalBody
      v-if="showModal"
      z_index="1"
      :footerType="footer"
      :title="$t('shop.orders.add_filter')"
      :showSubmitButton=true
      modalWidth="50%"
      :footerText="$t('shop.orders.add_filter')"
      @clickedSave="$emit('add_filter', {type: newFilterType, value: newFilter})"
      @close="closePopup"
      >

      <template slot="subheading"></template>

      <template slot="modal-content">

        <select v-model="newFilterType" id="newFilterType" class="list-bar input__selector" value="1">
          <option :value="null" selected> {{ $t('shop.orders.filter_types') }} </option>
          <option v-for="type in filter_types" :value="type"> {{type.text}} </option>
        </select>

        <div v-if="newFilterType != null">
          <select v-model="newFilter" id="newFilterType" class="list-bar input__selector" :value="0">
            <option v-for="data in filter_data[newFilterType.value]" :value="data"> {{data.text}} </option>
          </select>

        </div>
      </template>
    </ModalBody>
  </div>
</template>

<script>

import ModalBody from '~/components/modals/ModalBody.vue'

export default {
  components: {
    ModalBody
  },
  data(){
    return {
      footer: 'none',
      showModal: false,
      newFilterType: null,
      newFilter: {
        value: null,
        text: null
      }
    }
  },
  props: {
    filter_types: {
      type: Array,
      required: true
    },
    filter_data: {
      type: Object,
      required: true
    }
  },
  computed: {
    compoundValue(){
      return this.newFilterType + this.newFilter.value + this.newFilter.text;
    },
  },
  watch: {
    compoundValue(){
      this.newFilterType && this.newFilter.value && this.newFilter.text ? this.footer = 'save' : this.footer = 'none'
    }
  },
  methods: {
    showNewFilterModal(){
      this.$store.dispatch('lockBody');
      this.showModal = true;

    },

    async closePopup(){
      
      this.newFilterType = null;
      this.newFilterValue = null;

      this.$store.dispatch('freeBody');
      this.showModal = false;
    },
  }
}
</script>
