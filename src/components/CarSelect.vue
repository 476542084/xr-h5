<template>
    <div class="car-list">
        <h4 class="title">{{ activeCar.title }}</h4>
        <div class="car-content">
            <div class="version" @click.stop="() => {
                this.openList = !this.openList
            }">
                <span>{{ activeCar.version }}</span>
                <i class="icon" :style="openList ? `transform: rotate(180deg);` : 'unset'"><svg width="1em" height="1em"
                        viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0.8);">
                        <path
                            d="M1.222 1.039a.5.5 0 0 1 .707 0l2.18 2.18 2.118-2.117a.5.5 0 0 1 .707 0l.353.353a.5.5 0 0 1 0 .707L4.46 4.991a.5.5 0 0 1-.707 0l-.354-.354a.504.504 0 0 1-.048-.055L.868 2.1a.5.5 0 0 1 0-.707l.354-.354Z"
                            fill="#919499"></path>
                    </svg></i>
            </div>
            <div class="car-select"
                :style="`opacity: ${openList ? 1 : 0};transform:${openList ? 'scaleY(1)' : 'scaleY(0)'};`">
                <div class="car-item" v-for="(car, index) in carList" :key="`car-${index}`" @click.stop="() => {
                        this.onChange(car)
                        this.openList = false
                    }">
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
                { title: 'E9', version: '宗师', timeLineId: 'LC-00000001' },
                { title: 'E9', version: '顶配版', timeLineId: 'LC-00000002' },
                { title: 'E9', version: '高配版', timeLineId: 'LC-00000003' }
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
    width: 80px;
    display: flex;
    flex-flow: column;
    color: #fffffd;
    position: absolute;
    left: 20px;
    top: 20px;

    .title {
        font-size: 36px;
        font-weight: bold;
        text-shadow: 2px 2px 4px #443c3c;
    }

    .car-content {
        display: flex;
        flex-flow: column;
        position: relative;

        .version {
            font-size: 20px;
            font-weight: bold;
            position: relative;
            text-shadow: 2px 2px 4px #443c3c;
        }

        .icon {
            cursor: pointer;
            position: absolute;
            right: -1px;
            top: -1px;
            font-style: normal;
            font-size: 18px;
            // width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #b0b6bc;
            border-radius: 0 5px 5px 0;
            // background-color: white;
            border-left-color: transparent;
            display: flex;
            align-items: center;
        }

        .car-select {
            display: flex;
            flex-flow: column;
            position: absolute;
            z-index: 10;
            top: '100%';
            left: 0;
            width: 100%;
            border-radius: 5px;
            background-color: white;
            transform-origin: top;
            border: 1px solid while;
            bottom: -120px;
            transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            padding: 5px 0;
            max-height: 200px;
            overflow-y: auto;
        }

        .car-item {
            height: 36px;
            line-height: 36px;
            text-shadow: 2px 2px 4px #443c3c;
        }
    }
}
</style>
