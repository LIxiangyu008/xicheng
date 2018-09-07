<template>
<div class="upload-wrap">
  <el-upload class="upload-demo" action="11" :show-file-list="false" :auto-upload="false" :on-change="change">
    <el-button type="primary" icon="el-icon-upload2" circle title="上传面数据txt" @click="currentGeoType = 'polygon'"></el-button>
    <el-button type="warning" icon="el-icon-upload" circle title="上传线数据txt" @click="currentGeoType = 'polyline'"></el-button>
  </el-upload>
</div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
let impGeo = null;

export default {
  name: 'LUpload',
  data() {
    return {
      currentGeoType: "polygon"
    }
  },
  mounted() {

  },
  computed: {
    ...mapState({})
  },
  methods: {
    ...mapMutations([]),
    change(e) {
      let self = this;
      this.readTxtFile(e, function(data) {
        EventBus.$emit('toolbar-addTxtData', data, self.currentGeoType);
      }, function() {
        self.$message.warning('上传失败')
      })
    },
    readTxtFile(input, sc, ec) {
      //支持chrome IE10
      if (window.FileReader) {
        let file = input.raw;
        let reader = new FileReader();
        reader.onload = function() {
          sc(this.result);
        };
        reader.readAsText(file);
      }
      //支持IE 7 8 9 10
      else if (typeof window.ActiveXObject != 'undefined') {
        let xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        sc(xmlDoc);
      }
      //支持FF
      else if (document.implementation && document.implementation.createDocument) {
        let xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        sc(xmlDoc);
      } else {
        ec();
      }
    },
  },
  destroy() {

  }
}
</script>

<style type="text/css" scoped lang="scss">
.upload-wrap {
    z-index: 9999;
    position: absolute;
    right: 120px;
    top: 60px;
}
</style>
