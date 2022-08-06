<template>
  <div class="w-690 mb-5">
    <modal title="删除文章" :visible="modalIsVisible" @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="deletePost">
      <span>确定要删除这篇文章吗？</span>
    </modal>
    <div class="w-100 my-4 headImg d-flex justify-content-center align-items-center">
      <img :src="detail?.image" alt="">
    </div>
    <h4>{{ detail?.title }}</h4>
    <div class="d-flex raw border-top border-bottom my-3">
      <user-profile :username="username" class="col-md-8 "></user-profile>
      <span class="text-muted col-md-4 font-italic mt-4">发表于:{{ detail?.createdAt }}</span>
    </div>
    <div v-html="detailHTML"></div>
    <div class="d-grid gap-2 col-4 mx-auto p-3" v-if="showEditArea">
      <button class="btn btn-danger" type="button" @click.prevent="modalIsVisible = true">删除</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import MarkdownIt from 'markdown-it'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import createMessage from '../components/createMessage'
import Modal from '@/components/Modal.vue'
export default defineComponent({
  name: 'postDetail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const md = new MarkdownIt()
    const modalIsVisible = ref(false)
    const detailID = route.params.id
    onMounted(() => {
      store.dispatch('detailPost', detailID)
    })
    const detail = computed(() => store.getters.getDetailById(detailID))
    // Markdown转换为html
    const detailHTML = computed(() => {
      if (detail.value && detail.value.content) {
        return md.render(detail.value.content)
      }
      return null
    })
    const username = computed(() => {
      if (detail.value && detail.value.editor) {
        return detail.value.editor
      }
      return '默认用户名'
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.users
      if (isLogin && detail.value && detail.value.columnId) {
        return detail.value.columnId === _id
      } else {
        return false
      }
    })
    const deletePost = () => {
      const id = {
        id: detail.value._id
      }
      modalIsVisible.value = false
      store.dispatch('deletePost', id).then(resp => {
        createMessage('删除文章成功', 'success')
        setTimeout(() => {
          router.push(`/column/${detail.value.columnId}`)
        }, 2000)
      })
    }
    return {
      detail,
      detailHTML,
      username,
      showEditArea,
      deletePost,
      modalIsVisible
    }
  }
})
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}

.headImg {}

.headImg img {
  width: 100%;
  height: auto;
  max-height: 300px;
}
</style>
