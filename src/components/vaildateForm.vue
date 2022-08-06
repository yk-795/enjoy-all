<template>
  <form class="vaildate-from-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <div class="d-grid gap-2 col-8 mx-auto p-2">
          <button class="btn btn-primary" type="submit">提交</button>
        </div>
      </slot>
    </div>
  </form>
</template>

<script lang='ts'>
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
export default defineComponent({
  name: 'vaildateForm',
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr:any[] = []
    const submitForm = () => {
      const result = funcArr.map(text => text()).every(result => result)
      context.emit('form-submit', result)
    }
    const callback = (text?:string) => {
      if (text) {
        funcArr.push(text)
      }
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style scoped>
</style>
