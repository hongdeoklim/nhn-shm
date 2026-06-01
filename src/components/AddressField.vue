<template>
  <div>
    <div class="grid" style="grid-template-columns: 1fr auto; column-gap: 8px;" @click.stop="onClickInput">
      <ml-input class="w-full" readonly v-model="form.home_address_1" placeholder="주소선택" :disabled="disabled" />
      <ml-input style="width: 80px;" readonly placeholder="우편번호" v-model="form.home_zip" :disabled="disabled" />
    </div>
    <ml-input v-if="form.home_address_1" class="w-full pt-4" v-model="form.home_address_2" placeholder="상세주소 입력"/>

    <!-- 다음우편번호 -->
    <vs-popup id="postcodePopup" :title="postcode.title" :active.sync="postcode.active">
      <vue-daum-postcode @complete="handlePostcodeComplete" />
    </vs-popup>
  </div>
</template>

<script>
import { VueDaumPostcode } from 'vue-daum-postcode'
export default {
  name: 'AddressField',
  components: {
    VueDaumPostcode,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          home_zip: '',
          home_address_1: '',
          home_address_2: '',
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.form.home_zip = value.home_zip
          this.form.home_address_1 = value.home_address_1
          this.form.home_address_2 = value.home_address_2
        }
      }
    }
  },
  data () {
    return {
      form: {
        home_zip: '',
        home_address_1: '',
        home_address_2: '',
      },
      postcode:{
        active:false,
        title:'우편번호 검색'
      },
    }
  },
  methods: {
    onClickInput() {
      if (this.disabled) return;

      this.postcode.active = true;
    },
    handlePostcodeComplete (data) {
      // 도로명(R), 지번(J)
      const userSelectedType = data.userSelectedType

      // 우편번호
      const zonecode = data.zonecode

      // 주소
      let address1 = data.roadAddress
      if (userSelectedType === 'J') {
        address1 = data.jibunAddress
      }

      // 자택주소
      if (this.postcode.active) {
        this.form.home_zip = zonecode
        this.form.home_address_1 = address1

        this.$emit("input", this.form)
        this.postcode.active = false
      }

    },
  }
}
</script>

<style>
#postcodePopup {z-index:60000;}
#postcodePopup .vue-daum-postcode-container {height:450px !important;}

[dir] .con-input-upload {
  margin: 0;
}
[dir] .con-img-upload {
  padding:0;
}
</style>
