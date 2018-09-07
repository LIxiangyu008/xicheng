<template lang="html">
  <div class="query-list-media-div">
    <div class="query-list-media">
      <el-container>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="items.startDate+'年份'" :key="items.fId" v-for="(items, tabIndex) of MediaInfo" :name="tabIndex">
            <el-radio v-model="radio" label="1" border size="small" @change="changePic">图片</el-radio>
            <el-radio v-model="radio" label="2" border size="small" @change="changeVideo">视频</el-radio>
            <div class="tab-content">
              <span class="tab-pic" v-if="isTabContentShow" v-for="data of tabledata">
                <img
                  :src="pic.dcid"
                  @click="ShowBigPic($event, items.aList, index)"
                  v-if="pic.format.toUpperCase() == 'JPG'"
                  :title="items.startDate + '年 ' + data.name"
                  v-for="(pic, index) of items.aList"
                  :key="pic.dcid"
                >
                <div class="data-pic-null" v-show="photoNull">
                  <img src="static/img/null.png" style="cursor:default">
                  <div class="data-null-info">暂无图片</div>
                </div>
              </span>
              <div class="tab-video" v-else>
                <img
                  src="static/img/video/play.jpg"
                  @click="ShowBigVideo(vid.dcid)"
                  title="观看视频"
                  v-if="vid.format.toUpperCase() == 'MP4'"
                  v-for="(vid, index) of items.aList"
                  :key="vid.dcid"
                >
                <div class="data-vid-null" v-show="videoNull">
                  <img src="static/img/null.png" style="cursor:default">
                  <div class="data-null-info">暂无视频</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-container>
    </div>

    <!-- 图片弹窗 -->
    <el-dialog
      :title="imgtitle"
      :visible.sync="dialogVisible"
      :before-close="closeBigPic"
      top="1vh"
      :width='this.dialogwidth'
      id="dialog-pic"
    >
      <div class="dialog-img">
        <el-carousel
          indicator-position="none"
          :autoplay="false"
          :initial-index="this.carouselArrIndex"
          :height="this.dialogheight"
          arrow="always"
          v-if="isCarouselShow"
          @change="changeCarousel"
        >
          <el-carousel-item v-for="carousel of carouselArr" :key="carousel.dcid" >
            <img ref="carouselIMG" :src="carousel.dcid">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <!-- 视频弹窗 -->
    <el-dialog title="观看视频" :visible.sync="dialogVisibleVideo" :before-close="closeBigVideo" id="dialog-vid">
      <div class="dialog-video">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import Vue from 'vue'
import J from 'jquery'
import {
  videoPlayer
} from 'vue-video-player'


export default {
  name: 'QueryListMedia',
  data() {
    return {
      imgsrc: '',
      imgtitle: '',
      carouselArr: [],
      carouselArrIndex: 0,
      radio: '1',
      activeName: '0',
      dialogheight: "500px",
      dialogwidth: "50%",
      photoData: [],
      videoData: [],
      photoNull: false,
      videoNull: false,
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "",
          src: "static/img/video/video.mp4" //url地址
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  },
  props: {
    MediaInfo: Array,
    tabledata: Array
  },
  components: {
    videoPlayer
  },
  computed: {
    ...mapState({
      isTabContentShow: state => state.map.isTabContentShow,
      dialogVisible: state => state.map.dialogVisible,
      dialogVisibleVideo: state => state.map.dialogVisibleVideo,
      isCarouselShow: state => state.map.isCarouselShow
    })
  },
  watch: {
    MediaInfo: {
      immediate: true,
      handler: function(val) {
        for (var i = 0; i < val.length; i++) {
          for (var j = 0; j < val[i].aList.length; j++) {
            val[i].aList[j].dcid = FMCONFIG.FMAxiosMedia + val[i].aList[j].dcid
          }
        }
        // 图片和视频数据分离
        // if (val.length != 0) {
        //   this.handlePVData(val)
        // }
        this.activeName = '0'
        this.radio = '1'
        this.changePic()
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeTabContentShow',
      'changeDialogVisible',
      'changeDialogVisibleVideo',
      'changeIsCarouselShow'
    ]),
    changePic() {
      this.changeTabContentShow(true)
    },
    changeVideo() {
      this.changeTabContentShow(false)
    },
    closeBigPic(done) {
      done()
      this.changeIsCarouselShow(false)
      this.changeDialogVisible(false)
    },
    closeBigVideo(done) {
      done()
      this.changeDialogVisibleVideo(false)
    },
    ShowBigPic(e, data, index) {
      let title = e.target.title
      this.imgtitle = title
      this.carouselArr = data
      this.carouselArrIndex = index
      this.dialogheight = e.target.naturalHeight.toString() + "px"
      this.dialogwidth = e.target.naturalWidth.toString() + "px"
      this.changeIsCarouselShow(true)
      this.changeDialogVisible(true)
    },
    ShowBigVideo(src) {
      this.playerOptions.sources[0].src = src
      this.changeDialogVisibleVideo(true)
    },
    handleClick(tab, event) {
      this.radio = '1'
      this.changePic()
    },
    changeCarousel(e) {
      this.dialogheight = this.$refs.carouselIMG[e].naturalHeight + "px"
      this.dialogwidth = this.$refs.carouselIMG[e].naturalWidth + "px"
    },
    handlePVData(val) {
      let that = this
      let format
      let photoData = JSON.parse(JSON.stringify(val))
      let videoData = JSON.parse(JSON.stringify(val))
      for (let i = 0; i < val.length; i++) {
        photoData[i].aList = []
        videoData[i].aList = []
        for (let j = 0; j < val[i].aList.length; j++) {
          format = val[i].aList[j].format
          //图片
          if (format.toUpperCase() == 'JPG') {
            photoData[i].aList.push(JSON.parse(JSON.stringify(val[i].aList[j])))
          }
          //视频
          if (format.toUpperCase() == 'MP4') {
            videoData[i].aList.push(JSON.parse(JSON.stringify(val[i].aList[j])))
          }
        }
      }
      that.photoData = photoData
      that.videoData = videoData
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.query-list-media {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 998;
    width: 40%;
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 8px #85a1b9;
    box-shadow: 0 1px 8px #85a1b9;
    .el-container {
        width: 100%;
        height: 12em;
    }
    .el-tabs {
        width: 100%;
        .el-tab-pane {
            margin-top: -12px;
        }
    }
    .tab-content {
        overflow: hidden;
        height: 100%;
        margin-top: 5px;
        img {
            width: 95px;
            height: 95px;
            margin-right: 5px;
            cursor: pointer;
        }
        .data-null-info {
            width: 75px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
        }
    }
}
.dialog-img {
    text-align: center;
}
</style>
