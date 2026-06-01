<template>
  <div>
    <vs-row class="text-center border-top border-bottom">
      <vs-col class="w-2/12 flex border-right" style="align-items: center; justify-content: center;"> 사용기기 작동 확인
      </vs-col>
      <vs-col class="w-10/12 p-2">
        <div class="flex flex-wrap " style="align-items: center;">
          <div class="flex" style="align-items: center;">
            <span class="mx-2">사용기기명</span>
            <span v-if="isPrint">{{form.deviceName}}</span>
            <ml-input v-else class="mr-2" v-model="form.deviceName" :readonly="readonly"/>
          </div>
          <div class="flex" style="align-items: center;">
            <span class="mx-2">작업담당자</span>
            <span v-if="isPrint">{{form.work_manager}}</span>
            <ml-input v-else v-model="form.work_manager" :readonly="readonly"/>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <vs-row class="text-center border-bottom">
      <vs-col class="w-2/12 flex border-right" style="align-items: center; justify-content: center;">추가 안전요구사항<br>(관리감독자
        작성)
      </vs-col>
      <vs-col class="w-10/12 p-2">
        <div v-if="isPrint">
          <span >{{form.safety_training_contents}}</span>
          <br />
          <span >{{form.etc}}</span>
        </div>
        <div v-else>
          <ml-textarea class="w-full mb-2" rows="5" placeholder="[안전교육내용] OOOO년 OO월 OO일   00:00~00:00(10분간)" v-model="form.safety_training_contents" :readonly="readonly"/>
          <ml-textarea class="w-full m-0" rows="5" placeholder="기타 당부 및 조치사항" v-model="form.etc" :readonly="readonly"/>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'SafetyMeasuresDeviceVerificationAndRequirements',
  props: {
    value: Object,
    isPrint: Boolean,
    readonly: Boolean,
  },
  watch: {
    value (value) {
      this.form = value
    }
  },
  data () {
    return {
      form: this.value
    }
  }
}
</script>

<style scoped>

</style>
