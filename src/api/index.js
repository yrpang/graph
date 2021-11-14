import axios from 'axios'
const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev ? '/api' : 'http://112.124.28.134:8080'
const getAxiosIns = () => {
  const userInfoStr = sessionStorage.getItem('user_info')
  const userInfoObj = JSON.parse(userInfoStr)
  const auth = window.btoa(`${userInfoObj?.name}:${userInfoObj?.password}`) || ''
  if (userInfoStr) {
    return axios.create({
      baseURL,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
  } else {
    return axios.create({
      baseURL,
    })
  }
}

class Api {
  get axiosIns() {
    const axiosIns = getAxiosIns()
    axiosIns.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        console.log(err, '---')
      }
    )
    return axiosIns
  }
  saveUserInfo(params) {
    var jsonString = JSON.stringify(params)
    sessionStorage.setItem('user_info', jsonString)
  }
  login(params) {
    const auth = window.btoa(`${params?.name}:${params?.password}`) || ''
    const axiosIns = axios.create({
      baseURL,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    axiosIns.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        return err
      }
    )
    return axiosIns.post('/login')
  }
  register(params) {
    return this.axiosIns.post('/sign_up', params)
  }
  getGraph() {
    return this.axiosIns.get('/graph_user/get')
  }
  deleteGraph(params) {
    return this.axiosIns.post('/graph_user/delete', params)
  }
  createGraph(params) {
    return this.axiosIns.post('/graph_user/create', params)
  }
  getGraphData(id) {
    return this.axiosIns.get('/graph_app/entire_graph?graphID='+id)
  }
  uploadRelation(params) {
    return this.axiosIns.post('/graph_operate/upload_relation', params)
  }
  uploadAttribute(params) {
    return this.axiosIns.post('/graph_operate/upload_attribute', params)
  }
}
export default new Api()
