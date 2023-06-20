<template>
  <div class="apps">
    <div class="screen-c" :id="box">
      <div v-if="flag" class="mistake">{{ code }}</div>
      <Loading v-if="showLoading" />

      <img class="playIcon" v-if="showPlay" @touchstart.stop="handlerPlay()" src="../images/play.png" alt="play" />

      <!-- 2d切3d不允许提示 -->
      <div v-if="showEnableToggle" class="toggle-tip">
        <img class="toggle-icon" src="../images/icon/info.png" alt="" />
        <span>当前观看人数过多，请稍候！</span>
      </div>

      <!-- 固定网络提示 -->
      <div v-if="enter && !show2d" class="network-tip">
        <img class="network-icon" src="../images/icon/info.png" alt="" />
        <img class="network-icon-text" src="../images/icon/text.png" alt="" />
      </div>

      <!-- 当展示图标以及2d才展示2d序列图 -->
      <D2 v-if="show2d" />

      <ButtomMenu v-if="enter" :isMiniprogram="isMiniprogram" :goodId="213" :activityId="240" />

      <!-- car select list -->
      <CarSelect v-if="showCarSelect && !show2d" :activeCar="activeCar" :onChange="handerCarChange" />

      <!-- toggle -->
      <!-- 
        1、进去 enter：true
        2、动态控制show2d3dIcon，在7003时候，自动切到2d也展示
        
     -->
      <img v-if="enter || show2d" :class="!show2d && enter ? `toggleIcon` : `backIcon`" @touchstart.stop="handlerToggle()"
        :src="show2d ? logo3D : logo2D" alt="toggleIcon" />

      <!-- music play -->
      <img :class="isPlaying ? 'musicIcon musicIcon-active' : 'musicIcon'" v-if="showMusicIcon && !show2d"
        @touchstart.stop="(e) => toggleMusicPlay(e)" src="../images/icon/music.png" alt="music" />

      <audio id="bg-audio" :src="mp3Url">…</audio>

      <!-- back -->
      <img class="backIcon" v-if="showBackIcon && !show2d" @touchstart.stop="(e) => handlerBack(e)"
        src="../images/icon/back.png" alt="music" />
    </div>
  </div>
