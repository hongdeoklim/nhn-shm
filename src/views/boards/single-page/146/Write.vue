<template>
  <div v-if="!isPrint">
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!-- 사업개요 -->
    <business-info class="mt-5" :fieldId="form.stdInfo.field_id" :is-print="isPrint" @update="updateBusiness" />

    <!-- 발주자 정보 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 발주자 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회사명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputA_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputA_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">주소</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputA_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">전화번호</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputA_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">지정된 담당자</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputA_5 }} </span>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputA_5" class="w-full flex-1"/>
        </div>
      </div>
    </div>

    <!-- 설계자 정보 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 설계자 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회사명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputB_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputB_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">주소</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputB_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">전화번호</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputB_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">설계안전보건대장 담당자</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_5 }} </span>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputB_5" class="w-full flex-1"/>
        </div>
      </div>
    </div>

    <!-- 시공자 정보 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 시공자 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회사명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputC_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputC_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">관리책임자</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputC_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">주소</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputC_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">전화번호</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_5 }} </span>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_5" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">공사안전보건대장 작성 담당자(연락처)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputC_6 }} </span>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputC_6" class="w-full flex-1"/>
        </div>
      </div>
    </div>

    <!-- 건설사업관리기술(감리) 정보 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 건설사업관리기술(감리) 정보</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">회사명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputD_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputD_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">주소</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputD_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">전화번호</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputD_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장 담당자</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputD_5 }} </span>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_5" class="w-full flex-1"/>
        </div>
      </div>
    </div>

    <!-- 공사개요 -->
    <table-custom
      :controls="false"
      :multiple="false"
      :board="board"
      :is-print="isPrint"
      title="공사개요"
      :tableData="[
        { id: 'input1', title: '주요 구조물', type: 'text', placeholder: '' },
        { id: 'input2', title: '구조', type: 'text', placeholder: '' },
        { id: 'input3', title: '개소', type: 'text', placeholder: '' },
        { id: 'input4', title: '최대 굴착 깊이(m)', type: 'number', placeholder: '' },
        { id: 'input5', title: '최고높이(m)', type: 'number', placeholder: '' },
        { id: 'input6', title: '연면적/길이', type: 'text', placeholder: '' },
      ]"
      v-model="form.inputE_1"
      class="mt-4"
    />

    <!-- 관련내용 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 관련내용</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">특수 구조물 개요</div>
          <span v-if="isPrint" class="print-textarea"> {{ form.inputF_1 }} </span>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputF_1" :readonly="board.readonly" placeholder="" />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">내용</div>
          <span v-if="isPrint" class="print-textarea"> {{ form.inputF_2 }} </span>
          <ml-textarea
            v-else
            class="flex-1 w-full"
            rows="5"
            v-model="form.inputF_2"
            :readonly="board.readonly"
            placeholder="□ 공사개요
