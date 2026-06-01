/*=========================================================================================
  File Name: index.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
import jwt from 'jsonwebtoken'
import store from '../store/store'
import VueCookie from 'vue-cookie'
import {isMobile} from 'mobile-device-detect'

import routerProject from './router-project'
import routerMain from './router-main'
import routerList from './list'
import routerWrite from './write'
import routerBoards from './boards'
import routerBs from './bs'
import routerFields from './fields'
import routerFileLibrary from './filelibrary'

Vue.use(Router)

/**
 * 권한 체크
 * @returns {function(*, *, *): (*)}
 */
async function requireAuth (to, from, next) {

  let userToken = store.state.auth.userToken
  let isAuthenticated = false

  if (!userToken || userToken === '') {
    userToken = VueCookie.get('token')
  }
  if (userToken) {
    try {
      // jwt.decode 로 만료 기간 체크 (exp)
      const decToken = jwt.decode(userToken)
      const currentTime = new Date().getTime() / 1000

      if (currentTime < decToken.exp) {
        isAuthenticated = true
      }

      // eslint-disable-next-line no-empty
    } catch (err) {

    }
  } else {
    VueCookie.delete('token') // 현재 토큰 제거
    VueCookie.delete('current_id') // 현재 보고있는 게시물 넘버
  }

  // 게스트도 볼 수 있는가? 체크
  // api 제작필요.

  // 게스트는 볼 수 없는 경우
  // 내가 보려고하는 페이지에 권한이 있는가 체크
  // 나의 권한 가져오기 api 제작필요

  if (!isAuthenticated) {
    try {
      await store.dispatch('REFRESH_TOKEN')
      await store.dispatch('USER_INFO')
      return true
    } catch (err) {
      VueCookie.set('LOGIN_TO_FULLPATH', to.fullPath) // 로그인 후 이동할 페이지
      VueCookie.delete('token') // 현재 토큰 제거
      VueCookie.delete('current_id') // 현재 보고있는 게시물 넘버
      next('/login')
      return false
    }
  } else {
    await store.dispatch('USER_INFO')
    return true
  }

}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return {
      x: 0,
      y: 0
    }
  },
  routes: [
    ...routerProject,
    ...routerMain,
    ...routerList,
    ...routerWrite,
    ...routerBoards,
    ...routerBs,
    ...routerFields,
    ...routerFileLibrary,
    {
      path: '',
      component: () => import('@/layouts/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES - WEB
        // =============================================================================
        // login
        {
          path: '/login',
          name: 'page-login',
          component: () => import('@/views/pages/login/Login.vue'),
          meta:{
            deviceRequired: true
          }
        },
        {
          path: '/reset-password',
          name: 'page-reset-password',
          component: () => import('@/views/pages/login/ResetPassword.vue')
        },
        {
          path: '/forgot-password',
          name: 'page-forgot-password',
          component: () => import('@/views/pages/login/ForgotPassword.vue')
        },
        {
          path: '/register',
          name: 'page-register',
          component: () => import('@/views/pages/register/Register.vue')
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue')
        },
      ]
    },

    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ]
})


router.beforeEach(async (to, from, next) => {
  const checkAuthRequired = to.matched.some(function (routeInfo) { return routeInfo.meta.authRequired })
  const checkMobile = to.matched.some(function (routeInfo) { return routeInfo.meta.deviceRequired })


  // 로그인 여부
  if (checkAuthRequired) {
    const isAuth = await requireAuth(to, from, next)
    if (isAuth) {
      next()
    }
  } else {
    next()
  }

})


router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
