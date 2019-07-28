<template>
  <div>

    <div>
      <h1 class="app-ui-overlay__content--title">{{$t('shop.menu.employees')}}</h1>

        <Employee v-for="(employee,index) in employees"
              :user_id="employee.Username"
               accessType="customer"
              :created_at="employee.UserCreateDate"
              :status="employee.UserStatus"
              :is_enabled="employee.Enabled"
              :attributes="employee.Attributes"
              @listUsers="listUsers"
         />
    </div>

    <NewEmployee
    @listUsers="listUsers"
     />

  </div>
</template>


<script>
import { API } from "aws-amplify";
import NewEmployee from '~/components/Employees/NewEmployee.vue'
import Employee from '~/components/Employees/Employee.vue'

export default {

  components: {
    NewEmployee,
    Employee
  },

  data() {
    return  {
      is_blur:this.$store.getters.theme.blur,
      employees:[]
    }
  },
  computed:{
  checkBlur() { return this.$store.getters.theme.blur }
  },
  watch: {
  checkBlur(newValue) {
    this.is_blur = this.$store.getters.theme.blur
  }
},
async created() {

  try {
    this.mixpanelTrack('Page View: Employees Page');
    await this.listUsers();
    console.log(this.employees);
  } catch (e) {
    bugsnagClient.notify(e)
    this.$notify.error(e.message, 'success')
  }

},

methods : {

listUsers() {


    this.employees = []

    API.get("metamat", "/users").then((users) => {
      if(process.env.stage === 'dev'){
        console.log(users);
      }
      for (var x in users) {
        if(process.env.stage === 'dev'){
          console.log(users[x]);
        }
        for (var y in users[x].Attributes){
          if(process.env.stage === 'dev'){
            console.log(users[x].Attributes[y]);
          }
          if (users[x].Attributes[y].Name == 'custom:user_type'){

            if (users[x].Attributes[y].Value != 'owner') {
              this.employees.push(users[x])
            }

          }
        }
      }
    })
},

}

}
</script>
<style scoped>

h1 {
  font-size: 18px;
}

</style>