□ 특수 구조물 개요
□ 주요 공법
2. 설계안전보건대장의 안전·보건조치 이행계획
3. 유해·위험방지계획서 심사 및 확인결과에 대한 조치내용(해당 시 작성)
4. 산업안전보건관리비 변경내역
5. 건설공사 산업재해예방 지도 계약여부, 지도결과 및 조치내용(해당 시 작성)
6. 작성(변경) 일자
7. 작성 및 확인자 등은 관련서식 작성 후 아래와 같이 파일첨부"
          />
        </div>
      </div>
    </div>

    <!-- 설계안전보건대장의 안전·보건조치 이행계획 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="설계안전보건대장의 안전·보건조치 이행계획"
      :tableData="[
        { id: 'input1', width: '40px', title: 'No.', type: 'no', placeholder: '' },
        // 추가 (23.04.21)
         { id: 'input6', title: '공종', type: 'textarea', placeholder: '' },
        { id: 'input2', title: '유해·위험요인', type: 'textarea', placeholder: '' },
        { id: 'input3', title: '위험성 감소대책', type: 'textarea', placeholder: '' },
        { id: 'input4', title: '시공자 이행계획', type: 'textarea', placeholder: '' },
        // 제거 (23.04.21)
        // { id: 'input5', title: '발주자 서명', type: 'sign', placeholder: '' },
      ]"
      v-model="form.inputG_1"
      class="mt-4"
    />
    <div>
      <p style="font-size: 15px; padding: 8px 10px; text-align: end">
        점검기간 : <date-selector v-model="form.inputG_sign.beginDate"/> ~ <date-selector v-model="form.inputG_sign.endDate"/>
      </p>
      <div class="w-full flex" style="align-items: center; justify-content: flex-end;">
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 성명: </p>
        <ml-input :readonly="board.readonly" v-model="form.inputG_sign.name" placeholder="확인자 성명"/>
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 서명: </p>
        <sign-field v-model="form.inputG_sign.sign" :readonly="board.readonly" />
      </div>
    </div>

    <!-- 유해·위험방지계획서 심사 및 확인결과에 대한 조치내용(해당 시 작성) -->
    <div>
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 유해·위험방지계획서 심사 및 확인결과에 대한 조치내용(해당 시 작성)</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">심사결과</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputH_1 }}
          </p>
          <CustomOptionSelector class="flex-1 w-full" :options="['적정', '조건부 적정', '부적정']" placeholder="적정 / 조건부 적정 / 부적정" v-model="form.inputH_1" :readonly="board.readonly" />
        </div>
      </div>
      <table-custom
        title="확인결과"
        titleType="small"
        :board="board"
        :is-print="isPrint"
        :tableData="[
          { id: 'input1', width: '40px', title: 'No.', type: 'no', placeholder: '' },
          { id: 'input2', title: '점검자', type: 'text', placeholder: '' },
          { id: 'input3', title: '점검일', type: 'date', placeholder: '' },
          { id: 'input4', title: '지적사항', type: 'text', placeholder: '' },
          { id: 'input5', title: '조치사항', type: 'text', placeholder: '' },
          // 제거 (23.04.21)
          // { id: 'input6', title: '발주자 서명', type: 'sign', placeholder: '' },
        ]"
        v-model="form.inputH_2"
        style="z-index: 10"
        class="mt-4"
      />
    </div>
    <div>
      <p style="font-size: 15px; padding: 8px 10px; text-align: end">
        점검기간 : <date-selector v-model="form.inputH_sign.beginDate"/> ~ <date-selector v-model="form.inputH_sign.endDate"/>
      </p>
      <div class="w-full flex" style="align-items: center; justify-content: flex-end;">
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 성명: </p>
        <ml-input :readonly="board.readonly" v-model="form.inputH_sign.name" placeholder="확인자 성명"/>
        <p style="font-size: 15px; padding: 8px 10px; text-align: end">확인자 서명: </p>
        <sign-field v-model="form.inputH_sign.sign" :readonly="board.readonly" />
      </div>
    </div>

    <!-- 산업안전보건관리비 변경내역 -->
    <table-custom
      title="산업안전보건관리비 변경내역"
      :board="board"
      :is-print="isPrint"
      :tableData="[
        { id: 'input1', title: '일자', type: 'date', placeholder: '' },
        { id: 'input2', title: '당초 계상금액', type: 'number', placeholder: '' },
        { id: 'input3', title: '변경 계상금액', type: 'number', placeholder: '' },
        { id: 'input4', title: '실행금액', type: 'number', placeholder: '' },
        { id: 'input5', width: '32%', title: '변경사유', type: 'text', placeholder: '' },
      ]"
      v-model="form.inputI_1"
      style="z-index: 9"
      class="mt-4"
    />

    <!-- 건설공사 산업재해예방 지도 계약여부, 지도결과 및 조치내용(해당 시 작성) -->
    <div>
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 건설공사 산업재해예방 지도 계약여부, 지도결과 및 조치내용(해당 시 작성)</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">계약여부</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputJ_1 }}
          </p>
          <CustomOptionSelector class="flex-1 w-full" :options="['대상', '비대상']" placeholder="대상 / 비대상" v-model="form.inputJ_1" :readonly="board.readonly" />
        </div>
      </div>
      <table-custom
        title="지도결과 및 조치내용"
        titleType="small"
        :board="board"
        :is-print="isPrint"
        :tableData="[
          { id: 'input1', title: 'No.', type: 'no', placeholder: '' },
          { id: 'input2', title: '지도자', type: 'text', placeholder: '' },
          { id: 'input3', title: '지도일', type: 'date', placeholder: '' },
          { id: 'input4', width: '32%', title: '지적사항', type: 'text', placeholder: '' },
          { id: 'input5', width: '32%', title: '조치사항', type: 'text', placeholder: '' },
        ]"
        v-model="form.inputJ_2"
        style="z-index: 8"
        class="mt-4"
      />
    </div>

    <!-- 작성(변경) 일자 -->
    <div>
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 작성(변경) 일자</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">작성(변경)일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputK_1 }}
          </p>
          <date-selector class="flex-1 w-full" placeholder="" v-model="form.inputK_1" :readonly="board.readonly" />
        </div>
      </div>
      <table-custom
        title="확인결과"
        titleType="small"
        :board="board"
        :is-print="isPrint"
        :tableData="[
          { id: 'input1', title: 'No.', type: 'no', placeholder: '' },
          { id: 'input2', title: '점검자', type: 'text', placeholder: '' },
          { id: 'input3', title: '점검일', type: 'date', placeholder: '' },
          { id: 'input4', width: '32%', title: '지적사항', type: 'text', placeholder: '' },
          { id: 'input5', width: '32%', title: '조치사항', type: 'text', placeholder: '' },
        ]"
        v-model="form.inputK_2"
        style="z-index: 7"
        class="mt-4"
      />
    </div>

    <!-- 작성자 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 작성자</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputL_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputL_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직위</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputL_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputL_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">자격</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputL_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputL_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputL_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputL_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">서명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputL_5 }} </span>
          <sign-field v-else v-model="form.inputL_5" :readonly="board.readonly" class="w-full flex-1 justify-start" />
        </div>
      </div>
    </div>

    <!-- 확인자 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 확인자</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputM_1 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputM_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직위</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputM_2 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputM_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">자격</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputM_3 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputM_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputM_4 }}
          </p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputM_4" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">서명</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputM_5 }} </span>
          <sign-field v-else v-model="form.inputM_5" :readonly="board.readonly" class="w-full flex-1 justify-start" />
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :readonly="board.readonly" :is-print="isPrint" title="안전보건대장 업로드"> </file-upload-module>
  </div>
  <print v-else :form="form" :board="board" />
