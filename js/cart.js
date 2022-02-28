import productModal from './components/productModal.js';
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
})

const site = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'clara-vue3';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: '',
      cartData: {
        carts: [],
      },
      loadingStatus: {
        seeMoreInfo: '',
        addToCart: '',
        deleteCartItem: '',
        updateCartItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: ''
      }
    }
  },
  components: {
    productModal,
    vForm: Form,
    vField: Field,
    errorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const loader = this.$loading.show();

      axios.get(`${site}/api/${apiPath}/products/all`)
      .then((res) => {
        this.products = res.data.products;
        loader.hide();
      })
    },
    seeMoreInfo(id) {
      this.loadingStatus.seeMoreInfo = id;
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCartData() {
      axios.get(`${site}/api/${apiPath}/cart`)
      .then((res) => {
        this.cartData = res.data.data;
        this.loadingStatus.seeMoreInfo = '';
      })
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty
      }

      this.loadingStatus.addToCart = id;

      axios.post(`${site}/api/${apiPath}/cart`, { data })
      .then((res) => {
        alert(res.data.message);
        this.getCartData();
        this.loadingStatus.addToCart = '';
        this.$refs.productModal.closeModal();
      })
    },
    removeCartItem(id) {
      this.loadingStatus.removeCartItem = id;

      axios.delete(`${site}/api/${apiPath}/cart/${id}`)
      .then((res) => {
        alert(res.data.message);
        this.getCartData();
        this.loadingStatus.removeCartItem = '';
      })
    },
    removeCartItems() {
      axios.delete(`${site}/api/${apiPath}/carts`)
      .then((res) => {
        alert(res.data.message);
        this.getCartData();
      })
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty
      }

      this.loadingStatus.updateCartItem = item.id;

      axios.put(`${site}/api/${apiPath}/cart/${item.id}`, { data })
      .then((res) => {
        alert(res.data.message);
        this.loadingStatus.updateCartItem = '';
      })
    },
    createOrder() {
      axios.post(`${site}/api/${apiPath}/order`, { data: this.form })
      .then((res) => {
        alert(res.data.message);
        this.$refs.form.resetForm();
        this.getCartData();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    }
  },
  mounted() {
    this.getProducts();
    this.getCartData();
  }
})

app.use(VueLoading.Plugin);

app.mount('#app');