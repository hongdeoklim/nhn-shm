<template>
  <div class="flex items-center gap-1">
    <img v-if="value && color" src="@/assets/icons/checked_color_on.svg" class="check" />
    <img v-else-if="value" src="@/assets/icons/checked_on.svg" class="check" />
    <img v-else src="@/assets/icons/checked_off.svg" class="check" />
    <p v-if="!!label" class="flex-1">{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: "PrintCheckbox",
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
