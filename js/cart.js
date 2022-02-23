const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'clara-vue3'

const app = Vue.createApp({
  data () {
    return {
      cartData: {},
      products: []
    }
  },
  methods: {
    getProducts () {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
})

VeeValidate.defineRule('email', VeeValidateRules.email)
VeeValidate.defineRule('required', VeeValidateRules.required)

app.component('VForm', VeeValidate.Form)
app.component('VField', VeeValidate.Field)
app.component('ErrorMessage', VeeValidate.ErrorMessage)

app.mount('#app')
