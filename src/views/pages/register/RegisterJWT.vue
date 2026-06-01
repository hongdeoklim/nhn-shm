<!-- =========================================================================================
File Name: RegisterJWT.vue
Description: Register Page for JWT
----------------------------------------------------------------------------------------
Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="clearfix">
    <ml-input
      v-validate="'required|alpha_dash|min:3'"
      data-vv-validate-on="blur"
      label-placeholder="Name"
      name="displayName"
      placeholder="Name"
      v-model="displayNameInput"
      class="w-full" />
<!--    <span class="text-danger text-sm">{{ errors.first('displayName') }}</span>-->

    <ml-input
      v-validate="'required|email'"
      data-vv-validate-on="blur"
      name="email"
      type="email"
      label-placeholder="Email"
      placeholder="Email"
      v-model="emailInput"
      class="w-full mt-6" />
<!--    <span class="text-danger text-sm">{{ errors.first('email') }}</span>-->

    <ml-input
      ref="password"
      type="password"
      data-vv-validate-on="blur"
      v-validate="'required|min:6|max:10'"
      name="password"
      label-placeholder="Password"
      placeholder="Password"
      v-model="passwordInput"
      class="w-full mt-6" />
<!--    <span class="text-danger text-sm">{{ errors.first('password') }}</span>-->

    <ml-input
      type="password"
      v-validate="'min:6|max:10|confirmed:password'"
      data-vv-validate-on="blur"
      data-vv-as="password"
      name="confirm_password"
      label-placeholder="Confirm Password"
      placeholder="Confirm Password"
      v-model="confirmPasswordInput"
      class="w-full mt-6" />
<!--    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>-->

    <vs-checkbox v-model="isTermsConditionAccepted" class="mt-6">이용약관 동의</vs-checkbox>
    <vs-button  type="border" to="/login" class="mt-6">로그인으로</vs-button>
    <vs-button class="float-right mt-6" @click="registerUserJWt" :disabled="!validateForm">가입하기</vs-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      displayNameInput: '',
      emailInput: '',
      passwordInput: '',
      confirmPasswordInput: '',
      isTermsConditionAccepted: true
    }
  },
  computed: {
    validateForm () {
      return this.displayNameInput !== '' && this.emailInput !== '' && this.passwordInput !== '' && this.confirmPasswordInput !== '' && this.isTermsConditionAccepted === true
      // return !this.errors.any() && this.displayName !== '' && this.email !== '' && this.password !== '' && this.confirm_password !== '' && this.isTermsConditionAccepted === true
    }
  },
  methods: {
    checkLogin () {
      // 가입된 id 체크


      // If user is already logged in notify
      /*if (this.$store.state.auth.isUserLoggedIn()) {

        // Close animation if passed as payload
        // this.$vs.loading.close()

        this.$vs.notify({
          title: 'Login Attempt',
          text: 'You are already logged in!',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning'
        })

        return false
      }*/
      return true
    },
    registerUserJWt () {
      // If form is not validated or user is already login return
      if (!this.validateForm || !this.checkLogin()) return

      // 가입
      const id = this.displayNameInput
      const email = this.emailInput
      const password = this.passwordInput
      const confirm = this.confirmPasswordInput

      this.$store.dispatch('REGISTER_MEMBER', {id, email, password, confirm}).then((data) => {

      }).catch((message) => {
        console.error('REIGSTER ERRORRR', message)
      })

    }
  }
}
</script>
