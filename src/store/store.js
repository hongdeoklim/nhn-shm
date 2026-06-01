/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import keyValue from './key_value'

Vue.use(Vuex)

import moduleAuth from './auth/authModule.js'
import boardModule from './board/boardModule.js'
import menuModule from './menu/menuModule.js'
import projectModule from './project/projectModule.js'
import companyModule from './company/companyModule.js'
import memberModule from './member/memberModule.js'
import kakaoModule from './sendkakao/sendkakaoModule.js'
import approvalModule from '@/store/approval/approvalModule.js'
import employeeModule from '@/store/employee/employeeModule.js'
import fileModule from '@/store/file/fileModule.js'
import summary from '@/store/summary/index'

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    auth: moduleAuth,
    file: fileModule,
    board: boardModule,
    menu: menuModule,
    project: projectModule,
    company: companyModule,
    member: memberModule,
    approval: approvalModule,
    kakao: kakaoModule,
    employee: employeeModule,
    summary,
    keyValue
  },
  strict: process.env.NODE_ENV !== 'production'
})
