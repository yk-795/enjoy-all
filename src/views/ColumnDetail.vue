<template>
  <div class="w-690">
    <div class=" row mb-4  mx-auto align-items-center border-bottom pb-4">
      <div class="col-md-3">
        <img :src="column?.avatar" :alt="column?.title" class="rounded-circle border border-light my-3" style="height: 150px;">
      </div>
      <div class="col-md-9">
        <div class="card-body">
          <h4 class="card-title">{{ column?.title }}</h4>
          <p class="card-text text-muted">{{ column?.description }}</p>
        </div>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../components/PostList.vue'
import { GlobaDataProps } from '../store'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const store = useStore<GlobaDataProps>()
    const route = useRoute()
    const currentID = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentID)
      store.dispatch('fetchPosts', currentID)
    })
    const column = computed(() => store.getters.getColumnById(currentID))
    const list = computed(() => store.getters.getPostsByCid(currentID))
    return {
      column,
      list
    }
  }
})
</script>

<style scoped>
.w-690{
  width: 690px;
  margin: 0 auto;
}
</style>
