<template>
  <div class="flex items-center gap-1">
    <img v-if="value" src="@/assets/icons/radio_on.svg" />
    <img v-else src="@/assets/icons/radio_off.svg" />
    <p v-if="!!label" class="flex-1">{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: "PrintRadio",
  props: {
    label: String,
    value: Boolean,
    color: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
