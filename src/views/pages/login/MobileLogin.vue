<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<template>
  <div class="h-screen flex w-full p-6 bg-img vx-row no-gutter items-center justify-center" id="page-login" style="background: #fafafa;">
    <div class="w-full login-tabs-container">

      <div class="vx-card__title mb-8">
        <h4 class="mb-2">로그인</h4>
        <p>아이디와 비밀번호를 입력해주세요.</p>
      </div>

      <div>
        <ml-input
          name="email"
          icon-no-border
          icon="icon icon-user"
          icon-pack="feather"
          label-placeholder="아이디 입력"
          v-model="emailInput"
          :danger="emailRules"
          class="w-full"/>

        <ml-input
          type="password"
          name="password"
          icon-no-border
          icon="icon icon-lock"
          icon-pack="feather"
          label-placeholder="비밀번호 입력"
          v-model="passwordInput"
          class="w-full mt-6"
          @keyup.enter="login"/>

        <div class="flex flex-wrap justify-between my-5">
          <vs-checkbox v-model="checkbox_remember_me" class="mb-3">아이디 기억하기</vs-checkbox>
          <router-link to="/forgot-password">비밀번호를 잊으셨나요?</router-link>
        </div>
        <vs-button class="w-full mb-3" color="secondary" @click="login">로그인</vs-button>
        <vs-button class="w-full" type="border" to="/m/register">회원가입</vs-button>

      </div>

      <footer class="footer mt-6 ">
        <div>
          <p class="mb-1">서비스 사용문의</p>
          <p style="align-items: center; display: flex"><feather-icon icon="PhoneIcon"  style="width:16px; margin-right:8px;"></feather-icon> 070-7007-7979<br></p>
          <p style="align-items: center; display: flex"><feather-icon icon="MailIcon"  style="width:16px; margin-right:8px;"></feather-icon> maot@maot.co.kr<br></p>
        </div>
      </footer >

    </div>
  </div>
</template>

<script>
import config from '/public/config'
import VueCookie from 'vue-cookie'
import constant from '@/constant/constant'

export default {
  watch: {
    checkbox_remember_me (checkbox_remember_me) {
      this.checkbox_remember_me = checkbox_remember_me
      VueCookie.set('login_remember_me', checkbox_remember_me, 30)

      if (!this.checkbox_remember_me) {
        VueCookie.set('login_remember_email', '')
      }
    }
  },
  data () {
    return {
      hostname: config.HOST_NAME,
      emailInput: '',
      passwordInput: '',
      checkbox_remember_me: false,
    }
  },
  computed: {
    emailRules () {
      return this.checkEmailRule(this.emailInput)
    }
  },
  created () {
    this.checkbox_remember_me = (VueCookie.get('login_remember_me') === 'true')
    if (this.checkbox_remember_me) {
      this.emailInput = (VueCookie.get('login_remember_email')) ? VueCookie.get('login_remember_email') : ''
    }
  },
  methods: {
    checkEmailRule (v) {
      if (v === '') {
        return true
      }

      const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      return !regExp.test(v)
    },

    async login () {

      const email = this.emailInput
      const pw = this.passwordInput

      this.$store.dispatch('LOGIN', {
        email,
        pw
      }).then(() => {
        if (VueCookie.get('login_remember_me') === 'true') {
          VueCookie.set('login_remember_email', this.emailInput, 30)
        }
        localStorage.removeItem('/api/auth/me')
        localStorage.removeItem('/api/v1/member/all')
        this.$router.replace('/home')
      }).catch(err => {
        switch (constant.getErrorCode(err)) {
        case constant.ERROR_LOGIN_ID_NULL: alert('아이디를 입력해주세요'); break
        case constant.ERROR_LOGIN_PASSWORD_NULL: alert('비밀번호를 입력해주세요'); break
        case constant.ERROR_LOGIN_INVALID_CREDENTIALS: alert('아이디 또는 패스워드가 틀립니다'); break
      })
    }
  }
}
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: #4285F4 }
    .bg-github { background-color: #333 }
  }
}
</style>
