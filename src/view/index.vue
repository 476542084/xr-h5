<template>
  <div class="apps">

    <!-- <div class="screen-c" :id="box">
      <div class="mistake" v-if="flag">{{ code }}</div>
      <div ref="progress" v-else>
        <el-progress :class="stat ? 'prog' : 'none'" :percentage="percentage" :color="customColor"></el-progress>
      </div>
      <div :class="stat ? 'background1' : 'none'">
        <img src="../images/e67fa26f74d88134d35c0f77eaad322.png" alt="" />
        <div></div>
      </div>
    </div> -->
    
    <ButtomMenu :isMiniprogram=false />
  </div>
</template>
<script>
import ButtomMenu from "@/components/ButtomMenu.vue";
import Gacrender from "../utils/Gacrender1.0.0.js"
import qs from 'qs'
export default {
  components: { ButtomMenu },
  name: "ViEw",
  data() {
    return {
      flag: false,
      code: '--',
      box: "box",
      stat: true,
      percentage: 0,
      customColor: "#E50120",
      showItem: true,
      deploy: '2',
      souceType: 'APP_01',
      ueMode: 'UEMODE_01',
      screenShow: 'VSCREEN',
      ueSelector: 'ON',
      carlist: [
        "LC-00000001",
        "LC-00000002",
        "LC-00000003",
        "LC-00000004",
        "LC-00000005",
      ],
      melist: [
        "UEMODE_01",
        "UEMODE_02",
        "UEMODE_03"
      ],
      deploylist: [
        "1",
        "2"
      ],
      screenShowlist: [
        "HSCREEN",
        "VSCREEN"
      ],
      ueSelectorlist: [
        "ON",
        "OFF"
      ],
      souceTypelist: [
        "APP_01",
        "APP_02",
        "APP_03",
        "APP_00"
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      document.title = "广汽传祺"
    }, 100)
    this.getUrlParam()
    window.addEventListener(
      "message",
      function (e) {
        // 监听返回值
        // 操作成功与否
        console.log('UE4实例返回信息:', e.data.code)
        // 监听返回值
        if (e.data.code !== 200) {
          if (
            e.data.code == "4000" ||
            e.data.code == "4001" ||
            e.data.code == "4002"
          ) {
            this.flag = true
            this.code = "6003:时间线ID无效"
          } else if (
            (e.data.code > 600 && e.data.code < 700) ||
            e.data.code == "705"
          ) {
            this.flag = true
            this.code = "6004:无效UE实例请求秘钥,认证失败 "
          } else if (
            e.data.code == "5000" ||
            e.data.code == "404" ||
            e.data.code == "1018" ||
            e.data.code == "1019"
          ) {
            this.flag = true
            this.code = "6005:资源繁忙,请稍后重试"
          }
          else {
            this.flag = true
            this.code = "6006:系统异常,请联系管理员"
          }
        } else {
          //接口UE4服务器推送的消息
          window.connection.event.interaction.on((msg) => {
            console.log("主页面收到应用发来的消息:", msg);
          });
        }
      },
      false
    )
    setInterval(() => {
      this.percentage += 2
      if (this.percentage > 100) {
        this.percentage = 100
      }
    }, 20)
    setTimeout(() => {
      this.stat = false
    }, 2200)
  },
  methods: {
    checkset(el, methodsName) {
      window.app[methodsName](el)
    },
    GetUrlParam() {
      let url = document.location.toString()
      let arrObj = url.split("?")
      let params = Object.create(null)
      if (arrObj.length > 1) {
        arrObj = arrObj[1].split("&")
        arrObj.forEach((item) => {
          // console.log(item, "5555")
          item = item.split("=")
          let str = qs.parse(item[1])
          for (let key in str) {
            params[item[0]] = key.substring(1, key.indexOf('"', 2))
          }
        })
      }
      return params
    },
    getUrlParam() {
      const params = this.GetUrlParam()
      if (!params.souceType || params.souceType === "\"") {
        this.flag = true
        this.code = "6000:系统来源参数不能为空"
        return
      } else if (!params.timeLineId || params.souceType === "\"") {
        this.flag = true
        this.code = "6001:时间线ID参数不能为空"
        return
      } else if (!params.appKey || params.appKey === "\"") {
        this.flag = true
        this.code = "6002:appKey参数不能为空"
        return
      } else if (!this.carlist.includes(params.timeLineId)) {
        this.flag = true
        this.code = "6003:时间线ID无效"
        return
      } else if (!params.ueMode || params.ueMode === "\"") {
        this.flag = true
        this.code = "6007:非法UE模式"
        return
      } else if (!this.melist.includes(params.ueMode.toUpperCase())) {
        this.flag = true
        this.code = "6007:非法UE模式"
      }
      else if (!this.deploylist.includes(params.deploy)) {
        this.flag = true
        this.code = "6008:非法UE服务部署方式"
      } else if (!this.screenShowlist.includes(params.screenShow.toUpperCase())) {
        this.flag = true
        this.code = "6009:非法屏幕展示方式"
      } else if (!this.ueSelectorlist.includes(params.ueSelector.toUpperCase())) {
        this.flag = true
        this.code = "6010:非法UE内部选配器"
      } else if (!this.souceTypelist.includes(params.souceType.toUpperCase())) {
        this.flag = true
        this.code = "6000:系统来源参数有误"
      }
      else if (!params.deploy || params.deploy === "\"") {
        this.flag = true
        this.code = "6008:非法UE服务部署方式"
        return
      }
      else if (!params.screenShow || params.screenShow === "\"") {
        this.flag = true
        this.code = "6009:非法屏幕展示方式"
        return
      }
      else if (!params.ueSelector || params.ueSelector === "\"") {
        this.flag = true
        this.code = "6010:非法UE内部选配器"
        return
      }
      else {
        let obj = {
          appUrl: process.env.VUE_APP_address,
          appKey: process.env.VUE_APP_appKey,
          boxId: this.box,
          deploy: process.env.VUE_APP_deploy,
          souceType: this.souceType.toUpperCase(),
          ueMode: this.ueMode.toUpperCase(),
          screenShow: this.screenShow.toUpperCase(),
          ueSelector: this.ueSelector.toUpperCase(),
          webAddress: process.env.VUE_APP_webAddress
        }
        let app = new Gacrender(obj)
        window.app = app
        app.selectModel("LC-00000001")
      }
    },
    url_encode(url) {
      url = encodeURIComponent(url)
      url = url.replace(/\\%3A/g, ":")
      url = url.replace(/\\%2F/g, "/")
      url = url.replace(/\\%3F/g, "?")
      url = url.replace(/\\%3D/g, "=")
      url = url.replace(/\\%26/g, "&")
      return url
    },
  },
};
</script>
<style scoped>
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
  z-index: 3;
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