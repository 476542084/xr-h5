<template>
  <div>
    <router-view v-wechat-title="$route.meta.title" />
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}
.grKwLA {
  display: none !important;
}
</style>
