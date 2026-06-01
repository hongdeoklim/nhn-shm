<template>
  <vs-row v-if="size === 'mobile'" class="flex mobile w-auto " vs-align="center">
    <vs-col>
      <vs-row class="layout-mobile">
        <vs-col class="w-full flex " vs-align="center">{{ label }}</vs-col>
        <vs-col class="w-full">
          <date-selector class="w-full" v-model="sdate" @change="changeS" :format="format"/>
        </vs-col>
      </vs-row>
      <vs-row class="layout-mobile">
        <vs-col class="w-full " v-if="type === 'fromto'"></vs-col>
        <vs-col class="w-full" v-if="type === 'fromto'">
          <date-selector class="w-full" v-model="edate" @change="changeE" :format="format"/>
        </vs-col>
      </vs-row>
    </vs-col>
  </vs-row>
  <vs-row v-else class="flex w-auto mr-4" vs-align="center">
    <vs-col class="w-auto mr-4">{{ label }}</vs-col>
    <vs-col class="w-auto">
      <date-selector :class="size" v-model="sdate" @change="changeS" :format="format"/>
    </vs-col>
    <vs-col class="w-auto mx-4" v-if="type === 'fromto'">~</vs-col>
    <vs-col class="w-auto" v-if="type === 'fromto'">
      <date-selector :class="size" v-model="edate" @change="changeE" :format="format"/>
    </vs-col>
  </vs-row>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'SearchNavItemDate',
  components: {DateSelector},
  props: {
    label: String,
    value: Array,
    size: {
      type: String,
      default: 'normal'
    },
    format: { type: String, default: 'YYYY-MM-DD' },
    type: {
      type: String,
      default: 'fromto'
    }
  },
  watch: {
    value (value) {
      if (value && value.length > 0) {
        this.sdate = value[0]
        this.edate = (value.length > 0) ? value[1] : ''
      }
    }
  },
  data () {
    return {
      sdate:'',
      edate:'',
    }
  },
  created () {
  },
  methods: {
    change () {
      if (this.type === 'fromto') {
        this.$emit('input', [this.sdate, this.edate])
        this.$emit('change', [this.sdate, this.edate])
      } else {
        this.$emit('input', [this.sdate])
        this.$emit('change', [this.sdate])
      }
    },

    changeS (value) {
      if (!value) {
        this.sdate = ''
      }
      this.change()
    },

    changeE (value) {
      if (!value) {
        this.edate = ''
      }
      this.change()
    }
  }
}
</script>

<style scoped>
.mobile {
  width:100% !important;
}
.layout-mobile {
  display: grid !important;
  grid-template-columns: 70px 1fr;
  margin:0 0 1rem 0 !important;
}
.small {
  width: 80px;
}

.normal {
  width: 130px;
}
</style>
