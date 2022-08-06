<template>
  <div class="w-330 p-5">
    <h4 class="text-center">注册乐享账号</h4>
    <vaildate-form @form-submit="onFromSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址：</label>
        <validata-input :rules="emailRules" v-model="formData.email" placeholder="请输入邮箱地址" type="text" ref="inputRef">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">用户名</label>
        <validata-input :rules="userRules" v-model="formData.username" placeholder="请输入用户名" type="text" ref="inputRef">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">密码：</label>
        <validata-input :rules="passwordRules" v-model="formData.password" placeholder="请输入密码" type="password">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">确认密码：</label>
        <validata-input :rules="repeatPasswordRules" v-model="formData.repeatPassword" placeholder="请再次输入密码" type="password">
        </validata-input>
        <div id="emailHelp" class="form-text" v-if="emailRef.error">{{ emailRef.message }}</div>
      </div>
      <template #submit>
        <div class="d-grid gap-2 col-8 mx-auto p-2">
          <button class="btn btn-primary" type="submit">注册</button>
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
import axios from 'axios'
export default defineComponent({
  name: 'signIn',
  components: {
    ValidataInput,
    vaildateForm
  },
  setup () {
    const store = useStore()
    const formData = reactive({
      email: '',
      username: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱地址' }
    ]
    const userRules: RulesProp = [
      { type: 'required', message: '用户名不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'passwordLength', message: '密码长度需大于6' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'passwordLength', message: '密码长度需大于6' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
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
          email: formData.email,
          username: formData.username,
          password: formData.password
        }
        const email = {
          email: formData.email
        }
        // 验证邮箱是否已注册
        axios.post('/user/validate', email).then(e => {
          console.log(e)
          if (e.data.code) {
            // 注册账号
            axios.post('/user/register', payload).then(e => {
              if (e.data.code) {
                createMessage('注册成功 正在跳转登录页面', 'success')
                setTimeout(() => {
                  router.push('/login')
                }, 2000)
              } else {
                createMessage(e.data.error, 'error')
              }
            })
          } else {
            createMessage(e.data.error, 'error')
          }
        })
      }
    }
    return {
      inputRef,
      emailRef,
      onFromSubmit,
      emailRules,
      passwordRules,
      hintData,
      userRules,
      repeatPasswordRules,
      formData
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
