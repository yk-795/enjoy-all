<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus ==='loading'" name="loading">
      <button class="btn btn-primary" disabled>正在上传中....</button>
      </slot>
      <slot v-else-if="fileStatus ==='success'" name="uploaded" :iconUrl = "iconUrl">
      <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file"
     class="file-input d-none"
     ref="fileInput"
     @change="handleFileChange"
     >
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file:File) => boolean;
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  inheritAttrs: false,
  // 定义触发成功或者失败的事件
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement >(null)
    const store = useStore()
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref('')
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e:Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        // 获取到第一个文件，存到formData对象中
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('icon', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          const nameParam = { newName: resp.data.newName }
          // const nameParam = res.data.newName
          store.dispatch('uploadedImg', nameParam)
          fileStatus.value = 'success'
          uploadedData.value = resp.data
          context.emit('file-uploaded', resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    // 只有计算属性才能取出
    const iconUrl = computed(() => store.state.iconUrl)
    return {
      fileInput,
      fileStatus,
      triggerUpload,
      handleFileChange,
      uploadedData,
      iconUrl
    }
  }
})
</script>

<style scoped>
</style>
