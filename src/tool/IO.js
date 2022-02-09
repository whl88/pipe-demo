const fs = require('fs')

function saveToFile(data,filePath){
    if(fs.existsSync(filePath)){
        fs.rmSync(filePath)
    }
    console.log('path', filePath)
    fs.writeFileSync(filePath,data.data)
    console.log('Write File OK!')
}

function readImageData(filePath,width,height){
    const frameData = Uint8ClampedArray.from(
        readFile(filePath)
      );
    return new ImageData(frameData, width, height);
}

function readFile(filePath){
    return fs.readFileSync(filePath)
}

module.exports = {
    saveToFile,
    readImageData
}