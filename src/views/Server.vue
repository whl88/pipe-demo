<template>
  <div class="main">
    <div>
      <video class="origin-video" ref="video" muted autoplay controls></video>
    </div>
    <div class="button-box">
      <button @click="play">播放</button>
    </div>
  </div>
</template>

<script>
import frameGen from "@/service/FrameGen.js";
import { PipeServer } from "@/tool/Pipe.js";
const { ipcRenderer } = require('electron');
export default {
  name: "HelloWorld",
  data() {
    return {
      ws: null,
      audioSource: null,
      sourcerBuffer: null,
    };
  },
  mounted() {
    this.frameGen = new frameGen();
    this.frameGen.init().then(() => {
      this.$refs.video.srcObject = this.frameGen.stream;
      this.sendFrame();
    });

    this.pipeServer = new PipeServer("asdf");
  },
  methods: {
    play() {
      ipcRenderer.send('open-window',`${window.location.href}client`,true)
    },

    sendFrame(timestamp = performance.now()) {
      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
      }
      if (timestamp - this.lastTimestamp >= 40) {
        this.pipeServer.sendData(
          Uint8Array.from(this.frameGen.getFrame().data)
        );
        this.lastTimestamp = timestamp;
      }
      window.requestAnimationFrame(this.sendFrame.bind(this));
    },
  },
};
</script>

<style scoped>
.origin-video {
  width: 500px;
}
canvas {
  border: 1px solid #000;
  width: 500px;
}
</style>
