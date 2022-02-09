<template>
  <div class="main">
    <div>
      <video class="origin-video" ref="video" muted autoplay controls></video>
      <canvas ref="canvas"></canvas>
    </div>
    <div class="button-box">
      <button @click="saveFrame">saveFrame</button>
      <button @click="putFrame">putFrame</button>
      <button @click="play()">播放</button>
    </div>
  </div>
</template>

<script>
import frameGen from "@/service/FrameGen.js";
import Pipe from "@/tool/Pipe.js";
const { saveToFile, readImageData } = require("@/tool/IO.js");
const path = require("path");
// import Socket from "./Socket";

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
    this.ctx = this.$refs.canvas.getContext("2d");
    this.frameGen = new frameGen();
    this.frameGen.init().then(() => {
      this.$refs.video.srcObject = this.frameGen.stream;
    });

    this.pipe = new Pipe();
    this.ipcServer = this.pipe.createIPC("asdf");

    this.pipe.on("frame", (data) => {
      const frameImageData = new ImageData(
        Uint8ClampedArray.from(data),
        1920,
        1080
      );

      this.$refs.canvas.width = 1920;
      this.$refs.canvas.height = 1080;
      this.ctx.putImageData(frameImageData, 0, 0);
    });

    this.ipcClient = this.pipe.connectIPC("asdf");
  },
  methods: {
    saveFrame() {
      const frame = this.frameGen.getFrame();
      saveToFile(frame, path.resolve("./frame"));
    },
    putFrame() {
      const imageData = readImageData(path.resolve("./frame"), 1920, 1080);

      this.$refs.canvas.width = 1920;
      this.$refs.canvas.height = 1080;
      this.ctx.putImageData(imageData, 0, 0);
    },
    play(timestamp = performance.now()) {
      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
      }
      if (timestamp - this.lastTimestamp >= 40) {
        this.ipcClient.write(Uint8Array.from(this.frameGen.getFrame().data));
        this.lastTimestamp = timestamp;
      }
      window.requestAnimationFrame(this.play.bind(this));
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
