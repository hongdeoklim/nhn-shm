<template>
  <div>
    <label style="display: flex; position: relative; align-items: center">
      <ml-input class="w-full h-full member-selector" style="border-radius: 5px; background-color:#fff;" :value="(selectMember ) ? selectMember.name : ''"
                @click="handleClickInput" :readonly="true"/>
      <vs-icon icon-pack="feather" icon="icon-user"
               style="padding-left:6px; padding-right:6px; position: absolute; top:auto; right:0; bottom:auto; font-size:24px; border-left: 1px solid #cdcdcd;"
      ></vs-icon>
    </label>
    <popup-search-member v-model="showPopup" :selectId="(selectMember) ? selectMember.id : 0"
                         @handleClickSelect="handleClickSelect"/>
  </div>
</template>

<script>
import PopupSearchMember from '@/popup/PopupSearchMember'

export default {
  name: 'MemberSelector',
  components: {PopupSearchMember},
  props: {
    value: [Number, String],
    readonly:Boolean,
  },
  watch: {
    value (data) {
      this.value = data
    }
  },
  computed: {
    selectMember () {
      const list = this.$store.state.member.listAll
      for (const member of list) {
        if (member.id === this.value) {
          return member
        }
      }
    }
  },
  data () {
    return {
      showPopup: false
    }
  },

  methods: {

    handleClickInput () {
      if (!this.readonly) {
        this.showPopup = true
      }
    },

    handleClickSelect (member) {
      this.$emit('input', member.id)
      this.$emit('select', member)
    }
  }
}
</script>

<style>
.member-selector input[readonly='readonly'] {
  background-color: #fff;
}
</style>
