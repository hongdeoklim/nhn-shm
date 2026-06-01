<template>
  <div>
    <!-- ========================================================================================================== -->
    <!-- ================================================ 기본정보 =============================================== -->
    <!-- ========================================================================================================== -->
    <table>
      <tr>
        <td colspan="8" class="gray p-0"><h1 class="py-4">위험성평가 회의록</h1></td>
      </tr>
      <tr>
        <td colspan="1" class="gray">현장명</td>
        <td colspan="3">{{ form.stdInfo.field_name }}</td>
        <td colspan="1" class="gray">구분</td>
        <td colspan="3">{{ form.inputB_1 }}</td>
      </tr>
      <tr>
        <td colspan="1" class="gray">회의일시</td>
        <td colspan="3" class="p-0">
          {{form.inputB_4 | date년월일}}<br>
          ({{form.inputB_8 | dateHHmm}} ~ {{form.inputB_9 | dateHHmm}})
        </td>
        <td colspan="1" class="gray">장소</td>
        <td colspan="3">{{ form.inputB_5 }}</td>
      </tr>
      <tr>
        <td colspan="8" class="p-0">
          <h3 class="bold py-3" style="border-bottom: 1px solid #757575;">참석자 명단</h3>
          <table>
            <tr>
              <td class="p-0" style="width: 50%; padding-right:5px !important; border:none;">
                <table class="attendeeTable">
                  <tbody>
                  <tr>
                    <td class="gray">소속</td>
                    <td class="gray">직책</td>
                    <td class="gray">서명</td>
                  </tr>
                  <tr v-for="index in participantLength" :key="index">
                    <td class="p-0">
                      {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input1 : "" }}
                    </td>
                    <td class="p-0">
                      {{ signatureList(form.participant, index - 1, 'input3') }}
                    </td>
                    <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                      <img class="mx-auto" v-if="!!form.participant[index - 1]" height="50" :src="form.participant[index - 1].input5" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </td>
              <!-- <td style="width: 10px;"></td> -->

              <td class="p-0" style="width: 50%; padding-left:5px !important; border:none;">
                <table class="attendeeTable">
                  <tbody>
                  <tr>
                    <td class="gray">소속</td>
                    <td class="gray">직책</td>
                    <td class="gray">서명</td>
                  </tr>
                  <tr v-for="index in participantLength" :key="index + participantLength">
                    <td class="p-0">
                      {{ !!form.participant[index + participantLength - 1] ? form.participant[index + participantLength - 1].input1 : "" }}
                    </td>
                    <td class="p-0">
                      {{ signatureList(form.participant, index + participantLength - 1, 'input3') }}
                    </td>
                    <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">
                      <img class="mx-auto" v-if="!!form.participant[index + participantLength - 1]" height="50" :src="form.participant[index + participantLength - 1].input5" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="1" class="gray">회의내용</td>
        <td colspan="7"><div class="print-textarea" style="min-height: 300px;">{{form.inputE_1}}</div></td>
      </tr>
      <tr>
        <td colspan="1" class="gray">기타사항</td>
        <td colspan="7"><div class="print-textarea" style="min-height: 140px;">{{form.inputE_2}}</div></td>
      </tr>
<!--      <tr v-if="usePrintPhotoGrid(form.photoListMeeting) > 0 && usePrintPhotoGrid(form.photoListMeeting) <= 2">-->
<!--        <td colspan="1" class="gray">회의 사진</td>-->
<!--        <td colspan="7">-->
<!--          <div>-->
<!--            <photo-upload-grid-module v-model="form.photoListMeeting" :is-print="true" :customTitle="true" placeholder="점검 현장 사진" print-image-height="400px" print-class-type="">-->
<!--              <h4 class="my-4">□ 조치결과 사진대지</h4>-->
<!--            </photo-upload-grid-module>-->
<!--          </div>-->
<!--        </td>-->
<!--      </tr>-->
      <tr v-if="usePrintPhotoGrid(form.photoListMeeting) > 0">
        <td colspan="1" class="gray">회의 사진</td>
        <td colspan="7" style="padding: 0">
          <div class="grid" style="grid-template-columns: 1fr 1fr">
            <div v-for="(photo, index) in form.photoListMeeting">
              <div v-if="index < 2">
                <div :style="index%2===0? 'border-right: 1px solid #757575;':'border-right: 1px solid #ffffff;'">
                  <img :src="photo.path" :alt="photo.fileName" class="w-full p-1" style="height: 322px;"/>
                  <div class="flex" style="border-top: 1px solid #757575; border-bottom: 1px solid #757575;">
                    <p style="width: 100px; padding: 5px; border-right: 1px solid #757575;">내용</p>
                    <p class="w-full p-1" style="align-self: center;text-align: left;">{{photo.input}}</p>
                  </div>
                </div>

                <div v-if="form.photoListMeeting.length%2===1"></div>
              </div>
            </div>
          </div>

        </td>
      </tr>
    </table>

    <table v-if="usePrintPhotoGrid(form.photoListMeeting) > 2"
           class="pageBreak mt-2">
      <tr>
        <td colspan="1" class="gray">회의 사진</td>
