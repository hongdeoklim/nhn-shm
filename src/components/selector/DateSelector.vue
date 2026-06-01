<template>
  <vc-date-picker class="inline-block" v-model="computedDate" :masks="masks" :disabled="readonly"
                  :max-date="computedMaxDate" :min-date="computedMinDate">
    <template v-slot="{ inputValue, togglePopover }">
      <div class="flex items-center relative">
        <vs-input class="w-full" :value="computedDate" @click="!readonly ? togglePopover({ placement: 'auto-start' }) : temp()" readonly :placeholder="placeholder" :class="!readonly && 'none-readonly-input'" />
        <vs-icon
          v-if="!readonly && !inputValue && useIcon"
          icon-pack="feather"
          icon="icon-calendar"
          style="margin-top: 6px; margin-bottom: 6px; margin-right: 1px; padding-left: 6px; padding-right: 6px; position: absolute; top: 0; right: 0; bottom: 0; font-size: 24px; border-left: 1px solid #cdcdcd; background-color: #fff"
          class="cursor-pointer"
          @click="!readonly ? togglePopover({ placement: 'auto-start' }) : temp()"
        ></vs-icon>
        <vs-icon
          v-if="!readonly && inputValue && useIcon"
          icon-pack="feather"
          icon="icon-x"
          style="margin-top: 6px; margin-bottom: 6px; margin-right: 1px; padding-left: 6px; padding-right: 6px; position: absolute; top: 0; right: 0; bottom: 0; font-size: 24px; border-left: 1px solid #cdcdcd; background-color: #fff"
          class="cursor-pointer"
          @click="!readonly && clickXIcon()"
        ></vs-icon>
      </div>
    </template>
  </vc-date-picker>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";

export default {
  name: "DateSelector",
  components: {
    Datepicker,
  },
  props: {
    value: { type: String, default: "" },
    division: { type: String, default: "-" },
    format: { type: String, default: "YYYY-MM-DD" },
    minimumView: { type: String, default: "day" },
    maximumView: { type: String, default: "year" },
    minDate: { type: [Date, String], default: () => null },
    maxDate: { type: [Date, String], default: null },
    readonly: Boolean,
    useIcon: { type: Boolean, default: true },
    placeholder: String,
  },
  watch: {
    value(data) {
      this.computedDate = data;
    },
  },
  computed: {
    computedDate: {
      get() {
        return this.value.trim();
      },
      set(newValue) {
        this.$emit("input", new Date(newValue).format("yyyy-MM-dd"));
        this.$emit("change", newValue);
      },
    },
    computedMinDate() {
      if (this.minDate) {
        return new Date(this.minDate);
      }
      return null;
    },
    computedMaxDate() {
      if (this.maxDate) {
        return new Date(this.maxDate);
      }
      return null;
    },
  },

  data() {
    return {
      languages: lang,
      date: "",
      masks: {
        input: this.format,
        title: "YYYY년 MMMM"
      },
    };
  },

  created() {
    // this.date = new Date(this.value)
    // this.div = this.division
  },

  methods: {
    // updateDate (/*data*/) {
    //   this.$emit('input', new Date(this.date).format('yyyy-MM-dd'))
    //   this.$emit('change', this.date)
    // },
    temp() {},
    clickXIcon() {
      this.computedDate = "";
      // this.$emit("input", "");
      // this.$emit("change", "");
    },
  },
};
</script>

<style scoped>
.right-icon {
  font-size: 24px;
  padding: 6px;
}
</style>
<style>
.vc-popover-content-wrapper.is-interactive {
  z-index: 402;
}
</style>

<style lang="scss" scoped>
.none-readonly-input::v-deep {
  input {
    background: white;
  }
}
</style>
