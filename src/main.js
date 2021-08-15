import Vue from 'vue'
import App from './App.vue'


// ant-design
import Slider from 'ant-design-vue/lib/slider';
import Icon from 'ant-design-vue/lib/icon';
import 'ant-design-vue/dist/antd.css';
Vue.component(Slider.name, Slider);
Vue.component(Icon.name, Icon);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