<!--        <td colspan="7">-->
<!--          <div class="print-break-page">-->
<!--            <photo-upload-grid-module v-model="form.photoListMeeting" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">-->
<!--              <h4 class="my-4">□ 조치결과 사진대지</h4>-->
<!--            </photo-upload-grid-module>-->
<!--          </div>-->
<!--        </td>-->
        <td colspan="7" style="padding: 0">
          <div class="grid print-break-page" style="grid-template-columns: 1fr 1fr">
            <div v-for="(photo, index) in form.photoListMeeting">
              <div v-if="index >= 2">
                <div :style="index%2===0? 'border-right: 1px solid #757575;':'border-right: 1px solid #ffffff;'">
                  <img :src="photo.path" :alt="photo.fileName" class="w-full p-1" style="height: 322px;"/>
                  <div class="flex" style="border-top: 1px solid #757575; border-bottom: 1px solid #757575;">
                    <p style="width: 100px; padding: 5px; border-right: 1px solid #757575;">내용</p>
                    <p class="w-full p-1" style="align-self: center;text-align: left;">{{photo.input}}</p>
                  </div>
                </div>

                <div v-if="form.photoListMeeting.length%2===1"></div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>


<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ================================================ 협의체 정보 =============================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    <div class="print-container">-->
<!--      <h4 class="mt-12 mb-4">□ 협의체 정보</h4>-->
<!--      <table style="margin-top: -1px">-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">평가차수</td>-->
<!--          <td colspan="2">{{ form.inputB_1 }}</td>-->
<!--          <td colspan="1" class="gray">평가기간</td>-->
<!--          <td colspan="5">{{ form.inputB_2 }} ~ {{ form.inputB_3 }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">회의일</td>-->
<!--          <td colspan="2">{{ form.inputB_4 }}</td>-->
<!--          <td colspan="1" class="gray">회의장소</td>-->
<!--          <td colspan="2">{{ form.inputB_5 }}</td>-->
<!--          <td colspan="1" class="gray">참석인원</td>-->
<!--          <td colspan="2">{{ form.inputB_6 }}</td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->

<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ================================================ 협의 내용 =============================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    <div>-->
<!--      <h4 class="mt-12  mb-4">□ 협의내용</h4>-->
<!--      <table style="margin-top: -1px">-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">협력업체 건의사항<br />(근로자 의견)</td>-->
<!--          <td colspan="8"><p class="print-textarea no-block">{{ form.inputC_1 }}</p></td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">전달사항<br />(경영자 의견)</td>-->
<!--          <td colspan="8"><p class="print-textarea no-block">{{ form.inputC_2 }}</p></td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->

<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ================================================ 이전 회차 FEED BACK =============================================== &ndash;&gt;-->
<!--    &lt;!&ndash; ========================================================================================================== &ndash;&gt;-->
<!--    <div >-->
<!--      <h4 class="mt-12  mb-4">□ 이전 회차 FEED BACK</h4>-->
<!--      <table style="margin-top: -1px">-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">양호사항<br />(전회 우수사례)</td>-->
<!--          <td colspan="8"><p class="print-textarea no-block">{{ form.inputD_1 }}</p></td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">불량사항<br />(전회 미결사항)</td>-->
<!--          <td colspan="8"><p class="print-textarea no-block">{{ form.inputD_2 }}</p></td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td colspan="1" class="gray">추가 위험요인</td>-->
<!--          <td colspan="8"><p class="print-textarea no-block">{{ form.inputD_3 }}</p></td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->

    <!-- ========================================================================================================== -->
    <!-- ================================================ 참석자 명단 =============================================== -->
    <!-- ========================================================================================================== -->
<!--    <div class="print-break-page">-->
<!--      <h4 class="text-center underline mb-4">위험성평가 회의 참석자 명단</h4>-->
<!--      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">-->
<!--        <div class="col-span-6 flex items-start">-->
<!--          <div class="label-text h-full" style="width: 120px; display:flex; align-items: center;">평가차수</div>-->
<!--          <span class="print-input"> {{ form.inputB_1 }} </span>-->
<!--        </div>-->
<!--        <div class="col-span-6 flex items-start">-->
<!--          <div class="label-text h-full" style="width: 120px; display:flex; align-items: center;">회의일</div>-->
<!--          <span class="print-input"> {{ form.inputB_4 }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <table class="pageBreak">-->
<!--        <tr>-->
<!--          <td style="width: 50%; padding-right: 5px; border:none;">-->
<!--            <table class="attendeeTable">-->
<!--              <tbody>-->
<!--              <tr>-->
<!--                <td class="titleCell gray">No.</td>-->
<!--                <td class="titleCell gray">소속</td>-->
<!--                <td class="titleCell gray">직급</td>-->
<!--                <td class="titleCell gray">직책</td>-->
<!--                <td class="titleCell gray">이름</td>-->
<!--                <td class="titleCell gray">서명</td>-->
<!--                <td class="titleCell gray">비고</td>-->
<!--              </tr>-->
<!--              <tr v-for="index in 20" :key="index">-->
<!--                <td class="gray">{{ index }}</td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input1 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px;  line-height: 14px; ">-->
<!--                  {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input2 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px;  line-height: 14px; ">-->
<!--                  {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input3 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px;  line-height: 14px; ">-->
<!--                  {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input4 : "" }}-->
<!--                </td>-->
<!--                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px; max-height: 60px;">-->
<!--                  <img v-if="!!form.participant[index - 1]" height="50" :src="form.participant[index - 1].input5" />-->
<!--                </td>-->
<!--                <td style="font-size:14px;  line-height: 14px; ">-->
<!--                  {{ typeof form.participant[index - 1] !== "undefined" ? form.participant[index - 1].input6 : "" }}-->
<!--                </td>-->
<!--              </tr>-->
<!--              </tbody>-->
<!--            </table>-->
<!--          </td>-->
<!--          &lt;!&ndash; <td style="width: 10px;"></td> &ndash;&gt;-->
<!--          <td style="width: 50%; padding-left: 5px; border:none;">-->
<!--            <table class="attendeeTable">-->
<!--              <tbody>-->
<!--              <tr>-->
<!--                <td class="titleCell gray">No.</td>-->
<!--                <td class="titleCell gray">소속</td>-->
<!--                <td class="titleCell gray">직급</td>-->
<!--                <td class="titleCell gray">직책</td>-->
<!--                <td class="titleCell gray">이름</td>-->
<!--                <td class="titleCell gray">서명</td>-->
<!--                <td class="titleCell gray">비고</td>-->
<!--              </tr>-->
<!--              <tr v-for="index in 20" :key="index + 20">-->
<!--                <td class="gray">{{ index + 20 }}</td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ !!form.participant[index + 20 - 1] ? form.participant[index + 20 - 1].input1 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ !!form.participant[index + 20 - 1] ? form.participant[index + 20 - 1].input2 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ !!form.participant[index + 20 - 1] ? form.participant[index + 20 - 1].input3 : "" }}-->
<!--                </td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ !!form.participant[index + 20 - 1] ? form.participant[index + 20 - 1].input4 : "" }}-->
<!--                </td>-->
<!--                <td style="width: 1%; white-space: nowrap; min-width: 90px; padding: 2px">-->
<!--                  <img v-if="!!form.participant[index + 20 - 1]" height="50" :src="form.participant[index + 20 - 1].input5" />-->
<!--                </td>-->
<!--                <td style="font-size:14px; line-height: 14px; ">-->
<!--                  {{ !!form.participant[index + 20 - 1] ? form.participant[index + 20 - 1].input6 : "" }}-->
<!--                </td>-->
<!--              </tr>-->
<!--              </tbody>-->
<!--            </table>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->

    <!-- ========================================================================================================== -->
    <!-- ================================================ □ 참석자 사진대지 =============================================== -->
    <!-- ========================================================================================================== -->
