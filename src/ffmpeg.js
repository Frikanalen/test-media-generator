"use strict";
var ffmpeg = require("fluent-ffmpeg");
var fs = require("fs");
var testVideos = [
    {
        source: "ffmpeg",
        command: "-f lavfi -i testsrc=duration=10:size=1280x720:rate=30",
    },
];
// Create an ffmpeg filter line.
// Returns a string suitable for passing directly into a complex filter graph.
var ffmpegTextFilter = function (v) {
    var fontFile = "node_modules/@fontsource/open-sans/files/open-sans-latin-ext-600-normal.woff";
    if (!fs.existsSync(fontFile)) {
        throw new Error("Font file not found!");
    }
    var spacingPixels = v.height / 30;
    var text = "text='" + v.text + "\n%{pts\\:hms}'";
    var location = "x=(w-text_w)/2:y=(h*0.75)";
    var style = "box=1:boxcolor=0x00000000@1:boxborderw=" + spacingPixels + ":line_spacing=" + spacingPixels;
    var font = "fontcolor=white:fontsize=(h/20):fontfile=" + fontFile;
    return "drawtext=" + text + ":" + location + ":" + style + ":" + font;
};
var ffmpegCommand = function (v) {
    var command = ffmpeg()
        .input("testsrc=size=" + v.width + "x" + v.height + ":rate=" + v.framerate)
        .inputFormat("lavfi")
        .duration(v.seconds)
        .complexFilter([ffmpegTextFilter(v)])
        .output("test.mp4")
        .outputFormat("mp4")
        .on("end", function () {
        console.log("Finished processing");
    })
        .on("progress", function (_a) {
        var frames = _a.frames;
        var percent = (frames / v.framerate / v.seconds) * 100;
        console.log("Processing: " + percent + "% done");
    })
        .on("error", function (x) {
        console.log("Error: " + x);
    })
        .run();
};
ffmpegCommand({
    seconds: 1,
    width: 1280,
    height: 720,
    framerate: 50,
    text: "Hello, world!",
    format: "mp4",
    filename: "test.mp4",
});
//# sourceMappingURL=index.js.map