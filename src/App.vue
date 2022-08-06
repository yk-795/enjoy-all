<template>
  <div class="container-fluid p-0">
    <globa-header :user="currentUser"></globa-header>
    <loader text=" 拼命加载中 " v-if="isLoading"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6 mt-auto">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">@ 2022 乐享专栏</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobaHeader from './components/GlobaHeader.vue'
import { useStore } from 'vuex'
import { GlobaDataProps } from './store'
import Loader from './components/Loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobaHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobaDataProps>()
    const currentUser = computed(() => store.state.users)
    const isLoading = computed(() => store.state.loading)
    return {
      currentUser,
      isLoading
    }
  }

})
</script>

<style>
</style>