</template>
<script>
import CarSelect from "@/components/CarSelect.vue";
import ButtomMenu from "@/components/ButtomMenu.vue";
import D2 from "@/components/2D.vue";
import Loading from "@/components/Loading.vue";
import Gacrender from "../utils/Gacrender1.0.8.js";
import qs from "qs";
import { timeLineIdMapNum, numMapObj } from "@/utils/map";
export default {
  components: { ButtomMenu, Loading, CarSelect, D2 },
  name: "ViEw",
  data() {
    return {
      manualPlayTimer: null,
      logo2D: require("../images/2d/2d.png"),
      logo3D: require("../images/2d/3d.png"),
      show2d: false,
      mp3Url: `${process.env.VUE_APP_webAddress}/material/bg.mp3`,
      activeCar: {
        title: "传祺E9",
        version: "宗师",
        sa: "宗师",
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
      show2d3dIcon: false, //展示2d/3d切换图标
      showBackIcon: false,
      showMusicIcon: false,
      isEnableToggle: false, //是否允许2d  切 3d ，由enter以及微信点击（7001判断）
      showEnableToggle: false,

      showEnableToggleTimer: undefined,
      showPlay: false,
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



    try {

      const shareTimeLineId = new URLSearchParams(window.location.search).get(
        "shareTimeLineId"
      );
      console.log('shareTimeLineId', shareTimeLineId)
      if (shareTimeLineId) {
        window.activeCar = window.carList.filter((car) => `"${car.timeLineId}"` === shareTimeLineId)[0]
        this.activeCar = window.activeCar
      } else {
        window.activeCar = this.activeCar;
      }

      window.addEventListener("beforeunload", function () {
        const time = (+new Date() - window.startTime) / 1000;
        // 发送ajax请求或者使用图片请求将数据上报到服务器端
        window.sensors.track("vr_carType_details_leave", {
          e_code_team: "瑞云",
          e_code_version: "",
          car_series: "mpv",
          event_duration: +(time / 60).toFixed(2),
          car_type: "E9",
          cartype_version: window.activeCar.version || "宗师",
          uid: window.uid,
          port: window.souceType_port
        });
      });

    } catch (_) {
      console.error(_);
    }

    // window.show2d3dIcon = this.show2d3dIcon
    // window.handlerEnter = this.handlerEnter;
    this.audio = document.getElementById("bg-audio");
    if (this.audio) {
      this.audio.onplaying = () => (this.isPlaying = true);
      this.audio.onpause = () => (this.isPlaying = false);
    }
    setTimeout(() => {
      document.title = "广汽传祺 E9";
    }, 100);
    this.getUrlParam();
    let that = this;
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
            that.handlerEnter();
          } else if (e.data.code == "7001") {
            // 通过了微信点击
            this.isEnableToggle = true;
            if (
              navigator.userAgent.includes("miniProgram") ||
              navigator.userAgent.includes("MicroMessenger")
            ) {
              //微信环境才展示点击（主动）
              that.showPlay = true;
            } else {
              //自动点击
              that.manualPlayTimer = setInterval(() => {
                console.info("not manualPlay");
                if (window.manualPlay) {
                  console.info("handlerPlay");
                  that.handlerPlay();
                  clearInterval(that.manualPlayTimer);
                }
              }, 100);
            }
          } else if (e.data.code == "7003") {
            // 返回code为7003和排队人数时，为排队状态，可选择排队人数或者跳转2D操作界面
            that.handlerInitialization();
            that.show2d = true;
            that.show2d3dIcon = true;
          } else if (e.data.code == "200") {
            if (e.data.reqTimeLineId === "GETS-00000008") {
              try {
                if (e.data.responseData && e.data.responseData.length) {
                  console.log(
                    "curLevel:",
                    e.data.responseData[0].data[0].curLevel
                  );
                  if (e.data.responseData[0].data[0].curLevel == 1) {
                    window.location.href = "https://xr.gacmotor.com/trumpchi";
                    return;
                  }
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
                  // console.log("getStatus:", e.data.responseData[0].data);
                  const carStatus = e.data.responseData[0].data;
                  window.carStatus = carStatus;
                  //window.carStatus
                  if (Array.isArray(carStatus) && carStatus.length) {
                    window.optionMap = "";
                    carStatus.forEach((status) => {
                      const num = timeLineIdMapNum.get(status.timeLineId);
                      // console.log('num', num, status.timeLineId)
                      if (num) {
                        window.optionMap = !window.optionMap
                          ? num
                          : `${window.optionMap},${num}`;
                      }
                    });
                  }

                  let obj = e.data.responseData[0].data;
                  obj = obj.map((o) => { return { ...o, selected: true } })
                  obj.push({
                    timeLineId: "FOTHSS-00000001", //唯一编码
                    groupCode: "OTHER",
                    familyCode: "SCREENSHOW",
                    featureCode: "HSCREEN",
                    selected: true,
                  });
                  console.log("selectModel：obj", obj)
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
                if (
                  e.data.location === "AT3DPLAY" ||
                  e.data.location === "ATVIDEOPLAY"
                ) {
                  //隐藏导航栏
                  that.enter = false;
                  that.showCarSelect = false;
                  that.showMusicIcon = false;
                  that.showBackIcon = false;
                  that.show2d3dIcon = false;
                } else {
                  that.enter = true;
                  that.showCarSelect = true;
                  that.showMusicIcon = true;
                  that.showBackIcon = true;
                  that.show2d3dIcon = true;
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
    handlerPlay() {
      try {
        this.showPlay = false;
        window.app.manualPlay();
      } catch (error) {
        console.error(error);
      }
    },
    handlerEnter() {
      this.showLoading = false;
      this.enter = true;

      this.showPlay = false; //强制去掉微信点击
      clearInterval(this.manualPlayTimer);

      this.showCarSelect = true;
      this.showBackIcon = true;
      this.showMusicIcon = true;
      this.show2d3dIcon = true;


      const time = (+new Date() - window.startTime) / 1000;
      console.log("time----", time);
      window.sensors.track("vr_carType_details_browse", {
        e_code_team: "瑞云",
        e_code_version: "",
        event_duration: +(time / 60).toFixed(2),
        car_series: "mpv",
        car_type: "E9",
        cartype_version: window.activeCar.version || "宗师",
        uid: window.uid,
        port: window.souceType_port
      });

    },

    handlerInitialization() {
      this.showLoading = true;
      this.enter = false;
      this.showCarSelect = false;
      this.showBackIcon = false;
      this.showMusicIcon = false;
      this.show2d3dIcon = false;
    },
    handerCarChange(car) {
      if (car.timeLineId !== this.activeCar.timeLineId) {
        try {
          window.activeCar = car;
          this.activeCar = car;

          window.sensors.track("vr_carType_details_btnClick", {
            btn_type: `切换车型-${car.sa}`,
            btn_name: '',
            car_series: "mpv",
            car_type: "E9",
            cartype_version: car.version,
            uid: window.uid,
            port: window.souceType_port
          });

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
      try {
        window.sensors.track("vr_carType_details_btnClick", {
          btn_type: "音乐键",
          btn_name: '',
          car_series: "mpv",
          car_type: "E9",
          cartype_version: window.activeCar.version,
          uid: window.uid,
          port: window.souceType_port
        });
      } catch (_) {
        console.error("sensors quick error", _);
      }
    },
    getStatusByTimeLineId() {
      window.app.getStatus("GETS-00000001");
    },
    handlerBack() {
      window.app.getStatus("GETS-00000008");
      try {
        window.sensors.track("vr_carType_details_btnClick", {
          btn_type: "返回键",
          btn_name: '',
          car_series: "mpv",
          car_type: "E9",
          cartype_version: window.activeCar.version,
          uid: window.uid,
          port: window.souceType_port
        });
      } catch (_) {
        console.error("sensors quick error", _);
      }
      // window.app.ueBack()
    },

    handlerToggle() {

      try {
        window.sensors.track("vr_carType_details_btnClick", {
          btn_type: this.show2d ? '3D' : '2D',
          btn_name: '',
          car_series: "mpv",
          car_type: "E9",
          cartype_version: window.activeCar.version,
          uid: window.uid,
          port: window.souceType_port
        });
      } catch (_) {
        console.error("sensors quick error", _);
      }

      //2d 切换 3d时候判断,没有enter或者没有微信点击（isEnableToggle）
      if (this.show2d && !this.enter && !this.isEnableToggle) {
        //提示不能切3d
        this.showEnableToggle = true;
        let that = this;
        this.showEnableToggleTimer = window.setTimeout(() => {
          that.showEnableToggle = false;
        }, 2000);
        return;
      }
      this.show2d = !this.show2d;
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
          souceType: this.params.souceType.toUpperCase(),
          ueMode: this.params.ueMode.toUpperCase(),
          screenShow:
            this.params.ueMode.toUpperCase() === "UEMODE_03"
              ? "HSCREEN"
              : "VSCREEN", //根据ueMode判断
          ueSelector: this.params.ueSelector.toUpperCase(),
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
        let objArray = [];
        if (this.params.optionMap) {
          // console.log('this.params.optionMap', this.params.optionMap)
          objArray = this.params.optionMap.split(",").map((option) => {
            // console.log('option', option, +option, numMapObj.get(+option))
            return numMapObj.get(+option);
          });
          app.selectModel(
            this.params.shareTimeLineId || "LC-00000001",
            // objArray,
            objArray.concat({
              timeLineId: "FOTHSS-00000001", //唯一编码
              groupCode: "OTHER",
              familyCode: "SCREENSHOW",
              featureCode: "HSCREEN",
              selected: true,
            })
          );

          console.info(
            "selectModel:objArray-------",
            objArray.concat({
              timeLineId: "FOTHSS-00000001", //唯一编码
              groupCode: "OTHER",
              familyCode: "SCREENSHOW",
              featureCode: "HSCREEN",
              selected: true,
            })
          );
        } else {
          app.selectModel("LC-00000001");
        }
        // console.log('objArray', objArray)
        // app.selectModel("LC-00000001");
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
  background-color: rgb(3, 3, 3);
  position: relative;
}

.toggle-tip {
  width: 62%;
  position: fixed;
  transform: translate(-50%, 0);
  left: 50%;
  top: 20%;
  z-index: 99999999;
  background-color: #a0c0d3;
  padding: 4px 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 8%;
  }

  span {
    margin-left: 4px;
    font-family: YouSheBiaoTiHei;
  }
}

.network-tip {
  width: 62%;
  position: fixed;
  right: -33px;
  top: 2px;
  z-index: 99999999;
  // background-color: #a0c0d3;
  padding: 4px 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .network-icon {
    width: 6%;
  }

  .network-icon-text {
    width: 48%;
    margin-left: 5px;
  }
}

.playIcon {
  width: 50%;
  position: absolute;
  transform: translate(-50%, 0);
  left: 50%;
  bottom: 18%;
  z-index: 9999;
}

.musicIcon {
  z-index: 9999;
  position: absolute;
  right: 80px;
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

.toggleIcon {
  z-index: 9999;
  position: absolute;
  right: 140px;
  top: 20px;
  width: 13.5%;
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
  position: fixed;
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