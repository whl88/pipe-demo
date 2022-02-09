const ws = require("nodejs-websocket");

class Socket {
  constructor({ option = {} }) {
    // 设备信息
    this.camera = option.camera;
    // 端口
    this.port = option.port;
    // 回调方法
    this.call = option.on;
    // 当前连接
    this.serve = "";
    this.create();
  }

  // 客户端连接成功
  _getSockerOpen(body) {
    this.serve.sendText(
      JSON.stringify({
        event: "camera-info",
        body: {
          info: this.camera,
        },
      })
    );
  }

  // 换脸开始
  _getStart(body) {
    this.call.start(body);
  }

  // 换脸暂停
  _getStop(body) {
    this.call.stop(body);
  }

  // 切换模型
  _getFaceModel(body) {
    this.call.faceModel(body);
  }

  create() {
    console.log('cr4eate')
    ws.createServer((conn) => {
      console.log('sssss', conn)
      this.serve = conn;
      // 接收客户端返回的数据
      conn.on("text", (str) => {
        try {
          let data = JSON.parse(str);
          if (data && data.event === "sockerOpen") {
            this._getSockerOpen(data.body);
          }
          if (data && data.event === "start") {
            if (!this.serve) return;
            this._getStart(data.body);
          }
          if (data && data.event === "stop") {
            if (!this.serve) return;
            this._getStop(data.body);
          }
          if (data && data.event === "faceModel") {
            if (!this.serve) return;
            this._getFaceModel(data.body);
          }
        } catch (err) {
          console.log(err);
          console.log(str, err);
        }
      });

      // 客户端关闭连接
      conn.on("close", (str) => {
        console.log("客户端关闭连接");
        this.serve = "";
      });

      conn.on("error", (str) => {
        console.log(err, "连接报错");
        this.serve = "";
      });
    }).listen(this.port, () => {
      console.log('electron ws is ok')
    });
  }
}

export default Socket;
