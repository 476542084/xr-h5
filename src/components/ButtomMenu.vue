<template>
  <div class="buttom_menu" @touchstart.stop @touchmove.stop.prevent @touchend.stop @mousewheel.stop>
    <div class="btns">
      <div v-if="!isMiniprogram" class="btns_container">
        <div v-for="(btn, idx) in btnsConfig" :key="btn.name" class="btn_item"
          :class="[{ active: btn.name == currBtnName }, btn.class]" @click.stop="(e) => handleClickBtn(btn, idx, e)">
          <div class="item_line left"></div>
          <div class="item_box">
            <img v-show="btn.name == currBtnName" :src="btn.activeIcon" alt="" />
            <img v-show="btn.name != currBtnName" :src="btn.icon" alt="" />
            <div class="item_name">{{ btn.name }}</div>
          </div>
          <div class="item_line right"></div>
        </div>
      </div>
      <!-- <img class="btn_img" src="../images/main_btn_white.png" alt="" @click.stop="handleShowMenu"
                :class="{ miniprogram: isMiniprogram }" /> -->
    </div>
    <!-- <open-app v-if="!isMiniprogram"></open-app> -->
    <div class="share-sheet">
      <van-share-sheet :show="showShare" title="立即分享给好友" :options="options" @select="onSelect" @cancel="() => {
          showShare = false;
        }
        " />
    </div>
    <div class="app-download-miniprogram" v-if="isMiniprogram && showDownloadCode" @click="setDownloadFalse">
      <div @click.stop class="code">
        <img src="../images/applogo.png" alt="app下载" />
      </div>
      <div class="close">
        <img src="../images/close.png" alt="关闭" />
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapGetters } from "vuex";
// import EventListener from "../../core/event";
// import OpenApp from "./OpenApp.vue";
import wechatMoments from "../images/wechat-moments.png";
import wechat from "../images/wechat.png";
// import { timeLineIdMapNum } from "@/utils/map";
export default {
  // components: { OpenApp },
  name: "ButtomMenu",
  props: ["shareUrl", "isMiniprogram", "goodId", "activityId"],
  data() {
    return {
      currBtnName: "", // 当前选中的按钮名称
      isShowFunctionArea: false,
      showShare: false,
      options: [
        { name: "微信", icon: wechat },
        { name: "朋友圈", icon: wechatMoments },
      ],
      showDownloadCode: false,
    };
  },
  computed: {
    btnsConfig() {
      // 商品id
      const goodId = this.goodId,
        // 活动id
        activityId = this.activityId;
      return [
        {
          name: "分享",
          class: "share",
          icon: require("../images/分享-未选.png"),
          activeIcon: require("../images/分享-选中.png"),
        },
        {
          name: "立即预订",
          class: "book",
          icon: require("../images/立即预订-未选.png"),
          activeIcon: require("../images/立即预订-选中.png"),
          url: `gac://order_now?id=${goodId}`,
        },
        {
          name: "预约试驾",
          class: "drive",
          icon: require("../images/预约试驾-未选.png"),
          activeIcon: require("../images/预约试驾-选中.png"),
          url: `https://mall.gacmotor.com/act/test-drive?id=${activityId}`,
          url2: `https://mall.gacmotor.com/act/test-drive?id=${activityId}`,
        },
        {
          name: "参数配置",
          class: "config",
          icon: require("../images/参数配置-未选.png"),
          activeIcon: require("../images/参数配置-选中.png"),
          url: `https://mall.gacmotor.com/detail/comparison?goodsCarId=${goodId}`,
          url2: `https://mall.gacmotor.com/detail/comparison?goodsCarId=${goodId}`,
        },
        {
          name: "在线客服",
          class: "consults",
          icon: require("../images/在线客服-未选.png"),
          activeIcon: require("../images/在线客服-选中.png"),
          url: "gac://ntalker",
        },
      ];
    },
  },
  mounted() {
    this.sensorsInit()
    console.info("goodId:", this.goodId);
    console.info("activityId:", this.activityId);
    // EventListener.on("changeToMotion", () => {
    //   this.switchFunctionIcon(!this.isShowFunctionIcon);
    // });
  },
  methods: {
    sensorsInit() {

    },
    setDownloadFalse() {
      this.showDownloadCode = false;
    },
    handleShowMenu() {
      if (this.isMiniprogram) {
        this.showDownloadCode = true;
      } else {
        this.isShowFunctionArea = !this.isShowFunctionArea;
      }
    },
    handleClickBtn(item, index, e) {
      console.log('e', e)
      window.sensors.quick('trackHeatMap', e.target, {
        btn_name_share: 'btn_name_share',
      });
      // return;
      this.currBtnName = item.name;
      if (item.name === "分享") {
        console.log("item", item);
        // getStatusByTimeLineId
        window.app.getStatus("GETS-00000001");
        this.showShare = true;
        //TODO
      } else {
        if (this.btnsConfig[index].url2 && window.tool) {
          const item1 = {
            url: this.btnsConfig[index].url2, // 跳转的页面地址
            type: 0, // 跳转的方法,  不传默认0,   0: 不带头,不带状态栏, 1: 带头, 2: 带头分享, 3: 不带头,只有状态栏
            shareFun: "", // type为2时,传一个分享的方法名,点击分享按钮原生调用这个方法
          };
          window.tool.goWebPage(item1);
        } else {
          window.open(this.btnsConfig[index].url);
        }
      }
    },
    onSelect(option) {
      this.showShare = false;
      // let currAccList = this.mainScene.currAccList.join(",");
      let url = this.shareUrl || window.location.href.split("#")[0];
      console.log('share before url', url)
      // console.log(option);
      if (window.optionMap) {
        if (new URLSearchParams(window.location.search).get('optionMap')) {
          //url含有分享的optionMap，需要重置且设置新的有效值
          url = url.split('&optionMap=')[0]
          url = `${url}&optionMap="${window.optionMap}"`
        } else {
          url = `${url}&optionMap="${window.optionMap}"`
        }
      }

      console.log('share after url', url)
      const item = {
        url,
        name: "传祺E9",
        coverImage: "",
        content: "传祺E9",
        shareCallback: "shareCallback",
      };
      console.log('share item', item)

      if (option.name === "微信") {
        //TODO
        //微信分享app方法
        window.tool.sessionShare(item);
      } else {
        //TODO
        //朋友圈分享app方法
        window.tool.timeLineShare(item);
      }

    },
  },
};
</script>

