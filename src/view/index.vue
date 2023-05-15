<template>
  <div class="apps">
    <div class="screen-c" :id="box">
      <div v-if="flag" class="mistake">{{ code }}</div>
      <Loading v-if="showLoading" />

      <ButtomMenu v-if="enter" :isMiniprogram="isMiniprogram" :goodId="193" :activityId="240" />

      <!-- car select list -->
      <CarSelect v-if="showCarSelect" :activeCar="activeCar" :onChange="handerCarChange" />

      <!-- music play -->
      <img :class="isPlaying ? 'musicIcon musicIcon-active' : 'musicIcon'" v-if="showMusicIcon"
        @click.stop="toggleMusicPlay()" src="../images/icon/music.png" alt="music" />

      <audio id="bg-audio" :src="mp3Url">…</audio>

      <!-- back -->
      <img class="backIcon" v-if="showBackIcon" @click.stop="handlerBack()" src="../images/icon/back.png" alt="music" />
    </div>
  </div>
</template>
<script>
import CarSelect from "@/components/CarSelect.vue";
import ButtomMenu from "@/components/ButtomMenu.vue";
import Loading from "@/components/Loading.vue";
import Gacrender from "../utils/Gacrender1.0.6.js";
import qs from "qs";
import { timeLineIdMapNum } from "@/utils/map";
export default {
  components: { ButtomMenu, Loading, CarSelect },
  name: "ViEw",
  data() {
    return {
      mp3Url: `${process.env.VUE_APP_webAddress}/material/bg.mp3`,
      activeCar: {
        title: "传祺E9",
        version: "宗师",
        timeLineId: "LC-00000001",
      },
      isMiniprogram: navigator.userAgent.includes("miniProgram"),
      params: null,
      showLoading: true,
      enter: false,
      flag: false,
      audio: HTMLAudioElement,
      isPlaying: false,
      showCarSelect: false,
      showBackIcon: false,
      showMusicIcon: false,
      obj: null,

      code: "--",
      box: "box",
      stat: true,
      percentage: 0,
      customColor: "#E50120",
      showItem: true,
      deploy: "2",
      souceType: "APP_01",
      ueMode: "UEMODE_01",
      screenShow: "VSCREEN",
      ueSelector: "ON",
      carlist: [
        "LC-00000001",
        "LC-00000002",
        "LC-00000003",
        "LC-00000004",
        "LC-00000005",
      ],
      melist: ["UEMODE_01", "UEMODE_02", "UEMODE_03"],
      deploylist: ["1", "2"],
      screenShowlist: ["HSCREEN", "VSCREEN"],
      ueSelectorlist: ["ON", "OFF"],
      souceTypelist: ["APP_01", "APP_02", "APP_03", "APP_00"],
    };
  },
  mounted() {
    window.handlerEnter = this.handlerEnter;
    this.audio = document.getElementById("bg-audio");
    if (this.audio) {
      this.audio.onplaying = () => (this.isPlaying = true);
      this.audio.onpause = () => (this.isPlaying = false);
    }
    setTimeout(() => {
      document.title = "广汽传祺 E9";
    }, 100);
    this.getUrlParam();
    let that = this
    window.addEventListener(
      "message",
      function (e) {
        // 监听返回值
        // 操作成功与否
        // console.log('UE4实例返回信息:', e.data.code)
        console.log("UE4实例返回信息:", e.data);
        // 监听返回值
        if (e.data.code !== 200) {
          if (
            e.data.code == "4000" ||
            e.data.code == "4001" ||
            e.data.code == "4002"
          ) {
            this.flag = true;
            this.code = "6003:时间线ID无效";
          } else if (
            (e.data.code > 600 && e.data.code < 700) ||
            e.data.code == "705"
          ) {
            this.flag = true;
            this.code = "6004:无效UE实例请求秘钥,认证失败 ";
          } else if (
            e.data.code == "5000" ||
            e.data.code == "404" ||
            e.data.code == "1018" ||
            e.data.code == "1019"
          ) {
            this.flag = true;
            this.code = "6005:资源繁忙,请稍后重试";
          } else if (e.data.code == "运行失败") {
            this.flag = true;
            this.code = "运行失败";
          } else if (e.data.code == "7002") {
            console.log("e.data.code", e.data.code);
            //初始化画面
            window.handlerEnter();
          } else if (e.data.code == "200") {
            if (e.data.reqTimeLineId === "GETS-00000008") {
              try {
                if (e.data.responseData && e.data.responseData.length) {
                  console.log(
                    "curLevel:",
                    e.data.responseData[0].data[0].curLevel
                  );
                  if (e.data.responseData[0].data[0].curLevel > 1) {
                    window.app.ueBack();
                  }
                }
              } catch (error) {
                console.error(error);
              }
            }

            if (e.data.reqTimeLineId === "GETS-00000001") {
              try {
                if (e.data.responseData && e.data.responseData.length) {
                  console.log("getStatus:", e.data.responseData[0].data);
                  const carStatus = e.data.responseData[0].data
                  window.carStatus = carStatus
                  //window.carStatus
                  if (Array.isArray(carStatus) && carStatus.length) {
                    carStatus.forEach((status) => {
                      const num = timeLineIdMapNum.get(status.timeLineId)
                      console.log('num', num, status.timeLineId)
                      if (num) {
                        window.optionMap = !window.optionMap ? num : `${window.optionMap},${num}`
                      }
                    })
                  }

                  const obj = e.data.responseData[0].data;
                  // this.obj = e.data.responseData[0].data
                  window.app.selectModel(
                    window.activeCar.timeLineId,
                    obj,
                    "click"
                  );
                }
              } catch (error) {
                console.error(error);
              }
            }

            if (e.data.method === "getUELocation") {
              try {
                if (e.data.location === 'AT3DPLAY' || e.data.location === 'ATVIDEOPLAY') {
                  //隐藏导航栏
                  that.enter = false
                  that.showCarSelect = false
                  that.showMusicIcon = false
                  that.showBackIcon = false
                } else {
                  that.enter = true
                  that.showCarSelect = true
                  that.showMusicIcon = true
                  that.showBackIcon = true
                }
              } catch (error) {
                console.error(error);
              }
            }

            //初始化画面
          }
          // else {
          //   this.flag = true
          //   this.code = "6006:系统异常,请联系管理员"
          // }
        } else {
          console.log("interaction");
          //接口UE4服务器推送的消息
          window.connection.event.interaction.on((msg) => {
            console.log("主页面收到应用发来的消息:", msg);
          });
        }
      },
      false
    );
  },
  methods: {
    handlerEnter() {
      this.showLoading = false;
      this.enter = true;
      this.showCarSelect = true;
      this.showBackIcon = true;
      this.showMusicIcon = true;
    },

    handlerInitialization() {
      this.showLoading = true;
      this.enter = false;
      this.showCarSelect = false;
      this.showBackIcon = false;
      this.showMusicIcon = false;
    },
    handerCarChange(car) {
      if (car.timeLineId !== this.activeCar.timeLineId) {
        try {
          window.activeCar = car;
          this.activeCar = car;
          // this.handlerInitialization()
          // window.app.selectModel(car.timeLineId)
          // console.log('car.timeLineId', car.timeLineId)
          this.getStatusByTimeLineId();
        } catch (error) {
          console.error(error);
        }
      }
    },
    toggleMusicPlay() {
      this.isPlaying ? this.audio.pause() : this.audio.play();
    },
    getStatusByTimeLineId() {
      window.app.getStatus("GETS-00000001");
    },
    handlerBack() {
      window.app.getStatus("GETS-00000008");
      // window.app.ueBack()
    },
    checkset(el, methodsName) {
      window.app[methodsName](el);
    },
    GetUrlParam() {
      let url = document.location.toString();
      let arrObj = url.split("?");
      let params = Object.create(null);
      if (arrObj.length > 1) {
        arrObj = arrObj[1].split("&");
        arrObj.forEach((item) => {
          // console.log(item, "5555")
          item = item.split("=");
          let str = qs.parse(item[1]);
          for (let key in str) {
            params[item[0]] = key.substring(1, key.indexOf('"', 2));
          }
        });
      }
      return params;
    },
    getUrlParam() {
      const params = this.GetUrlParam();
      this.params = params;
      if (!params.souceType || params.souceType === '"') {
        this.flag = true;
        this.code = "6000:系统来源参数不能为空";
        return;
      }
      // else if (!params.timeLineId || params.souceType === "\"") {
      //   this.flag = true
      //   this.code = "6001:时间线ID参数不能为空"
      //   return
      // }
      else if (!params.appKey || params.appKey === '"') {
        this.flag = true;
        this.code = "6002:appKey参数不能为空";
        return;
      }
      // else if (!this.carlist.includes(params.timeLineId)) {
      //   this.flag = true
      //   this.code = "6003:时间线ID无效"
      //   return
      // }
      else if (!params.ueMode || params.ueMode === '"') {
        this.flag = true;
        this.code = "6007:非法UE模式";
        return;
      } else if (!this.melist.includes(params.ueMode.toUpperCase())) {
        this.flag = true;
        this.code = "6007:非法UE模式";
      } else if (!this.deploylist.includes(params.deploy)) {
        this.flag = true;
        this.code = "6008:非法UE服务部署方式";
      }
      //  else if (!this.screenShowlist.includes(params.screenShow.toUpperCase())) {
      //   this.flag = true
      //   this.code = "6009:非法屏幕展示方式"
      // }
      else if (!this.ueSelectorlist.includes(params.ueSelector.toUpperCase())) {
        this.flag = true;
        this.code = "6010:非法UE内部选配器";
      } else if (!this.souceTypelist.includes(params.souceType.toUpperCase())) {
        this.flag = true;
        this.code = "6000:系统来源参数有误";
      } else if (!params.deploy || params.deploy === '"') {
        this.flag = true;
        this.code = "6008:非法UE服务部署方式";
        return;
      }
      // else if (!params.screenShow || params.screenShow === "\"") {
      //   this.flag = true
      //   this.code = "6009:非法屏幕展示方式"
      //   return
      // }
      else if (!params.ueSelector || params.ueSelector === '"') {
        this.flag = true;
        this.code = "6010:非法UE内部选配器";
        return;
      } else {
        let obj = {
          appUrl: process.env.VUE_APP_address,
          // appKey: process.env.VUE_APP_appKey,
          appKey: this.params.appKey,
          boxId: this.box,
          deploy: this.params.deploy,
          souceType: this.souceType.toUpperCase(),
          ueMode: this.ueMode.toUpperCase(),
          screenShow:
            this.ueMode.toUpperCase() === "UEMODE_03" ? "HSCREEN" : "VSCREEN", //根据ueMode判断
          ueSelector: this.ueSelector.toUpperCase(),
          webAddress: process.env.VUE_APP_webAddress,
        };
        console.log("obj", obj);
        let app = new Gacrender(obj);
        window.app = app;
        // const objArray = [{
        //   familyCode: "EXTCOLOR",
        //   featureCode: "EXTCOLOR_0006",
        //   groupCode: "EXT",
        //   timeLineId: "FEXTC-00000006",
        //   selected: true
        // }, {
        //   familyCode: "INTCOLOR",
        //   featureCode: "INTCOLOR_0002",
        //   groupCode: "Int",
        //   timeLineId: "FINTC-00000002",
        //   selected: true
        // }]
        app.selectModel("LC-00000001");
      }
    },
    url_encode(url) {
      url = encodeURIComponent(url);
      url = url.replace(/\\%3A/g, ":");
      url = url.replace(/\\%2F/g, "/");
      url = url.replace(/\\%3F/g, "?");
      url = url.replace(/\\%3D/g, "=");
      url = url.replace(/\\%26/g, "&");
      return url;
    },
  },
};
</script>
<style lang="less" scoped>
@font-face {
  font-family: YouSheBiaoTiHei;
  src: url(../utils/YouSheBiaoTiHei-2.ttf);
}

