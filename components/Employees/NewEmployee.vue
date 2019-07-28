<template>
  <div >

    <div v-if="!showModal" class="app-ui-overlay__new-object">
      <div class="round-button" href="#" @click.prevent="showNewEmployeeModal">
        <img src="~assets/images/plus-icon.svg"/>
      </div>
    </div>

    <ModalBody v-if="showModal"
               z_index="1"
               :footerType="'save'"
               title="Add New Employee"
               modalWidth="50%"
               modalHeight=""
               showSubmitButton=true
               footerText="Save"
               @clickedSave="newUserSubmit"
               @close="closeModal">

  <template slot="modal-content">

    <input class="list-bar input-text"
    type="text"
    v-model="new_user_first_name"
    placeholder="First Name"
    />

    <input class="list-bar input-text"
    type="text"
    v-model="new_user_last_name"
    placeholder="Last name"
    />

    <input class="list-bar input-text"
    type="text"
    v-model="new_user_phone"
    placeholder="Phone Number"
    />

    <input class="list-bar input-text"
    type="email"
    v-model="new_user_email"
    placeholder="Email"
    />

    <div class="list-bar input checklist-header">
          {{ $t('shop.users.user_types.select') }}
    </div>

    <div class="input__check-list">
           <div class="input__check-list__item" v-for="(userType, index) in userTypes">
             <input :id="'edit-user' + index" class="input__radio-button" type="radio" v-model="new_user_type" :value="userType.value">
             <label :for="'edit-user' + index" class="input__check-label" :class="{'list-item--alternate-col' : (index + 1) % 2 === 0}">
               <p class="input__check-label__text">{{ userType.text }}</p>
               <div class="input__check-label__tick"/>
             </label>
           </div>
         </div>

  </template>

  </ModalBody>

</div>
</template>

<script>
import {
  API
} from "aws-amplify";
import Icon from 'vue-awesome'
import ModalBody from '~/components/modals/ModalBody.vue'
export default {

    components: {
     Icon,
     ModalBody
   },

  data () {
   return {
    showModal:false,
     new_user_first_name:'',
     new_user_last_name:'',
     new_user_phone:'',
     new_user_email: '',
     new_user_type: null,
     isLoading:false,
     new_user_created_as:'customer_employee',
     userTypes:[]
   }
 },
 created() {

 },

  methods : {

    async newUserSubmit(event) {

  try {

    if (
       !this.new_user_first_name ||
       !this.new_user_last_name ||
       !this.new_user_phone ||
       !this.new_user_email ||
       !this.new_user_type
       )
       {
         return
       }

    this.isLoading = true;

    let new_user = await this.createUser({
      first_name: this.new_user_first_name,
      last_name: this.new_user_last_name,
      phone: this.new_user_phone,
      email: this.new_user_email,
      user_type: this.new_user_type,
      created_as:this.new_user_created_as
    });
    this.$emit('listUsers')
    this.mixpanelTrack('New Employee Added: Employees Page');
    this.closeModal()

  } catch (e) {
    bugsnagClient.notify(e)
    this.$notify.error(this.$t('app.users.add_error'), 'success')

  }

  this.isLoading = false;
  this.new_user_first_name = ''
  this.new_user_last_name = ''
  this.new_user_phone = ''
  this.new_user_email =  ''
  this.new_user_type =  ''

},
createUser(user) {
  return API.post("metamat", "/users", {
    body: user
  });
},


showNewEmployeeModal () {
  this.$store.dispatch('lockBody');
  this.showModal = true;
  this.userTypes = [
            // { value: null, text:  this.$t('app.users.user_types.select') },
            { value: 'manager', text: this.$t('shop.users.user_types.manager'),disabled: (!(this.$store.getters.user.userInfo.user_type == 'owner')) },
            { value: 'employee', text: this.$t('shop.users.user_types.employee') ,disabled: (!(this.$store.getters.user.userInfo.user_type == 'owner') && !(this.$store.getters.user.userInfo.user_type == 'manager')) }
          ]
  this.$store.dispatch('setTheme', {
    blur: true
  })
},
closeModal () {
  this.$store.dispatch('freeBody');
  this.showModal = false;
  this.$store.dispatch('setTheme', {
    blur: false
  })
}

}
}

</script>

<style scoped>

.app-ui-overlay__new-object {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 70px;
}

.round-button {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background-color: white;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 0 auto;
    cursor: pointer;
    overflow: hidden;
    -webkit-box-shadow: 0 0.2rem 0.5rem 0 rgba(0, 0, 0, .2);
    box-shadow: 0 0.2rem 0.5rem 0 rgba(0, 0, 0, .2);
}
</style>
