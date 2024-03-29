const fs = require("fs-extra");
const path = require("path");

const listDirFiles = ["assets"];
const source = "../public";
const dest = process.env.STATIC_DIR || "build";

Promise.all(listDirFiles.map(item => fs.copy(path.resolve(__dirname, source + "/" + item), path.resolve(__dirname,"../" + dest + "/" + item), {overwrite: true})))
    .then(() => console.log("Copying asset files successful!"))
    .catch((err) => console.log(err))
;
