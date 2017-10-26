import request from 'superagent'

const state = {
  login_email: '',
  login_token: '',
  login_name: '',
  temp_email: '',
  temp_token: '',
  temp_name: ''
}

const getters = {
  // Filtering（濾過ろか过滤）currentUser
  currentUser: state => {
    return {
      email: state.login_email,
      token: state.login_token,
      name: state.login_name
    }
  }
}

const mutations = {
  updateData (state, payload) {  // 通过提交 mutations 来修改state，payload(载荷)是个对象
    switch (payload.name) {
      case 'email':
        state.temp_email = payload.value
        break
      case 'token':
        state.temp_token = payload.value
        break
      case 'name':
        state.temp_name = payload.name
        break
      default:
        console.log('Error:Dont directly mutate Vuex store')
    }
  },
  getLocalUser (state) {      // 获取当前user对象
    state.login_email = localStorage.getItem('email')
    state.login_token = localStorage.getItem('token')
    state.login_name = localStorage.getItem('name')
  },
  setUser (state, payload) {   // 设置当前user
    console.log(state)
    console.log(payload)
    state.login_email = payload.email
    state.login_token = payload.token
    state.login_name = payload.name
  },
  logout (state) {    // 退出登录，清空localStorage 和 state
    localStorage.removeItem('email')
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    state.login_email = ''
    state.login_token = ''
    state.login_name = ''
  }
}

const actions = {   // 登录接口
  /**
   * Login
   * new Promise((resolve, reject) => {})
   * Authorization: 'Bearer ' + token
   * email: payload.email
   * pass: payload.pass
   * name: payload.name
   */
  login ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .get('https://douban.herokuapp.com/user/' + payload.email)
        .set('Authorization', 'Bearer ' + payload.token)
        .then(res => {
          commit({
            type: 'setUser',    // 提交 名为 setUser 的 mutations
            email: res.body.email,
            token: res.body.token,
            name: res.body.name
          })
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  /**
   * Register
   * new Promise((resolve, reject) => {})
   * email: payload.email
   * pass: payload.pass
   * name: payload.name
   */
  register ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .post('https://douban.herokuapp.com/user/')
        .send({
          email: payload.email,
          pass: payload.pass,
          name: payload.name
        })
        .then(res => {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('email', res.body.email)
          localStorage.setItem('name', res.body.name)

          commit({
            type: 'setUser',
            email: res.body.email,
            token: res.body.token,
            name: res.body.name
          })
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
