<template>
  <div class="row">
    <div v-for="post in postList" :key="post._id" class=" col-md-12 mb-4 ">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-3"><router-link :to="`/detail/${post._id}`">{{ post.title }}</router-link></h4>
          <div class="row mb-4">
            <div class="col-md-4"><img :src="post.image" class="rounded-lg w-100" :alt="post.title"></div>
            <p class="card-text col-md-8">{{ post.content }}</p>
          </div>
          <span>{{ post.createdAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { PostProps } from '../store'
export default defineComponent({
  name: 'PostList',
  props: {
    list: {
      type: Array as PropType<PostProps[]>,
      required: true
    }
  },
  setup (props) {
    const postList = computed(() => {
      return props.list.map(post => {
        if (!post.image) {
          post.image = require('../assets/column.jpg')
        }
        return post
      })
    })
    return {
      postList
    }
  }
})
</script>

<style scoped>
a{
  text-decoration: none;
  color:#1a1a1a;
  }
a:hover {
  text-decoration:none;
  color: #0d6efd
  }

</style>
