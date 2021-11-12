import axios from 'axios'
const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev ? '/api' : 'http://112.124.28.134:8080'
const axiosIns = (() => {
  const userInfoStr = localStorage.getItem('user_info')
  const userInfoObj = JSON.parse(userInfoStr)
  const auth = window.btoa(`${userInfoObj?.name}:${userInfoObj?.password}`) || ''
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
})()

axiosIns.interceptors.response.use((res) => {
  console.log(res)
  return res.data
})
class Api {
  register(params) {
    var object = {}
    params.forEach(function (value, key) {
      object[key] = value
    })
    var jsonString = JSON.stringify(object)
    localStorage.setItem('user_info', jsonString)
    return axiosIns.post('/sign_up', params)
  }
  getGraph() {
    return axiosIns.get('/graph_user/get')
  }
  deleteGraph(params) {
    return axiosIns.post('/graph_user/delete', params)
  }
  createGraph(params) {
    return axiosIns.post('/graph_user/create', params)
  }
}
export default new Api()
