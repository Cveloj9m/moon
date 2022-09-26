import axios from 'axios';
import {ElNotification} from 'element-plus';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:29',
    // baseURL: 'http://192.168.1.124:29',
    // baseURL: 'http://47.96.169.80:29',
    timeout: 5000
    // headers: {'Content-Type': 'application/json'}
  });

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if(localStorage.getItem("token"))
    config.headers['Authorization'] = localStorage.getItem("token")
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.status === 200){
      if (response.data.code === 200) {
        return Promise.resolve(response.data);
      } else {
          if (response.data.code === undefined) {
              return Promise.resolve(response.data);
          }
          if (response.data.code === 401) {
              window.localStorage.clear()
              ElMessageBox.confirm("您的认证已经过期，请重新登陆认证！", "认证过期", {type: 'warning'}).then(r => r.action)
              window.location.href = '/login'
          }
          if (response.data.code === 403) {
              window.localStorage.clear()
              ElMessageBox.confirm("您的认证已经过期，请重新登陆认证！", "认证过期", {type: 'warning'}).then(r => r.action)
              window.location.href = '/login'
          }
          if (response.data.code === 500) {
              ElNotification({title: '错误', message: response.data.message, type: 'warning'})
          }
          if (response.data.code !== 200) {
              ElNotification({title: '警告', message: response.data.message, type: 'warning'})
          }
          
          return Promise.reject(response.data);
      }
    }

    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default instance;