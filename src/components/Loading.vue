<template>
    <div class="loading-container">
        <img class="bg" src="../images/bg-color.png" alt="bg-color">
        <img class="building" src="../images/building.png" alt="building">
        <img class="car" src="../images/car.png" alt="car">
        <img class="car_shadow" src="../images/car_shadow.png" alt="car_shadow">

        <div class="percent-container">
            <img class="loading-bar" src="../images/loading-bar.png" alt="">
            <span class="percent">{{ percentage }}%</span>
        </div>
        <img class="tip" :src="tipImage" alt="">

        <img class="bottom_logo" src="../images/bottom_logo.png" alt="bottom_logo">

    </div>
</template>
<script>
export default {
    name: "Loading-page",
    data() {
        return {
            percentage: 0,
            tipTimer: null,
            percentTimer: null,
            tipImage: require('../images/loading-step1.png'),
        }
    },
    methods: {
        randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);

                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

                default:
                    return 0;

            }
        }
    },
    mounted() {
        this.tipTimer = window.setInterval(() => {
            this.tipImage = require(`../images/loading-step${this.randomNum(1, 3)}.png`)
        }, 1500)
        this.percentTimer = window.setInterval(() => {
            if (this.percentage > 98) {
                this.percentTimer && window.clearInterval(this.percentTimer)
            } else {
                this.percentage += 1
            }

        }, 50)
    },
    unmounted() {
        this.tipTimer && window.clearInterval(this.tipTimer)
        this.percentTimer && window.clearInterval(this.percentTimer)
    }
}
</script>
<style lang="less" scoped>
.loading-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 999;

    .bg {
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .building {
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        top: 20%;
        width: 60%;
        z-index: 3;
    }

    .car {
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        top: 29%;
        width: 90%;
        z-index: 4;
    }

    .car_shadow {
        position: absolute;
        right: -8%;
        top: 40%;
        width: 66%;
    }

    .bottom_logo {
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 5%;
        width: 58%;
    }

    .percent-container {
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 36%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .loading-bar {
            width: 30%;
        }

        .percent {
            color: #484c59;
            font-size: 24px;
            font-weight: bold;
        }
    }


    .tip {
        width: 90%;
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 31%;
    }
}
</style>
