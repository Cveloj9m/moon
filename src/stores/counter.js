import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0,
    token:"",
    username:"",
    authorities : []

  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    },
    login(data){
      this.token = data.token;
      this.username = data.username;
      this.authorities = data.authorities;
      localStorage.setItem("token", this.token)
    }
  }
})
