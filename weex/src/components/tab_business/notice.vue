<template>
  <div class="wrapper">
    <div class="main">
      <div class="row1">
        <image :src="notice_img" :style="{width:imgWidth+'px',height:imgHeight+'px'}" />
        <div id="marquee" class="marquee">
          <div class="container" ref="container" :style="{top:m_top+'px'}">
            <div class="title">
              <text class="detail" @click="goto(topList)">{{topList.title}}</text>
              <image :src="notice_right_img" :style="{width:imgrWidth+'px',height:imgrHeight+'px'}" />
            </div>
            <div v-for="(item,key) in marqueelist" :key="key" @click="goto(item)">
              <div class="title">
                <text class="detail">{{item.title}}</text>
                <image :src="notice_right_img" :style="{width:imgrWidth+'px',height:imgrHeight+'px'}" />
              </div>
            </div>
            <div class="title">
              <text class="detail" @click="goto(bottomList)">{{bottomList.title}}</text>
              <image :src="notice_right_img" :style="{width:imgrWidth+'px',height:imgrHeight+'px'}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 750px;
  height: 80px;
  background-color: #ffffff;
  align-items: center;
  /* margin-top: 16px; */
  /* border-top-color: rgb(239, 239, 244);
  border-top-style: solid;
  border-top-width: 16px; */
  /* border-top: 16px solid rgb(239, 239, 244); */
}
.main {
  width: 690px;
  height: 50px;
  margin-left: 30px;
  margin-right: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.row1 {
  width: 690px;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.marquee {
  width: 578px;
  height: 50px;
  overflow: hidden;
}
.title {
  width: 578px;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.container {
  width: 578px;
  position: absolute;
}
.detail{
  width: 530px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  font-size: 28px;
  color: #999999;
}

</style>

<script>
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');

module.exports = {
  props: ['jsonurl'],
  data() {
    return {
      notice_img: './imgs/tab_home/notice/notice@3x.png',
      notice_right_img: './imgs/tab_business/notice/more.png',
      imgWidth: '88',
      imgHeight: '48',
      imgrWidth: '32',
      imgrHeight: '32',
      marqueelist: [],
      topList: {
        title: '',
        SubmitDate: '',
        NoticeContent: ''
      },
      bottomList: {
        title: '',
        SubmitDate: '',
        NoticeContent: ''
      },
      m_length: null,
      m_top: -50,
      timer: null,
      duration: 3000,
      l_bottom: null
    };
  },
  mounted() {
    this.getNotice();
  },
  methods: {
    goto(item) {
      context.sessionSetString('notice', JSON.stringify(item));
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
            this.marqueelist = tmp.list;
            this.m_length = this.marqueelist.length;
            this.topList = this.marqueelist[this.m_length - 1];
            this.bottomList = this.marqueelist[0];
            this.l_bottom = -50 * this.m_length;
            this.notice_img = tmp.src;
            this.notice_right_img = tmp.rightSrc;
            // if (tmp.rightSrc) {
            //     this.imgWidth = tmp.imgSize.imgWidth;
            //     this.imgHeight = tmp.imgSize.imgHeight;
            // }
          // this.getNotice();
        }
      );
    },
    getNotice() {
      this.goJson('/eweb/BankNoticeQry.do', {}, res => {
        let resList = res.data.List;
        let tmpArr = [];
        for (let val of resList) {
          tmpArr.push({
            title: val.NoticeSubject,
            SubmitDate: val.SubmitDate,
            NoticeContent: val.NoticeContent,
          });
        }
        this.marqueelist = tmpArr;
        this.m_length = this.marqueelist.length;
        this.topList = this.marqueelist[this.m_length - 1];
        this.bottomList = this.marqueelist[0];
        this.l_bottom = -50 * this.m_length;
        //this.loading();
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
      var time = 1000; //位移总时间
      var interval = 1000; //位移间隔时间
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