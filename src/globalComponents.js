/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VxTooltip from './layouts/components/vx-tooltip/VxTooltip.vue'
import VxCard  from './components/vx-card/VxCard.vue'
import VxList  from './components/vx-list/VxList.vue'
import VxBreadcrumb  from './layouts/components/VxBreadcrumb.vue'
import FeatherIcon  from './components/FeatherIcon.vue'
import VxInputGroup  from './components/vx-input-group/VxInputGroup.vue'

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxList.name, VxList)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component(VxInputGroup.name, VxInputGroup)


// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'XIcon',
        svgClasses: 'w-4 h-4 mt-1'
      }
    })
  },
  OpenIndicator: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'ChevronDownIcon',
        svgClasses: 'w-5 h-5'
      }
    })
  }
})

Array.prototype.remove = function () {
  const a = arguments
  let what = 0, ax = 0, L = a.length
  while (L && this.length) {
    what = a[--L]
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1)
    }
  }

  // children이 있을 시, 자식노드도 검색 삭제
  if (a && a.length > 1 && a[1] === true) {
    for (const children of this) {

      // key에 children이 있을 경우 삭제
      if (children && children.children) {
        children.children.remove(a[0], a[1])
      }

      // key에 submenu가 있을 경우 삭제
      if (children && children.submenu) {
        children.submenu.remove(a[0], a[1])
      }

    }
  }
  return this
}

Array.prototype.removeIndex = function () {
  const a = arguments
  let length = a.length
  this.splice(a[--length], 1)
  return this
}

Date.prototype.format = function (f) {
  if (!this.valueOf()) return ' '
  const weekKorName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const weekKorShortName = ['일', '월', '화', '수', '목', '금', '토']
  const weekEngName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekEngShortName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const d = this
  let h = '0'
  return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
    case 'yyyy': return d.getFullYear() // 년 (4자리)
    case 'yy': return (d.getFullYear() % 1000).zf(2) // 년 (2자리)
    case 'MM': return (d.getMonth() + 1).zf(2) // 월 (2자리)
    case 'dd': return d.getDate().zf(2) // 일 (2자리)
    case 'KS': return weekKorShortName[d.getDay()] // 요일 (짧은 한글)
    case 'KL': return weekKorName[d.getDay()] // 요일 (긴 한글)
    case 'ES': return weekEngShortName[d.getDay()] // 요일 (짧은 영어)
    case 'EL': return weekEngName[d.getDay()] // 요일 (긴 영어)
    case 'HH': return d.getHours().zf(2) // 시간 (24시간 기준, 2자리)
    case 'hh': return ((h = d.getHours() % 12) ? h : 12).zf(2) // 시간 (12시간 기준, 2자리)
    case 'mm': return d.getMinutes().zf(2) // 분 (2자리)
    case 'ss': return d.getSeconds().zf(2) // 초 (2자리)
    case 'a/p': return d.getHours() < 12 ? '오전' : '오후' // 오전/오후 구분
    default: return $1
    }
  })
}
Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

String.prototype.string = function (len) { let s = '', i = 0; while (i++ < len) { s += this } return s }
String.prototype.zf = function (len) { return '0'.string(len - this.length) + this }
Number.prototype.zf = function (len) { return this.toString().zf(len) }


Vue.component(vSelect)
