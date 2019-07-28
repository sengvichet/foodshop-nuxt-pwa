<template lang="html">
  <div class="filter-bar">
    <h5 class="filter-bar__type">{{ type }}:</h5>
    &nbsp;
    <h5 class="filter-bar__value">{{ value }}</h5>
    <img class="list-bar__icon"
         src="~assets/images/icons/Icon_Close_X_Dark_Teal.svg"
         @click="$emit('remove', index)"/>
  </div>
</template>

<script>
export default {
  props: [
    'type',
    'value',
    'index'
  ]
}
</script>
