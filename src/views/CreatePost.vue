<template>
  <div class="w-690 mb-5">
    <h3 class="text-center">新建文章</h3>
    <uploader :action="'/post/upload'"
     :beforeUpload="uploadCheck"
      @file-uploaded="onFileUploaded"
      class="d-flex justify-content-center align-items-center
      bg-light text-secondary w-100 my-4 uploader"
    >
    <template #default>
      <h4>点击上传头图</h4>
    </template>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h4>正在上传中，请稍后</h4>
      </div>
    </template>
    <template #uploaded="dataProps">
    <div class=" d-flex justify-content-center align-items-center uploaded">
      <img :src="dataProps.iconUrl" >
      <h4>点击重新上传</h4>
    </div>
    </template>
    </uploader>
    <vaildate-form @form-submit="onFromSubmit">
      <div class="mb-4">
        <label for="exampleFormControlInput1" class="form-label">文章标题：</label>
        <validata-input type="text" placeholder="请输入文章标题" :rules="titleRules" v-model="titleVal"></validata-input>
      </div>
      <div class="mb-4">
        <label for="exampleFormControlTextarea1" class="form-label">文章详情：</label>
        <validata-input placeholder="请输入文章详情" type="text" :tag="'textarea'" rows="10" :rules="contentRules"
          v-model="contentVal"></validata-input>
      </div>
      <template #submit>
        <div class="d-grid gap-2 col-4 mx-auto p-2">
          <button class="btn btn-primary" type="submit">发表文章</button>
        </div>
      </template>
    </vaildate-form>
  </div>
</template>

<script lang='ts'>
import vaildateForm from '@/components/vaildateForm.vue'
import ValidataInput, { RulesProp } from '@/components/ValidataInput.vue'
import router from '@/router'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobaDataProps, ResponseType, PostProps } from '../store'
import Uploader from '@/components/Uploader.vue'
import createMessage from '../components/createMessage'
import { beforeUploadCheck } from '../hooks/helper'
export default defineComponent({
  components: { vaildateForm, ValidataInput, Uploader },
  name: 'CreatePost',
  setup () {
    const titleVal = ref('')
    const contentVal = ref('')
    const iconUrl = computed(() => store.state.iconUrl)
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const store = useStore<GlobaDataProps>()
    const onFromSubmit = (result: boolean) => {
      if (result) {
        const { columnId, username } = store.state.users
        if (columnId) {
          const newPost: PostProps = {
            _id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            editor: username,
            columnId: (columnId).toString(),
            createdAt: new Date().toLocaleString()
          }
          if (iconUrl.value) {
            newPost.image = iconUrl.value
          }
          store.dispatch('createPost', newPost).then(resp => {
            if (resp.code) {
              createMessage('发表文章成功', 'success')
              setTimeout(() => {
                router.push(`/column/${columnId}`)
              }, 2000)
            }
          })
        }
      }
    }
    // 上传成功提示图片ID
    const onFileUploaded = (rawData: ResponseType) => {
      createMessage('图片上传成功!', 'success')
    }
    // 自定义上传文件验证
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小小于1MB!', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentRules,
      contentVal,
      onFromSubmit,
      onFileUploaded,
      uploadCheck,
      iconUrl
    }
  }
})
</script>

<style>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.uploader{
  height: 200px;
  cursor:pointer
}
.uploaded{
  height: 200px;
  position:relative;
}
.uploader img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded h4{
  display: none;
  position: absolute;
}
.uploaded:hover h4{
  display: block;
}
</style>
