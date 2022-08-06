<template>
  <div class="d-flex">
    <div class="userimg"><img src="../assets/avatar.jpg" alt="" class="rounded-circle border border-light m-3"></div>
    <div class="mt-3">
      <h5>{{props.username}}</h5>
      <span class="text-truncate text-muted fs-6 text">日常分享新鲜事物</span>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UserProfile',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup (props) {
    return {
      props
    }
  }
})
</script>

<style scoped>
.userimg img{
  width: 50px;
  height: 50px;
}
</style>
