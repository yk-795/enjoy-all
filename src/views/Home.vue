<template>
<div class="home-page">
  <section class="text-center py-5 container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto" >
        <img src="../assets/callout.svg" alt="callout" class="w-50">
        <h2 class="font-weight-light">随心写作，自由表达</h2 >
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
      </div>
    </div>
  </section>
  <h4 class="text-center">发现精彩</h4>
  <column-list :list="list" class="col-lg-6 col-md-8 mx-auto p-0"></column-list>
</div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobaDataProps } from '../store'

export default defineComponent({
  name: 'Hmoe',
  components: {
    ColumnList
  },
  setup () {
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const store = useStore<GlobaDataProps>()
    const list = computed(() => store.getters.getColumns)
    return {
      list
    }
  }
})
</script>