.apps {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.screen-c {
  width: 100%;
  height: 100%;
  /* background-color: rgb(3, 3, 3); */
  position: relative;
}

.musicIcon {
  z-index: 9999;
  position: absolute;
  right: 90px;
  top: 20px;
  width: 13.5%;
}

.musicIcon-active {
  // animation: loader 1.25s infinite;
  // animation: rotate 3s infinite alternate-reverse;
  animation: rotate 7s linear infinite;
}

@keyframes rotate {
  0% {
    rotate: 0deg;
  }

  75% {
    rotate: 330deg;
  }

  100% {
    rotate: 360deg;
  }
}

.backIcon {
  z-index: 9999;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 13.5%;
}

.background1 {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1080px) {
  .prog {
    width: 10rem;
    left: calc(50vw - 5rem);
    z-index: 20;
    position: absolute;
    bottom: 15rem;
  }

  img {
    width: 15rem;
  }
}

@media (min-width: 1080px) {
  .prog {
    width: 500px;
    left: calc(50vw - 250px);
    z-index: 20;
    position: absolute;
    bottom: 15rem;
  }

  img {
    width: 556px;
  }
}

.none {
  display: none;
}

.mistake {
  z-index: 99999999;
  width: 100vw;
  height: 100vh;
  font-size: 26px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
}
</style>