<template>
  <transition name="fade">
    <div
      class="mkvue-wrap"
      id="mkvue-wrap"
      v-if="show"
      ref="heImg"
      @mouseup="removeMove"
      :style="'background:' + mainBackground"
    >
      <div class="mk-img-wrap">
        <img
          :src="url"
          ref="heImView"
          class="mk-img-view"
          :style="'transform: scale('+imgScale+') rotate('+imgRotate+'deg);margin-top:'+imgTop+'px;margin-left:'+imgLeft+'px;' + maxWH"
          @mousedown="addMove"
        />
        <div class="iconfont he-close-icon" @click="close" :style="'color:'+closeColor">&#xe764;</div>
        <div
          class="arrow arrow-left iconfont"
          @click="toogleImg(false)"
          v-if="multiple"
          :style="'color:' + controlColor + ';background: '+controlBackground"
        >&#xe620;</div>
        <div
          class="arrow arrow-right iconfont"
          @click="toogleImg(true)"
          v-if="multiple"
          :style="'color:' + controlColor + ';background: '+controlBackground"
        >&#xe60d;</div>
        <div
          class="he-control-bar"
          :style="'color:' + controlColor + ';background: '+controlBackground"
        >
          <div class="he-control-btn iconfont" @click="scaleFunc(-0.15)">&#xe65e;</div>
          <div class="he-control-btn iconfont" @click="scaleFunc(0.15)">&#xe65d;</div>
          <div class="he-control-btn iconfont" v-show="isFull" @click="imgToggle">&#xe698;</div>
          <div class="he-control-btn iconfont" v-show="!isFull" @click="imgToggle">&#xe86b;</div>
          <div class="he-control-btn iconfont" @click="rotateFunc(-90)">&#xe670;</div>
          <div class="he-control-btn iconfont" @click="rotateFunc(90)">&#xe66f;</div>
        </div>
        <div
          class="he-control-num"
          v-if="multiple"
          :style="'color:' + controlColor + ';background: '+controlBackground"
        >{{imgIndex + 1}} / {{imgList.length}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'mk-img-preview',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    url: String,
    mainBackground: String, // 整体背景颜色
    controlColor: String, // 控制条字体颜色
    controlBackground: String, // 控制条背景颜色
    closeColor: String, // 关闭图标的颜色
    instance: Object,
    multiple: {
      type: Boolean,
      default: false,
    },
    nowImgIndex: {
      type: Number,
      default: 0,
    },
    imgList: Array
  },
  data () {
    return {
      // imgWidth: 0,
      // imgHeight: 0,
      imgScale: 1,
      imgTop: 0,
      imgLeft: 0,
      imgRotate: 0,
      isFull: false,
      maxWH: 'max-width:100%;max-height:100%;',
      clientX: 0,
      clientY: 0,
      imgIndex: 0
    }
  },
  mounted () {
    this.initImg()
  },
  watch: {
    url () {
      this.initImg()
    },
    show (newV) {
      if (newV) {
        this.$nextTick(_ => {
          let _dom = document.getElementById('mkvue-wrap')
          _dom.onmousewheel = this.scrollFunc
          // 火狐浏览器没有onmousewheel事件，用DOMMouseScroll代替
          document.body.addEventListener("DOMMouseScroll", this.scrollFunc)
          // 禁止火狐浏览器下拖拽图片的默认事件
          document.ondragstart = function () { return false }
          // 判断是否多选
          if (this.multiple) {
            if (Array.isArray(this.imgList) && this.imgList.length > 0) {
              this.imgIndex = Number(this.nowImgIndex) || 0
              this.url = this.imgList[this.imgIndex]
            } else {
              console.error('imgList 为空或格式不正确')
            }
          } else {
            var ImgObj = new Image()
            ImgObj.src = this.url
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
              return true
            } else {
              console.error('传入图片地址不正确--组件hevue-img-preview')
            }
          }
        })
      }
    }
  },
  methods: {
    close () {
      // this.$closehevueImgPreview()
      this.instance.show = false
      this.initImg()
      this.maxWH = 'max-width:100%;max-height:100%;'
      this.isFull = false
      // 移除火狐浏览器下的鼠标滚动事件
      document.body.removeEventListener("DOMMouseScroll", this.scrollFunc)
      //恢复火狐及Safari浏览器下的图片拖拽
      document.ondragstart = null
    },
    initImg () {
      this.imgScale = 1
      this.imgRotate = 0
      this.imgTop = 0
      this.imgLeft = 0
    },
    // 切换图片
    toogleImg (bool) {
      if (bool) {
        this.imgIndex++
        if (this.imgIndex > this.imgList.length - 1) {
          this.imgIndex = 0
        }
      } else {
        this.imgIndex--
        if (this.imgIndex < 0) {
          this.imgIndex = this.imgList.length - 1
        }
      }
      this.url = this.imgList[this.imgIndex]
    },
    // 旋转图片
    rotateFunc (deg) {
      this.imgRotate += deg
    },
    // 图片缩放
    scaleFunc (num) {
      if (this.imgScale <= .2 && num < 0) return
      this.imgScale += num
    },
    // 图片原尺寸切换
    imgToggle () {
      this.initImg()
      if (this.isFull) {
        this.maxWH = 'max-width:100%;max-height:100%;'
      } else {
        this.maxWH = ''
      }
      this.isFull = !this.isFull
    },
    scrollFunc (e) {
      e = e || window.event
      // e.returnValue = false // ie
      // 火狐下没有wheelDelta，用detail代替，由于detail值的正负和wheelDelta相反，所以取反
      e.delta = e.wheelDelta || -e.detail
      e.preventDefault()
      if (e.delta > 0) { //当滑轮向上滚动时
        this.scaleFunc(0.015)
      }
      if (e.delta < 0) { //当滑轮向下滚动时
        this.scaleFunc(-0.015)
      }
    },
    addMove (e) {
      e = e || window.event
      this.clientX = e.clientX
      this.clientY = e.clientY
      this.$refs.heImg.onmousemove = this.moveFunc
    },
    removeMove () {
      this.$refs.heImg.onmousemove = null
    },
    moveFunc (e) {
      e = e || window.event
      e.preventDefault()
      let movementX = e.clientX - this.clientX
      let movementY = e.clientY - this.clientY
      event.clientY
      this.imgLeft += movementX
      this.imgTop += movementY
      this.clientX = e.clientX
      this.clientY = e.clientY
    }
  }
}
</script>

