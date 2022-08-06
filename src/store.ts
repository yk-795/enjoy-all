import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { testPosts } from './testData'
import { arrToObj, objToArr } from './helper'

export interface ResponseType {
  code:number;
  msg:string;
  newName:string;
}

export interface UserProps {
  isLogin:boolean,
  username?:string,
  _id?:string,
  columnId?:string
}
export interface PostProps{
  _id:number;
  title:string;
  content:string;
  image?:string;
  editor?:string;
  createdAt:string;
  columnId:string;
}
export interface ColumnProps{
  _id:string;
  title:string;
  avatar?:string;
  description:string;
}
interface ListProps<P>{
  [id:string]:P
}
export interface GlobalErrorProps {
  status:boolean;
  message?: string;
}

export interface GlobaDataProps {
  error: GlobalErrorProps
  token:string
  loading: boolean
  columns: {data:ListProps<ColumnProps>; isLoaded:boolean};
  posts: {data:ListProps<PostProps>; loadedColumnss:string[]};
  users: UserProps;
  iconUrl:string;
  details:{data:ListProps<ColumnProps>; loadedColumnss:string[]};
}

// 异步axios请求，url：请求地址，config：{method:请求类型，默认get请求，data：传递参数}
const asyncAndCommit = async (url:string, mutationName:string,
  commit:Commit, config:AxiosRequestConfig = { method: 'get' }, extraData?:any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobaDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, isLoaded: false },
    posts: { data: {}, loadedColumnss: [] },
    users: { isLogin: false, username: '张三' },
    iconUrl: '',
    details: { data: {}, loadedColumnss: [] }
  },
  mutations: {
    // login (state) {
    //   state.users = { ...state.users, isLogin: true, name: '李四' }
    // },
    // 新建文章
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    // 数据加载
    setLoading (state, status) {
      state.loading = status
    },
    // 错误提示
    setError (state, e:GlobalErrorProps) {
      state.error = e
    },
    // 专栏列表
    fetchColumns (state, rawData) {
      state.columns.data = arrToObj(rawData.list)
      state.columns.isLoaded = true
    },
    // 指定id专栏
    fetchColumn (state, rawData) {
      state.columns.data[rawData.item._id] = rawData.item
    },
    // 专栏文章
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = rawData.list
      state.posts.loadedColumnss.push(columnId)
    },
    // 用户登录
    login (state, rawData) {
      const token = rawData.token
      state.token = token
      // 将token利用localStorage方法储存到浏览器会话中
      localStorage.setItem('token', token)
      // 配置axios请求headers带上token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 退出登录
    logout (state) {
      state.token = ''
      state.users = { isLogin: false }
      // 将localStorage中储存的token删除
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    // 用户信息
    fetchCurrentUser (state, rawData) {
      state.users = { isLogin: true, ...rawData.user, columnId: rawData.user._id }
    },
    // 上传图片 返回icomUrl
    uploadedImg (state, rawData) {
      state.iconUrl = 'http://127.0.0.1:8081/img/' + rawData
    },
    // 文章详情
    detailPost (state, { data: rawData, extraData: postId }) {
      state.details.data[rawData.item._id] = rawData.item
      state.details.loadedColumnss.push(postId)
    },
    // 删除文章
    deletePost (state) {
      const columnID = state.users.columnId
    }
  },
  actions: {
    // 请求专栏列表数据
    fetchColumns ({ state, commit }) {
      if (!state.columns.isLoaded) {
        return asyncAndCommit('/column/list', 'fetchColumns', commit, { method: 'post' })
      }
    },
    // 请求{_id}专栏信息
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`column/detail?id=${cid}`, 'fetchColumn', commit, { method: 'get' })
      }
    },
    // 请求文章列表
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumnss.includes(cid)) {
        return asyncAndCommit('/post/list', 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    // 请求用户信息
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit, { method: 'post' })
    },
    // 用户登录请求
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    // 新建文章
    createPost ({ commit }, payload) {
      return asyncAndCommit('/post/create', 'createPost', commit, { method: 'post', data: payload })
    },
    // id文章详情
    detailPost ({ state, commit }, id) {
      if (!state.details.loadedColumnss.includes(id)) {
        return asyncAndCommit(`/post/detail?id=${id}`, 'detailPost', commit, { method: 'get' }, id)
      }
    },
    // 删除指定id文章
    deletePost ({ commit }, id) {
      return asyncAndCommit('/post/delete', 'deletePost', commit, { method: 'post', data: id })
    },
    // 文件上传
    uploadedImg ({ commit }, payload) {
      return asyncAndCommit('/img', 'uploadedImg', commit, { method: 'post', data: payload })
    },
    // 组合actions
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(data => {
        // code为1登录成功, 0登录失败
        if (data.code) {
          data.code && dispatch('fetchCurrentUser')
        }
        return data
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    // find方法返回数组中第一个通过的数
    getColumnById: (state) => (id:string) => {
      return state.columns.data[id]
    },
    // filter方法返回过滤满足传入cid的数
    getPostsByCid: (state) => (cid:string) => {
      return objToArr(state.posts.data).filter(c => c.columnId + '' === cid)
    },
    getDetailById: (state) => (id:string) => {
      return state.details.data[id]
    }
  }
})

export default store
