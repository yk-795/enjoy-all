<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-lg-4 col-md-4 mb-4 ">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar" class="rounded-circle border border-light my-3" :alt="column.title">
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text">{{column.description}}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        if (!column.avatar) {
          column.avatar = require('@/assets/avatar.jpg')
        }
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>
<style>
  .card-body p{
    text-align: left;
  }
  .card-body img{
    width: 70px;
    height: 70px;
  }
</style>
