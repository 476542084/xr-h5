<template>
    <div class="car-list">
        <h4 class="title">{{ activeCar.title }}</h4>
        <div class="car-content">
            <div class="version" @click.stop="() => {
                this.openList = !this.openList
            }">
                <span>{{ activeCar.title }} {{ activeCar.version }}</span>
                <i class="icon" :style="openList ? `transform: rotate(180deg);` : 'unset'"><svg width="1em" height="1em"
                        viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0.8);">
                        <path
                            d="M1.222 1.039a.5.5 0 0 1 .707 0l2.18 2.18 2.118-2.117a.5.5 0 0 1 .707 0l.353.353a.5.5 0 0 1 0 .707L4.46 4.991a.5.5 0 0 1-.707 0l-.354-.354a.504.504 0 0 1-.048-.055L.868 2.1a.5.5 0 0 1 0-.707l.354-.354Z"
                            fill="white"></path>
                    </svg></i>
            </div>
            <div class="car-select"
                :style="`opacity: ${openList ? 1 : 0};transform:${openList ? 'scaleY(1)' : 'scaleY(0)'};`">
                <div :class="car.timeLineId === activeCar.timeLineId ? 'car-item active' : 'car-item'"
                    v-for="(car, index) in carList" :key="`car-${index}`" @click.stop="() => {
                            this.onChange(car)
                            this.openList = false
                        }">
                    <span>{{ car.title }} </span>
                    {{ car.version }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['activeCar', 'onChange'],
    name: "Car-Select",
    data() {
        return {
            openList: false,
            carList: [
                { title: '传祺E9', version: 'PRO', timeLineId: 'LC-00000003' },
                { title: '传祺E9', version: 'MAX', timeLineId: 'LC-00000002' },
                { title: '传祺E9', version: '宗师', timeLineId: 'LC-00000001' },

            ],
        }
    },
    methods: {

    },
    mounted() { },
    unmounted() { }
}
</script>
<style lang="less" scoped>
.car-list {
    z-index: 9999;
    width: 120px;
    display: flex;
    flex-flow: column;
    color: #fffffd;
    position: absolute;
    left: 20px;
    top: 20px;
    font-family: YouSheBiaoTiHei;

    .title {
        font-size: 34px;
        // font-weight: bold;
        text-shadow: 2px 2px 4px #443c3c;
    }

    .car-content {
        display: flex;
        flex-flow: column;
        position: relative;

        .version {
            font-size: 17px;
            // font-weight: bold;
            position: relative;
            text-shadow: 2px 2px 4px #443c3c;
        }

        .icon {
            cursor: pointer;
            position: absolute;
            right: -5px;
            top: 1px;
            font-style: normal;
            font-size: 18px;
            // width: 30px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            color: #b0b6bc;
            border-radius: 0 5px 5px 0;
            // background-color: white;
            border-left-color: transparent;
            display: flex;
            align-items: center;

            svg {
                filter: drop-shadow(1px 1px 4px rgb(0 0 0));
            }
        }

        .car-select {
            box-sizing: border-box;
            display: flex;
            flex-flow: column;
            position: absolute;
            z-index: 10;
            top: 100%;
            left: 0;
            width: 100%;
            // border-radius: 5px;
            // background-color: white;
            transform-origin: top;
            border: 1px solid while;
            // bottom: -120px;
            transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            max-height: 200px;
            overflow-y: auto;
            background-color: white;
            // border: 0.5px solid #58595B;
            // box-shadow: -1px 1px 6px #58595B;
            // box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
        }



        .car-item {
            height: 36px;
            line-height: 36px;
            font-size: 17px;
            // text-shadow: 2px 2px 4px #443c3c;
            color: #58595B;
            // text-align: center;
            padding-left: 8px;
        }

        .active {
            color: white;
            background-color: #56a6e4;
        }
    }
}
</style>