<style lang="less" scoped>
// @import "../less/global/index.less";
.app-download-miniprogram {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.6);

  img {
    width: 100%;
  }

  .code {
    padding: 2%;
    width: 50%;
    background-color: #fff;
    border-radius: 5%;
  }

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: (20 / 24rem);
    padding: (8 / 24rem);
    width: (40 / 24rem);
    height: (40 / 24rem);
    border: 1px solid #fff;
    border-radius: 50%;
  }
}

.buttom_menu {
  position: absolute;
  bottom: 0;
  z-index: 100;
  width: 100%;

  .color {
    position: fixed;
    left: 50%;
    top: 78%;
    transform: translate(-50%, -50%);
    font-size: (26 / 24rem);
    color: #333;
    width: (224 / 24rem);
    height: (64 / 24rem);
    background: #ffffff;
    box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.1);
    border-radius: (64 / 24rem);
    text-align: center;
    line-height: (64 / 24rem);
    font-weight: bold;
    font-style: italic;
  }

  .btn_single {
    position: absolute;
    bottom: (90 / 24rem);
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    display: flex;
    justify-content: center;

    .btn_single_container {
      width: 56px;
      height: 56px;
      line-height: 70px;
      background: linear-gradient(180deg, #97e823 0%, #65a200 100%);
      box-shadow: 0px 3px 8px 0px rgba(21, 34, 0, 0.3);
      border-radius: 50%;
      text-align: center;
    }

    .btn_img {
      width: 38px;
      height: 24px;
    }
  }

  .btns {
    position: absolute;
    bottom: -2.4rem;
    width: 100%;
    height: auto;

    .btns_container {
      width: 100%;
      height: 100%;
      display: flex;
      background-image: url("../images/圆盘2.png");
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: top;

      .btn_item {
        position: relative;
        display: flex;
        // flex-direction: column;
        // align-items: center;
        width: 20%;
        height: (200 / 24rem);

        .item_box {
          position: absolute;
          z-index: 100;
          text-align: center;

          .item_name {
            font-size: 12px;
            color: #333;
            transform: scale(0.75);
          }

          img {
            width: 25px;
            height: 25px;
          }
        }
      }

      .share {
        transform: translateY((58 / 24rem));
      }

      .book {
        transform: translateY((30 / 24rem));
      }

      .drive {
        transform: translateY((26 / 24rem));
      }

      .config {
        transform: translateY((30 / 24rem));
      }

      .consults {
        transform: translateY((58 / 24rem));
      }

      .btn_item:nth-child(1) {
        .item_box {
          top: 5px;
          left: 55%;
        }

        &.active {
          // background-image: url("../images/左一.png");
          background-size: contain;
          background-repeat: no-repeat;

          .item_line {
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                #e9e9e9 50%,
                rgba(255, 255, 255, 0) 100%);
          }

          .right {
            position: absolute;
            right: 0;
          }
        }
      }

      .btn_item:nth-child(2) {
        .item_box {
          top: 5px;
          left: 25%;
        }

        &.active {
          // background-image: url("../images/左二.png");
          background-size: contain;
          background-repeat: no-repeat;

          .item_line {
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                #e9e9e9 50%,
                rgba(255, 255, 255, 0) 100%);
          }

          .left {
            position: absolute;
            right: 0;
            transform: translateY(20px);
          }

          .right {
            transform: translateY(10px);
          }
        }
      }

      .btn_item:nth-child(3) {
        .item_box {
          top: -5%;
          left: 38%;

          img {
            // width: 19px;
            // height: 19px;
            // margin-left: -4px;
          }

          .item_name {
            position: absolute;
            top: 85%;
            left: -79%;
            width: (100 / 24rem);
          }
        }

        &.active {
          // background-image: url("../images/中间.png");
          background-size: contain;
          background-repeat: no-repeat;

          .item_line {
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                #e9e9e9 50%,
                rgba(255, 255, 255, 0) 100%);
          }

          .right {
            position: absolute;
            right: 0;
          }
        }
      }

      .btn_item:nth-child(4) {
        .item_box {
          top: 5px;
          left: 34%;

          img {
            // width: 19px;
            // height: 19px;
            // margin-left: -3px;
          }

          .item_name {
            position: absolute;
            top: 96%;
            left: -75%;
            width: (100 / 24rem);
          }
        }

        &.active {
          // background-image: url("../images/右二.png");
          background-size: contain;
          background-repeat: no-repeat;

          // .item_name {
          //     position: absolute;
          //     top: 105%;
          //     left: -80%;
          //     width: (100 / 24rem);
          // }
          .item_line {
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                #e9e9e9 50%,
                rgba(255, 255, 255, 0) 100%);
          }

          .right {
            position: absolute;
            right: 0;
            transform: translateY(20px);
          }
        }
      }

      .btn_item:nth-child(5) {
        .item_box {
          top: 5px;
          left: 5%;

          img {
            // width: 18px;
            // height: 16px;
          }
        }

        &.active {
          // background-image: url("../images/右一.png");
          background-size: contain;
          background-repeat: no-repeat;

          .item_line {
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg,
                rgba(255, 255, 255, 0) 0%,
                #e9e9e9 50%,
                rgba(255, 255, 255, 0) 100%);
          }

          .right {
            position: absolute;
            right: 0;
          }
        }
      }
    }

    .btn_img {
      position: absolute;
      left: 44%;
      bottom: (10 / 24rem);
      width: (94 / 24rem);
    }

    .miniprogram {
      margin-bottom: (10 / 24rem);
    }
  }
}

@media screen and (max-width: 320px) {
  .btns_container {

    .btn_item:nth-child(2),
    .btn_item:nth-child(3),
    .btn_item:nth-child(4) {
      .item_name {
        width: (134 / 24rem) !important;
      }
    }
  }

  .item_name {
    transform: scale(0.65) !important;
  }
}

.share-sheet /deep/ .van-share-sheet__options {
  justify-content: center !important;
}
</style>
