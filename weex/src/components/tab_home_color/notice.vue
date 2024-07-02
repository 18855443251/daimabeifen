<template>
  <div class="wrapper">
    <div class="row1">
      <image :src="notice_img" :style="{width:imgWidth+'px',height:imgHeight+'px'}" />
      <div id="marquee" class="marquee">
        <div class="container" ref="container" :style="{top:m_top+'px'}">
          <text class="title" @click="goto(topList.url)">{{topList.title}}</text>
          <div v-for="(item,key) in marqueelist" :key="key" @click="goto(item.url)">
            <text class="title">{{item.title}}</text>
          </div>
          <text class="title" @click="goto(bottomList.url)">{{bottomList.title}}</text>
        </div>
      </div>
    </div>
    <div class="row2">
      <image :src="notice_right_img" v-if="notice_right_img" :style="{width:imgWidth+'px',height:imgHeight+'px'}" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 98px;
  background-color: #ffffff;
  padding-left: 32px;
  padding-right: 32px;
}
.row1 {
  height: 82px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.row2 {
  height: 82px;
  flex-direction: row;
  align-items: center;
}
.marquee {
  width: 500px;
  height: 50px;
  margin-left: 30px;
  overflow: hidden;
}
.container {
  height: 300px;
  position: absolute;
}
.title {
  height: 50px;
  line-height: 50px;
  text-overflow: ellipsis;
  font-size: 28px;
  color: #999;
}
</style>

<script>
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');

module.exports = {
  props: ['jsonurl'],
  data() {
    return {
      notice_img: '',
      notice_right_img: '',
      imgWidth: '88',
      imgHeight: '48',
      marqueelist: [],
      topList: {
        title: ''
      },
      bottomList: {
        title: ''
      },
      m_length: null,
      m_top: -50,
      timer: null,
      duration: 3000,
      l_bottom: null
    };
  },
  mounted() {
    this.getNoticeBefore();
  },
  methods: {
    goto(url) {
      context.sessionSetString('notice', url);
      context.launchStage('main.noticeDetail');
    },
    getNoticeBefore() {
      stream.fetch(
        {
          method: 'GET',
          url: this.$store.state.jsonBaseUrl + this.jsonurl,
          type: 'json'
        },
        res => {
          var tmp = res.data.data;
          this.notice_img = tmp.src;
          if (tmp.rightSrc) {
            this.notice_right_img = tmp.rightSrc;
          }
          if (tmp.imgSize) {
            this.imgWidth = tmp.imgSize.imgWidth;
            this.imgHeight = tmp.imgSize.imgHeight;
          }
          this.getNotice();
        }
      );
    },
    getNotice() {
      this.goJson('/refacmob/BankNoticeQry.do', {}, res => {
        let resList = res.data.List;
        let tmpArr = [];
        for (let val of resList) {
          tmpArr.push({
            title: val.NoticeSubject,
            url: val.ShowNo
          });
        }
        this.marqueelist = tmpArr;
        this.m_length = this.marqueelist.length;
        this.topList = this.marqueelist[this.m_length - 1];
        this.bottomList = this.marqueelist[0];
        this.l_bottom = -50 * this.m_length;
        this.loading();
      });
    },
    loading() {
      this.timer = setInterval(() => {
        this.animate(-50);
      }, this.duration);
    },
    animate(offset) {
      var _this = this;
      var newLeft = this.m_top + offset;
      var time = 300; //位移总时间
      var interval = 10; //位移间隔时间
      var speed = offset / (time / interval); //每次位移量

      function go() {
        if (
          (speed < 0 && _this.m_top > newLeft) ||
          (speed > 0 && _this.m_top < newLeft)
        ) {
          _this.m_top = _this.m_top + speed;
          setTimeout(go, interval);
        } else {
          _this.m_top = newLeft;

          if (newLeft > -50) {
            _this.m_top = _this.l_bottom;
          }
          if (newLeft < _this.l_bottom) {
            _this.m_top = -50;
          }
        }
      }
      go();
    }
  }
};
</script>