import Vuex from 'vuex'

require('whatwg-fetch')

const createStore = () => {
  return new Vuex.Store({
    state: {
      shop: {},
      cart: [],
      user: {},
      theme: {},
      broadcast: 0
    },
    mutations: {

      setShop(state, shop) {
        state.shop = shop
      },
      setCart(state, cart) {
        state.cart = cart
      },
      setUser(state, user) {
        state.user = user
      },
      setTheme(state, theme) {
        state.theme = theme
      },
      setBroadcast(state, broadcast) {
        state.broadcast = broadcast
      }
    },

    actions: {
      setShop(vuexContext, shop) {
        vuexContext.commit('setShop', shop)
      },
      setCart(vuexContext, cart) {
        vuexContext.commit('setCart', cart)
      },
      setUser(vuexContext, user) {
        vuexContext.commit('setUser', user)
      },
      setTheme(vuexContext, theme) {
        vuexContext.commit('setTheme', theme)
      },
      setBroadcast(vuexContext, broadcast) {
        vuexContext.commit('setBroadcast', broadcast)
      },
      lockBody() {
        let scrollPos = document.documentElement.scrollTop;
        let body
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        //document.body.style.filter = "blur(20px)";
        ///document.body.style.background = "#fff";
        window.scrollTo(0, scrollPos);
      },
      freeBody() {
        document.body.style.overflow = "scroll";
        document.body.style.position = "static";
      }
    },
    getters: {
      shop(state) {
        return state.shop
      },
      cart(state) {
        return state.cart
      },
      user(state) {
        return state.user
      },
      theme(state) {
        return state.theme
      },
      broadcast(state) {
        return state.broadcast
      }
    }
  })
}

export default createStore