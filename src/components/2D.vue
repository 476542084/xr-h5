<template>
    <div class="cloudimage-360" id="gurkha-suv" data-index-zero-base="4" data-folder="./360/"
        data-filename-x="car_{index}.jpg" data-amount-x="36"></div>
</template>
<script>

export default {
    name: "two-d-page",
    data() {
        return {

        }
    },
    methods: {},
    mounted() {
        window.CI360.init();
    },

}
</script>
<style lang="less" >
.cloudimage-360 {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 100vw;
    height: 100vh;
    z-index: 9999;

    .cloudimage-360-inner-box {
        width: 100vw;
        height: 100vh;
    }

    canvas {
        object-fit: cover;
        width: 100vw !important;
        height: 100vh !important;
    }
}
</style>
