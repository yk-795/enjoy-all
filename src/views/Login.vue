<template>
  <div class="w-330 p-5">
    <h4 class="text-center">登录到乐享</h4>
    <vaildate-form @form-submit="onFromSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址：</label>
        <validata-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">密码：</label>
        <validata-input :rules="passwordRules" v-model="passwordVal" placeholder="请输入密码" type="password">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <template #submit>
        <div class="d-grid gap-2 col-8 mx-auto p-2">
          <button class="btn btn-primary" type="submit">登录</button>
        </div>
      </template>
    </vaildate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
import ValidataInput, { RulesProp } from '../components/ValidataInput.vue'
import vaildateForm from '../components/vaildateForm.vue'
import { useStore } from 'vuex'
import router from '../router'
import createMessage from '../components/createMessage'
const emailRules: RulesProp = [
  { type: 'required', message: '邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱地址' }
]
const passwordRules: RulesProp = [
  { type: 'required', message: '密码不能为空' },
  { type: 'passwordLength', message: '密码长度需大于6' }
]
export default defineComponent({
  name: 'Login',
  components: {
    ValidataInput,
    vaildateForm
  },
  setup () {
    const store = useStore()
    const emailVal = ref('')
    const passwordVal = ref('')
    const inputRef = ref<any>()
    const hintData = reactive({
      status: false,
      message: ''
    })
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    // 返回验证是否通过，通过路由跳转到首页，以及调用store里的login方法
    const onFromSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', payload).then(data => {
          if (data.code) {
            createMessage('登录成功 2秒后跳转首页', 'success')
            setTimeout(() => {
              router.push('/')
            }, 2000)
          } else {
            createMessage(data.error, 'error')
          }
        })
      }
    }
    return {
      emailVal,
      passwordVal,
      inputRef,
      emailRef,
      onFromSubmit,
      emailRules,
      passwordRules,
      hintData
    }
  }
})
</script>
<style scoped>
.w-330 {
  width: 330px;
  margin: 0 auto;
}
</style>
