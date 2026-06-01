<template>
  <vs-row class="flex w-auto mr-4" vs-align="center" :class="size==='mobile' ? 'layout-mobile' : ''">
    <vs-col class="w-auto mr-4">{{ label }}</vs-col>
    <vs-col class="w-auto">
      <company-selector :class="size" :use-name="useName" v-model="companyId" @select="select"/>
    </vs-col>
  </vs-row>
</template>

<script>
import ProjectSelector from '@/components/selector/ProjectSelector'
import CompanySelector from '@/components/selector/CompanySelector'
export default {
  name: 'SearchNavItemCompany',
  components: {
    CompanySelector,
    ProjectSelector},
  props: {
    label: String,
    value: {
      type:[String, Number],
      defalut:''
    },
    size: {
      type: String,
      default: 'normal'
    },
    useName: Boolean
  },
  watch: {
    value (value) {
      this.companyId = value
    }
  },
  data () {
    return {
      companyId: ''
    }
  },
  methods: {
    changeText () {
      this.$emit('input', this.companyId)
    },

    keyupEvent (event) {
      if (event.code === 'NumpadEnter' || event.code === 'Enter') {
        this.$emit('keyupEvent', event.target.value)
      }
    },
    select (company) {
      this.$emit('input', this.companyId)
    }

  }
}
</script>

<style scoped>

.layout-mobile {
  display: grid !important;
  grid-template-columns: 70px 1fr;
  margin:0 0 1rem 0 !important;
}
.mobile {
  width:100%;
}

.small {
  width: 100px;
}

.normal {
  width: 130px;
}

.big {
  width: 160px;
}

.auto {
  width: auto;
}
</style>
