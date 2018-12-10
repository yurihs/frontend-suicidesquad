<template>
<p class="hint" v-html="message"></p>
</template>

<script>
export default {
  name: 'hint',
  props: {
    message: String
  }
}
</script>

<style lang="scss" scoped>
.hint {
  font-style: italic;
  color: lighten($text, 15);
}
</style>
