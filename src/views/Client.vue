<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { PipeClient } from "@/tool/Pipe.js";

export default {
  name: "Client",
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.pipeClient = new PipeClient("asdf");

    this.pipeClient.on("data", (data) => {
      const frameImageData = new ImageData(
        Uint8ClampedArray.from(data),
        1920,
        1080
      );

      this.$refs.canvas.width = 1920;
      this.$refs.canvas.height = 1080;
      this.ctx.putImageData(frameImageData, 0, 0);
    });
  },
};
</script>

