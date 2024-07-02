<template>
  <div class="container">
    <div class="slider" ref="slider" @touchstart="touchstart" @touchmove="touchmove">
      <div class="frame" v-for="(item,key) in imageList" :key="key">
        <image class="image" :src="baseUrl+item.src"></image>
      </div>
      <div class="frame">
        <image class="image" :src="baseUrl+ImglastSrc"></image>
        <div class="goto" :style="{top:top}" @click="next"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  flex: 1;
  width: 750px;
}
.slider {
  flex: 1;
  width: 3000px;
  flex-direction: row;
}
.frame {
  flex: 1;
  width: 750px;
}
.image {
  flex: 1;
  width: 750px;
}
.goto {
  position: absolute;
  left: 200px;
  width: 350px;
  height: 200px;
  /* height: 75px;   */
}
</style>

<script>
const context = weex.requireModule("context");
const animation = weex.requireModule("animation");
export default {
  data() {
    return {
      top: "",
      baseUrl: "./imgs/guide/ordinaryScreen/",
      ImglastSrc: "guide4.png",
      imageList: [
        {
          src: "guide1.png"
        },
        {
          src: "guide2.png"
        },
        {
          src: "guide3.png"
        }
      ],
      x: "",
      y: "",
      X: "",
      Y: "",
      swipeX: "",
      swipeY: "",
      transform: 1,
      transformX: 0,
      isMove: false,
      nextStatus:true
    };
  },
  created() {
    this.getHeight();
    this.judgeScreenRatio();
    context.secureSetString("guide", "true");
  },
  methods: {
    //判断设备类型 ->普通屏or全面屏
    judgeScreenRatio() {
      const {
        env: { deviceHeight, deviceWidth }
      } = weex.config;
      let screenRatio = deviceHeight / deviceWidth;
      if (screenRatio > 1.8) {
        this.baseUrl = "./imgs/guide/fullScreen/";
      }
    },
    //获取设备高度
    getHeight() {
      const {
        env: { deviceHeight, deviceWidth }
      } = weex.config;
      var pageHeight = (deviceHeight / deviceWidth) * 750;
      this.top = Math.ceil(pageHeight * 0.85) + "px";
    },
    //下一个场景
    next() {
      if(this.nextStatus){
        context.launchStage("main.launcher");
        this.nextStatus=false;
      }
    },
    //触发事件
    touchstart(e) {
      this.x = e.changedTouches[0].pageX;
      this.y = e.changedTouches[0].pageY;
      this.swipeX = true;
      this.swipeY = true;
    },
    //触发滑动事件
    touchmove(e) {
      this.X = e.changedTouches[0].pageX;
      this.Y = e.changedTouches[0].pageY;
      if (
        this.swipeX &&
        Math.abs(this.X - this.x) - Math.abs(this.Y - this.y) > 0 &&
        !this.isMove
      ) {
        // 阻止默认事件
        e.stopPropagation();
        // 右滑
        if (this.X - this.x > 100) {
          //滑动间距
          this.transformRight();
        }
        if (this.x - this.X > 100) {
          //滑动间距
          this.transformLeft();
        }
        this.swipeY = false;
      }
      if (
        this.swipeY &&
        Math.abs(this.X - this.x) - Math.abs(this.Y - this.y) < 0
      ) {
        this.swipeX = false;
      }
    },
    //移动动画
    move() {
      let slider = this.$refs.slider;
      this.isMove = true;
      animation.transition(
        slider,
        {
          styles: {
            transform: `translate(${this.transformX}px, 0)`
          },
          duration: 300, //ms
          timingFunction: "ease",
          delay: 0 //ms
        },
        () => {
          this.isMove = false;
        }
      );
    },
    //左滑操作
    transformLeft() {
      if (this.transform < 4) {
        this.transformX = -(Math.abs(this.transformX) + 750);
        this.transform += 1;
        this.move();
      } else if (this.transform == 4) {
        this.next();
      }
    },
    //右滑操作
    transformRight() {
      if (this.transform > 1) {
        this.transformX = -(Math.abs(this.transformX) - 750);
        this.transform -= 1;
        this.move();
      }
    }
  }
};
</script>