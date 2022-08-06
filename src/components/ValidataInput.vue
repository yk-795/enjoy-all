<template>
  <div class="vaildate-input-containter pd-3">
    <input type="email"
    v-if="tag !== 'textarea' "
    class="form-control"
    aria-describedby="emailHelp"
    :class="{'is-invalid':inputRef.error}"
    @blur="validataInput"
    :value="inputRef.val"
    @input ="updatedValue"
    v-bind="$attrs"
    >
    <textarea type="email"
    v-else
    class="form-control"
    aria-describedby="emailHelp"
    :class="{'is-invalid':inputRef.error}"
    @blur="validataInput"
    :value="inputRef.val"
    @input ="updatedValue"
    v-bind="$attrs"
    ></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted } from 'vue'
import { emitter } from './vaildateForm.vue'
// email格式正则表单式
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email' | 'custom' | 'passwordLength';
  message: string;
  validator?:() => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const updatedValue = (e:KeyboardEvent) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const validataInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            case 'passwordLength':
              passed = (inputRef.val.length >= 6)
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validataInput)
    })
    return {
      validataInput,
      inputRef,
      updatedValue
    }
  }
})
</script>
