<template>
  <vs-icon v-if="!featherIcon" :icon-pack="iconPack" :icon="icon" />
  <feather-icon
    v-else-if="icon === 'circle-defalut'"
    :class="{ 'w-3 h-3': iconSmall }"
    :icon="icon"
  />
  <img
    v-else-if="icon === 'w-line'"
    src="@/assets/images/icon/icon-horizontal-line-white.svg"
    alt="circle"
    class="mr-3"
  />
  <feather-icon
    v-else-if="!!icon"
    :class="{ 'w-3 h-3': iconSmall }"
    :icon="icon"
  />
  <img
    v-else
    src="@/assets/images/icon/icon-circle-line-white.svg"
    alt="circle"
    class="mr-3"
  />
</template>

<script>
export default {
  props: {
    icon: { type: String, default: "" },
    featherIcon: { type: Boolean, default: true },
    iconSmall: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped></style>
