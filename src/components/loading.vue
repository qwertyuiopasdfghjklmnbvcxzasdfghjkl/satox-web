<template>
  <div class="loading">
    <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.0" :width="`${size}px`" :height="`${size}px`" viewBox="0 0 128 128" xml:space="preserve">
      <g>
        <circle cx="16" cy="64" r="16" fill="#BA8D35" fill-opacity="1" />
        <circle cx="16" cy="64" r="14.344" fill="#BA8D35" fill-opacity="1" transform="rotate(45 64 64)" />
        <circle cx="16" cy="64" r="12.531" fill="#BA8D35" fill-opacity="1" transform="rotate(90 64 64)" />
        <circle cx="16" cy="64" r="10.75" fill="#BA8D35" fill-opacity="1" transform="rotate(135 64 64)" />
        <circle cx="16" cy="64" r="10.063" fill="#BA8D35" fill-opacity="1" transform="rotate(180 64 64)" />
        <circle cx="16" cy="64" r="8.063" fill="#BA8D35" fill-opacity="1" transform="rotate(225 64 64)" />
        <circle cx="16" cy="64" r="6.438" fill="#BA8D35" fill-opacity="1" transform="rotate(270 64 64)" />
        <circle cx="16" cy="64" r="5.375" fill="#BA8D35" fill-opacity="1" transform="rotate(315 64 64)" />
        <animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64"
          calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 64
    }
  }
}
</script>

<style scoped>
.loading{padding-top: 28px;padding-bottom: 28px;line-height: 0;text-align: center;}
</style>
