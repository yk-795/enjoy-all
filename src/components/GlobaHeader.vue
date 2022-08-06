<template>
  <nav class="navbar navbar-dark bg-primary mb-4 px-4 justify-content-between">
    <div class="navbar w-75 mx-auto p-0">
      <router-link class="navbar-brand" to="/">乐享专栏</router-link>
      <ul v-if="!user?.isLogin" class="list-inline mb-0 pull-right ">
        <li class="list-inline-item">
          <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
        </li>
        <li class="list-inline-item"><router-link to="/signin" class="btn btn-outline-light my-2">注册</router-link></li>
      </ul>
      <ul v-else class="list-inline mb-0">
        <li class="list-inline-item">
          <drop-down :title="`你好, ${user.username}`">
            <dropdown-item>
              <router-link to="/create" class="dropdown-item">新建文章</router-link>
            </dropdown-item>
            <dropdown-item><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
            <dropdown-item><a href="#" class="dropdown-item" v-on:click="logout">退出登录</a></dropdown-item>
          </drop-down>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '../store'
import { useStore } from 'vuex'
import router from '../router'
import createMessage from './createMessage'

export default defineComponent({
  name: 'GlobaHeader',
  components: {
    DropDown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      require: true
    }
  },
  setup () {
    const store = useStore()
    const logout = () => {
      store.commit('logout')
      createMessage('退出登录成功', 'success')
      router.push('/')
    }
    return {
      logout
    }
  }
})
</script>
