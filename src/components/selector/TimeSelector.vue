<template>
  <label style="display: flex; position: relative">
    <flat-pickr
      class="w-full h-full"
      :class="[readonly ? 'readonly' : 'none-readonly']"
      :config="configDateTimePicker"
      v-model="time"
      placeholder=""
      style="padding: 0.7rem; padding-right: 40px; border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.2)"
      :readonly="readonly"
      :disabled="readonly"
      @change="change"
    />
    <vs-icon
      icon-pack="feather"
      icon="icon-clock"
      style="display: flex; align-items: center; margin-top: 6px; margin-bottom: 6px; padding-left: 6px; padding-right: 6px; position: absolute; top: 0; right: 0; bottom: 0; font-size: 24px; border-left: 1px solid #cdcdcd"
    ></vs-icon>
  </label>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  name: "TimeSelector",
  components: {
    flatPickr,
  },
  props: {
    readonly: Boolean,
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(data) {
      this.time = data;
    },
    time(data) {
      this.$emit("input", data);
    },
  },
  data() {
    return {
      time: this.value,
      configDateTimePicker: {
        enableTime: true,
        enableSeconds: true,
        noCalendar: true,
      },
    };
  },
  methods: {
    change(/*data*/) {},
  },
};
</script>

<style>
input[type="time"]::-webkit-calendar-picker-indicator {
  background: none;
}

.readonly {
  background-color: #fafafa !important;
}
.none-readonly {
  background-color: white !important;
}
</style>
