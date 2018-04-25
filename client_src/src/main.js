import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)

app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      'pages/index/index', 
      'pages/logs/logs',
      'pages/eat/eat',
      'pages/potato/potato',
      'pages/tips/tips',
    ], // Will be filled in webpack
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'MISS',
      navigationBarTextStyle: 'black'
    }
  }
}