</template>

<script>
import Print from "./Print.vue";

import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import BusinessInfo from "@/components/BusinessInfo.vue";
import TableCustom from "@/components/TableCustom.vue";
import CustomOptionSelector from "@/components/selector/CustomOptionSelector.vue";
import SignField from "@/components/SignField";

export default {
  components: {
    Print,
    FieldSelectModule,
    FileUploadModule,
    DateSelector,
    BusinessInfo,
    TableCustom,
    CustomOptionSelector,
    SignField,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.title = value.inputA_2;

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",

        inputC_1: "",
        inputC_2: "",
        inputC_3: "",
        inputC_4: "",
        inputC_5: "",
        inputC_6: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",
        inputD_4: "",
        inputD_5: "",

        inputE_1: [{}, {}, {}],

        inputF_1: "",
        inputF_2: "",

        inputG_1: [],
        inputG_sign: {
          beginDate: '',
          endDate: '',
          sign: '',
          name: '',
        },

        inputH_1: "",
        inputH_2: [],
        inputH_sign: {
          beginDate: '',
          endDate: '',
          sign: '',
          name: '',
        },

        inputI_1: [],

        inputJ_1: "",
        inputJ_2: [],

        inputK_1: "",
        inputK_2: [],

        inputL_1: "",
        inputL_2: "",
        inputL_3: "",
        inputL_4: "",
        inputL_5: "",

        inputM_1: "",
        inputM_2: "",
        inputM_3: "",
        inputM_4: "",
        inputM_5: "",

        fileList: [],
        businessInfo: {},
      },
      selected: [],
      tempId: 0,
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  methods: {
    updateBusiness(value) {
      this.form.businessInfo = value;
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$w-inpu0: 260px;
$w-inpu1: 220px;
$w-inpu2: 140px;

.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-1 {
  background-color: #f9f9f9;
  border-bottom: $border;
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

.text-box {
  line-height: 19px;
  margin-top: 15px;
  border: $border;
}

/* uploaded File */
.form-group {
  border: $border;
  overflow: auto;
  width: 100%;
  /*overflow-x: auto;*/

  &__header {
    height: 80px;
    width: 100%;
    display: flex;

    &-title {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      padding: 7px;
    }

    &-row.row-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }

    &-row.row-w2 {
      min-width: $w-inpu1;
    }
  }
}

.row-w1 {
  min-width: $w-inpu1;
}

.row-w0 {
  min-width: $w-inpu0;
}

.bx {
  border-left: $border;
  border-right: $border;
}

.br {
  border-right: $border;
}

.bb {
  border-bottom: $border;
}

.table ::v-deep {
  .vs-con-tbody {
    background: none !important;
    border: 0 !important;
  }

  thead tr {
    background: #f9f9f9 !important;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }

  tr {
    background: #fff !important;
    border-bottom: solid 1px #cdcdcd;
  }
}
</style>
