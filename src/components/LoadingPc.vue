<template>
    <div class="loading-container">
        <img class="bg" alt="bg" src="../images/pc/bg.jpg">
        <img id="car-frame" :src="frame_bg" alt="car">

        <div class="percent-container">
            <img class="loading-bar" src="../images/loading-bar.png" alt="">
            <span class="percent">&nbsp;{{ percentage }}%</span>
        </div>
        <img class="tip" :src="tipImage" alt="">
    </div>
</template>
<script>
const imgCount = 90
const delay = 3000 / imgCount
export default {
    name: "Loading-page",
    data() {
        return {
            percentage: 0,
            tipTimer: null,
            percentTimer: null,
            tipImage: require('../images/loading-step1.png'),
            frame_bg: ''
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
        const img = document.querySelector("#car-frame")
        const animation = (i) => {
            if (i === imgCount) {
                animation(0)
                return
            }
            const num = i.toString().padStart(5, '0')
            this.frame_bg = require(`../images/pc/loading/loading${num}.png`)
            img.onload = () => {
                setTimeout(() => {
                    animation(i + 1)
                }, delay);
            }
        }
        animation(0)

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

    #car-frame {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        width: 40%;
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
        font-family: YouSheBiaoTiHei;
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 12%;
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;

        .loading-bar {
            width: 30%;
        }

        .percent {
            color: #484c59;
            font-size: 30px;
            font-weight: bold;
        }
    }


    .tip {
        width: 25%;
        position: absolute;
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 5%;
    }
}
</style>
