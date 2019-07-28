<template>
<div>

  <div class="list-bar" v-bind:class="{ deleted: !is_enabled }" @click.prevent="showEditUserModal">
    <div class="list-bar__text-container"> <!-- this keeps the text in a flex-column with text-lign: left, to format text, and keep the icons to the right-->
      <h5 class="list-bar__title">{{user_first_name}} {{user_last_name}}</h5>
      <p class="list-bar__sub-heading">{{user_type}}</p>
    </div>
    <img class="list-bar__arrow" src="~assets/images/icons/Icon_Right_Arrow.svg" />
  </div>

    <ModalBody v-if="showModal"
               z_index="1"
               :footerType="'save'"
               :title="'Edit: '+user_first_name+' '+user_last_name"
               modalWidth="50%"
               modalHeight=""
               showSubmitButton=true
               footerText="Save"
               @clickedSave="editUserSubmit"
               @close="closeModal">

  <template slot="modal-content">

    <input class="list-bar input-text"
    type="text"
    v-model="user_first_name"
    placeholder="First Name"
    />

    <input class="list-bar input-text"
    type="text"
    v-model="user_last_name"
    placeholder="Last name"
    />

    <input class="list-bar input-text"
    type="text"
    v-model="user_phone"
    placeholder="Phone Number"
    />

    <input class="list-bar input-text"
    type="email"
    disabled
    v-model="user_email"
    placeholder="Email"
    />


        <div class="list-bar input checklist-header">
              {{ $t('shop.users.user_types.select') }}
        </div>

        <div class="input__check-list">
               <div class="input__check-list__item" v-for="(userType, index) in userTypes">
                 <input :id="'edit-user' + index" class="input__radio-button" type="radio" v-model="user_type" :value="userType.value">
                 <label :for="'edit-user' + index" class="input__check-label" :class="{'list-item--alternate-col' : (index + 1) % 2 === 0}">
                   <p class="input__check-label__text">{{ userType.text }}</p>
                   <div class="input__check-label__tick"/>
                 </label>
               </div>
             </div>

    <DeleteButton v-if="is_enabled" @was_clicked="deleteUserSubmit()"
            :prompt="$t('shop.general.are_you_sure_cant_undo')"/>


  </template>

  </ModalBody>


</div>

</template>

<script>
import {
  API
} from "aws-amplify";
import ModalBody from '~/components/modals/ModalBody.vue'
import DeleteButton from '~/components/General/DeleteButton.vue'



export default {
  components: {
    ModalBody,
    DeleteButton
  },
  data() {
    return {
      isLoading:true,
      user_first_name:'',
      user_last_name:'',
      user_phone:'',
      user_status:'',
      user_created_at:'',
      user_email:'',
      user_type:'',
      showModal: false,
      userTypes:[]

    }
  },
  props: {
    index: {
      type: Number,
      required: false
    },
    user_id: {
      type: String,
      required: true
    },
    created_at: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: true
    },
    is_enabled: {
      type:Boolean,
      required:true
    },
    attributes: {
      type: Array,
      required: true
    },
    accessType: {
      type: String
    },
    locations_prop: {
      type:Array
    },
  },

  created() {


    this.userTypes = [
              // { value: null, text:  this.$t('app.users.user_types.select') },
              { value: 'manager', text: this.$t('shop.users.user_types.manager'),disabled: (!(this.$store.getters.user.userInfo.user_type == 'owner')) },
              { value: 'employee', text: this.$t('shop.users.user_types.employee') ,disabled: (!(this.$store.getters.user.userInfo.user_type == 'owner') && !(this.$store.getters.user.userInfo.user_type == 'manager')) }
            ]

    for (var x in this.attributes){

      switch (this.attributes[x].Name) {
        case 'custom:first_name':{
        this.user_first_name = this.attributes[x].Value
        break;
      }
        case 'custom:last_name':{
        this.user_last_name = this.attributes[x].Value
        break;
      }
      case 'custom:user_phone':{
      this.user_phone = this.attributes[x].Value
      break;
    }
      case 'email':{
      this.user_email = this.attributes[x].Value
      break;
    }
        case 'custom:user_type':{
        this.user_type = this.attributes[x].Value.replace(/^\w/, c => c.toLowerCase())
        break;
      }
      }


    }

    if (this.status == 'CONFIRMED' ){
      this.user_status = this.$t('app.users.confirmed')
    }
    else {
      this.user_status = this.$t('app.users.not_confirmed')
    }

    this.user_created_at = this.formatTimeStampTime(this.created_at);

  },
  methods: {

    async deleteUserSubmit(event) {
    // event.preventDefault();
    try {

      await this.deleteUser()
      this.$emit('listUsers')
      this.mixpanelTrack('Delete Employee: Employees Page');
      this.closeModal()
      this.$notify.success(this.$t('app.users.user_deleted').replace('%s',this.user_email), 'success')
    }
    catch (e) {
      bugsnagClient.notify(e)
      this.$notify.error(this.$t('app.users.delete_error'), 'success')
    }
},

deleteUser() {
    return API.del("metamat", "/users/" + this.user_id);
  },

async editUserSubmit(event) {

    // event.preventDefault();

  if (!this.user_first_name ||
      !this.user_last_name  ||
      !this.user_phone
    )
  {
    return
  }

  try {

  let updaetd_user =   await this.updateUser({
      first_name: this.user_first_name,
      last_name: this.user_last_name,
      phone: this.user_phone,
      user_type:this.user_type
    });

    this.mixpanelTrack('Edit Employee: Employees Page');
    this.$notify.success(this.$t('app.users.user_updated').replace('%s',this.user_email), 'success')

  } catch (e) {
    bugsnagClient.notify(e)
    this.$notify.error(this.$t('app.users.update_error'), 'success')
  }

  this.$emit('listUsers')
  this.closeModal()

},

updateUser(user) {

  return API.put("metamat", "/users/"+this.user_id, {
    body: user
  });
},

    showEditUserModal () {

      this.$store.dispatch('lockBody');
      this.showModal = true;
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
    },
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
    margin-top: 20px;
    margin-bottom: 20px;
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
    width: 40px;
    height: 40px;
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
