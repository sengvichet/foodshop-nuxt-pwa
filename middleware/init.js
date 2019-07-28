import {
  Auth,
  API
} from "aws-amplify";

export default async function(context) {

  let is_custom_domain_name = !window.location.hostname.includes('shops.kompis.app')
  let shop_id = ''

  if (!is_custom_domain_name) {
    let host_name = (process.env.stage == 'prod') ? (window.location.hostname).split('.shops.kompis.app') : (window.location.hostname).split('.devshops.kompis.app')
    shop_id = host_name[0]
  } else {
    shop_id = 'custom-' + window.location.hostname
  }

  shop_id = '58340300-2eb6-11e9-96c1-f3dbad797ef9'
  // shop_id = '3b7df8d0-259f-11e9-94bb-f3a44358c2ae'
  //shop_id = '3b7df8d0-259f-11e9-94bb-f3a44358c2ae'

  let shop_company_id = ''
  let shop_logo = ''
  let shop_name = ''
  let shop_icon = ''
  let landing_page_settings = {}
  let show_landing_page = false
  let show_videos_page = false
  let machine_service_is_active = false
  let machine_service_title = ''
  let machine_service_heading = ''
  let machine_service_button = ''
  let allow_recurring_orders = false
  let shipping_cost = 0
  let order_deadline = 0
  let order_deadline_time = 0

  await API.get("metamat", "/cart/info/" + shop_id).then((shopInfo) => {

    if (shopInfo.objectDomain && !is_custom_domain_name) {
      window.location = 'http://' + shopInfo.objectDomain + '/'
    }
    shop_id = shopInfo.objectId;
    shop_company_id = shopInfo.objectCompanyId;
    shipping_cost = (shopInfo.shippingCost) ? shopInfo.shippingCost : 0;
    shop_logo = (shopInfo.objectLogo) ? shopInfo.objectLogo : '';
    shop_name = (shopInfo.objectName) ? shopInfo.objectName : '';
    shop_icon = (shopInfo.objectIcon) ? shopInfo.objectIcon : '';
    landing_page_settings = (shopInfo.objectLandingPageSettings) ? shopInfo.objectLandingPageSettings : {}
    show_landing_page = (shopInfo.landingPageIsActive) ? shopInfo.landingPageIsActive : false
    show_videos_page = (shopInfo.videosPageIsActive) ? shopInfo.videosPageIsActive : false
    machine_service_is_active = (shopInfo.machineServiceIsActive) ? shopInfo.machineServiceIsActive : false
    machine_service_title = (shopInfo.machineServiceTitle) ? shopInfo.machineServiceTitle : ''
    machine_service_heading = (shopInfo.machineServiceHeading) ? shopInfo.machineServiceHeading : ''
    machine_service_button = (shopInfo.machineServiceButton) ? shopInfo.machineServiceButton : ''
    allow_recurring_orders = (shopInfo.allowRecurringOrders) ? shopInfo.allowRecurringOrders : false
    order_deadline = (shopInfo.orderDeadline) ? shopInfo.orderDeadline : 1
    order_deadline_time = (shopInfo.orderDeadlineTime) ? shopInfo.orderDeadlineTime : 16

  })

  context.store.dispatch('setShop', {
    shop_id: shop_id,
    shop_company_id: shop_company_id,
    shop_logo: shop_logo,
    shop_name: shop_name,
    shop_icon: shop_icon,
    landing_page_settings: landing_page_settings,
    show_landing_page: show_landing_page,
    show_videos_page: show_videos_page,
    machine_service_is_active: machine_service_is_active,
    machine_service_title: machine_service_title,
    machine_service_heading: machine_service_heading,
    machine_service_button: machine_service_button,
    allow_recurring_orders: allow_recurring_orders,
    shipping_cost: shipping_cost,
    order_deadline: order_deadline,
    order_deadline_time: order_deadline_time
  })
  context.store.dispatch('setTheme', {
    blur: false,
    show_footer: true
  })

  context.store.dispatch('setUser', {
    isAuthenticated: false,
    userInfo: null
  })

  try {

    var currentUser = await Auth.currentSession()
    if (currentUser) {
      let userInfo = {
        city: (currentUser.idToken.payload['custom:city']) ? currentUser.idToken.payload['custom:city'] : '',
        company_id: (currentUser.idToken.payload['custom:company_id']) ? currentUser.idToken.payload['custom:company_id'] : '',
        company_name: (currentUser.idToken.payload['custom:company_name']) ? currentUser.idToken.payload['custom:company_name'] : '',
        first_name: (currentUser.idToken.payload['custom:first_name']) ? currentUser.idToken.payload['custom:first_name'] : '',
        last_name: (currentUser.idToken.payload['custom:last_name']) ? currentUser.idToken.payload['custom:last_name'] : '',
        organization_id: (currentUser.idToken.payload['custom:organization_id']) ? currentUser.idToken.payload['custom:organization_id'] : '',
        post_code: (currentUser.idToken.payload['custom:post_code']) ? currentUser.idToken.payload['custom:post_code'] : '',
        user_type: (currentUser.idToken.payload['custom:user_type']) ? currentUser.idToken.payload['custom:user_type'] : '',
        email: (currentUser.idToken.payload['email']) ? currentUser.idToken.payload['email'] : '',
        exp: (currentUser.idToken.payload['exp']) ? currentUser.idToken.payload['exp'] : '',
        username: (currentUser.idToken.payload['sub']) ? currentUser.idToken.payload['sub'] : ''
      }

      bugsnagClient.user = {
        id: (currentUser.idToken.payload['sub']) ? currentUser.idToken.payload['sub'] : '',
        name: ((currentUser.idToken.payload['custom:first_name']) ? currentUser.idToken.payload['custom:first_name'] : '') + ' ' + ((currentUser.idToken.payload['custom:last_name']) ? currentUser.idToken.payload['custom:last_name'] : ''),
        email: (currentUser.idToken.payload['email']) ? currentUser.idToken.payload['email'] : ''
      }

      if (shop_company_id == currentUser.idToken.payload['custom:company_id']) {

        await API.get("metamat", "/customers/" + shop_id).then((customers) => {
          context.store.dispatch('setUser', {
            customers: customers,
            isShopOwner: true,
            isAuthenticated: true,
            userInfo: userInfo
          })
        })
      } else {

        let discount = 0
        await API.get("metamat", "/cart/access/" + shop_id).then(async (permissions) => {
          discount = (permissions[0].discount) ? permissions[0].discount : 0
        })

        context.store.dispatch('setUser', {
          isShopOwner: false,
          isAuthenticated: true,
          userInfo: userInfo,
          discount
        })

      }

    }
  } catch (e) {


  }

}