<style scoped>
@font-face {font-family: "iconfont";
  src: url('./font.eot'); /* IE9 */
  src: url('./font.eot#iefix') format('embedded-opentype'),
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./font.woff') format('woff'),
  url('./font.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./font.svg') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconicon_arrow_right:before {
  content: "\e60d";
}

.iconjiantouzuo:before {
  content: "\e620";
}

.iconxuanzhuan:before {
  content: "\e66f";
}

.iconxuanzhuan1:before {
  content: "\e670";
}

.iconyuanshibili:before {
  content: "\e86b";
}

.iconfangda:before {
  content: "\e65d";
}

.iconsuoxiao:before {
  content: "\e65e";
}

.iconquanping:before {
  content: "\e698";
}

.iconguanbi:before {
  content: "\e764";
}
.mkvue-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999999999;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.mk-img-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.mk-img-view {
  transition: transform 0.3s;
}
.he-close-icon {
  position: absolute;
  right: 50px;
  top: 50px;
  font-size: 46px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}
.arrow {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  position: absolute;
  top: 50%;
  border-radius: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  font-size: 28px;
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.2s;
}
.arrow:hover {
  opacity: 0.8;
  font-size: 32px;
}
.arrow-left {
  left: 50px;
}
.arrow-right {
  right: 50px;
}
.he-close-icon:hover {
  transform: rotate(90deg);
}
.he-control-bar {
  width: 260px;
  height: 44px;
  bottom: 10%;
  left: 50%;
  padding: 0 22px;
  margin-left: -139px;
  position: absolute;
  border-radius: 22px;
  /* display: flex;
  justify-content: space-between; */
}
.he-control-num {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  padding: 0 22px;
  font-size: 16px;
  border-radius: 15px;
}
.he-control-btn {
  line-height: 44px;
  font-size: 24px;
  cursor: pointer;
  padding: 0 9px;
  display: inline-block;
  transition: all 0.2s;
}
.he-control-btn:hover {
  transform: scale(1.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}



</style>