<!--    <div v-if="usePrintPhotoGrid(form.photoListParticipant)" class="print-break-page">-->
<!--      <photo-upload-grid-module v-model="form.photoListParticipant" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">-->
<!--        <template #customTitle>-->
<!--          <h4 class="my-4">□ 참석자 사진대지</h4>-->
<!--        </template>-->
<!--      </photo-upload-grid-module>-->
<!--    </div>-->

    <!-- ========================================================================================================== -->
    <!-- ================================================ □ 조치결과 사진대지 =============================================== -->
    <!-- ========================================================================================================== -->
<!--    <div v-if="usePrintPhotoGrid(form.photoListResult)" class="print-break-page">-->
<!--      <photo-upload-grid-module v-model="form.photoListResult" :is-print="true" :customTitle="true" section-title="사진대지" placeholder="점검 현장 사진">-->
<!--        <h4 class="my-4">□ 조치결과 사진대지</h4>-->
<!--      </photo-upload-grid-module>-->
<!--    </div>-->
  </div>
</template>

<script>
import PrintRadio from "@/components/print/PrintRadio.vue";
import TableInspectDouble from "@/components/TableInspectDouble.vue";
export default {
  components: { PrintRadio, TableInspectDouble },
  props: {
    form: Object,
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    date년월일(val) {
      try{
        return new Date(val).format('yyyy년 MM월 dd일')
      } catch (e) {
        return '　　년　　월　　일'
      }
    },
    dateHHmm (val) {
      try {
        return new Date(`2000-01-01 ${val}`).format('HH:mm')
      } catch (e) {
        return val
      }
    }
  },
  computed: {
    participantLength () {
      try {
        if (this.form && this.form.participant && this.form.participant.length / 2 > 5) {
          return Math.floor((this.form.participant.length + 1) / 2);
        }
      } catch (e) {
        return 5;
      }
      return 5;
    }
  },
  methods: {
    signatureList(list, index, key) {
      if (list.length === 0) return ''
      const data = list[index]
      if (data) {
        return data[`${key}_${data[key]}`] ? data[`${key}_${data[key]}`] : data[key];
      }
      return ''
    },
    usePrintPhotoGrid (list) {
      let length = 0;
      if ( list && list.length > 0) {
        for (const item of list) {
          if (item.id) {
            length++;
          }
        }
      }
      return length
    },
  }
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
$approval-border: 2px solid #cdcdcd;
$title-bg-color: #f9f9f9;
h1 {
  font-weight: 700;
  font-size: 32px;
  line-height: 46px;
  text-align: center;
  padding: 25px 0px;
}

h4 {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 35px;
}

img {
  max-width: 100%;
}

img.check {
  margin: auto;
  margin-top: -1px;
}

.before-label {
  display: list-item;
  list-style-type: "·";
  padding-left: 6px;
  margin-left: 6px;
}

table.sign {
  td {
    padding: 10px 8px;
  }
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  td {
    font-size: 18px;
    line-height: 26px;
    text-align: center;
    border: 1px solid #757575;
    padding: 16px 8px;
    word-break: keep-all;

    max-height: 60px;

    box-sizing: border-box !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  td.gray {
    font-weight: 500;
    background: #f0f0f0;
  }

  td > div.print-textarea {
    min-height: 0;
    text-align: left !important;
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}

.print-textarea {
  white-space: pre;
}


.contentTable {
  td {
    border: none;
    padding: 19px 14px;
  }
  .titleCell {
    width: 180px;
    padding: 19px 0;
    font-size: 14px;
    font-weight: 500;
  }
}

.attendeeTable {
  td {
    height: 60px;
    border: 1px solid $border-color;
    text-align: center;
  }
}

.pageBreak {
  page-break-after: always;
}
</style>
