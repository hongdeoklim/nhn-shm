<template>
  <!-- 기본정보 -->
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
    </vs-row>
    <vs-row>

      <vs-col class="w-4/12 mb-4">
        <vs-col class="w-4/12 h-full flex" vs-align="center">현장명</vs-col>
        <vs-col class="w-8/12 flex" vs-align="center">
          <span v-if="isPrint">{{form.project_title}}</span>
          <ml-input v-else class="w-full" v-model="form.project_title" :readonly="true" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">업체명</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{ form.com_name }}</span>
          <ml-input v-else class="w-full" v-model="form.com_name" :readonly="board.readonly || isCheck" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">작성일</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.created_at}}</span>
          <date-selector v-else class="w-full" v-model="form.created_at" :readonly="board.readonly || isCheck" @change="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 ">
        <vs-col class="w-4/12 h-full flex" vs-align="center">재해일</vs-col>
        <vs-col class="w-8/12 flex" vs-align="center">
          <span v-if="isPrint">{{form.accident_date}}</span>
          <date-selector v-else class="w-full" v-model="form.accident_date" :readonly="board.readonly || isCheck" @change="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">산재승인여부</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.accident_approval}}</span>
          <ml-input v-else-if="!isCheck" class="w-full" v-model="form.accident_approval" :readonly="true" />
          <vs-select v-else autocomplete class="w-full" v-model="form.accident_approval">
            <vs-select-item value="미승인" text="미승인"/>
            <vs-select-item value="승인" text="승인"/>
          </vs-select>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">산재승인일</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.accident_approval_date}}</span>
          <ml-input v-else-if="!isCheck" class="w-full" v-model="form.accident_approval_date" :readonly="true" />
          <date-selector v-else class="w-full" v-model="form.accident_approval_date" :readonly="board.readonly" @change="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 ">
        <vs-col class="w-4/12 h-full flex" vs-align="center">재해시간</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.accident_time}}</span>
          <time-selector  v-else class="w-full" v-model="form.accident_time" :readonly="board.readonly || isCheck" @change="onChangeValue" />
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">날씨</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.weather}}</span>
          <ml-input v-else class="w-full" v-model="form.weather" :readonly="board.readonly || isCheck" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

    </vs-row>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import TimeSelector from '@/components/selector/TimeSelector'
export default {
  name: 'AccidentBasicInfo',
  components: {
    TimeSelector,
    DateSelector},
  props: {
    isCheck: Boolean,
    isPrint: Boolean,
    readonly: Boolean,
    value: Object,
    board: Object
  },
  watch: {
    value (value) {
      this.form = value
    }
  },
  data () {
    return {
      // form:{
      //   project_title: '',
      //   com_name: '',
      //   created_at: '',
      //   accident_date: '',
      //   accident_time: '',
      //   accident_approval: ''
      //   accident_approval_date: '',
      //   weather: ''
      // }
      form: this.value
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  async created () {
    const project_id = parseInt(this.$route.params.proj_id)
    await this.$store.dispatch('project/LOAD_PROJECT', {project_id})
    if (!this.form.project_title) {
      this.form.project_title = this.projectInfo.field_name
    }
    if (!this.form.com_name) {
      this.form.com_name = this.board.writer.company_name
    }
    if (!this.form.created_at) {
      this.form.created_at = new Date().format('yyyy-MM-dd')
    }
  },
  methods: {
    onChangeValue () {
      this.$emit('change', this.form)
    },

    comma (str) {
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    }
  }

}
</script>

<style scoped>

</style>
