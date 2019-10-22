const gulp = require("gulp");
const spawn = require('child_process').spawn;
const nodemon = require("gulp-nodemon");



const stylusCompiler = {
    watch: (desk) => {
        require("./compile-stylus").createCompiler(desk).watch();
    },
    compile: (desk) => {
        return require("./compile-stylus").createCompiler(desk).compile();
    }
};

const startServer = async (env) => {
    return nodemon({
        script: './server/server.js',
        ext: 'js',
        ignore: [
            ".idea/",
            ".git/",
            "gulpfile.js",
            "client/*",
            "public/*",
            "webpack.config.js",
            "webpack.prod.config.js",
            "build/*",
            "dist/*",
            "uploads/*"
        ],
        env,
        stdout: true,
        exec: "babel-node"
    })
};

gulp.task("dev", () => {
    return startServer({'NODE_ENV': 'development', 'IS_DEFAULT': "true"}).then(() => {
        return stylusCompiler.watch(process.env.STATIC_DIR || "build");

    }).then(() => {
        if (!/^win/.test(process.platform)) { // linux
            return spawn("webpack", ["--watch"], {stdio: "inherit"});
        } else {
            return spawn('cmd', ['/s', "/c", "webpack", "--w"], {stdio: "inherit"});
        }
    }).then(() => {
        return require("./scripts/copy-assets");

    });

});
gulp.task("devPeer", () => {
    return startServer({'NODE_ENV': 'development'}).then(() => {
        return stylusCompiler.watch(process.env.STATIC_DIR || "build");

    }).then(() => {
        if (!/^win/.test(process.platform)) { // linux
            return spawn("webpack", ["--watch"], {stdio: "inherit"});
        } else {
            return spawn('cmd', ['/s', "/c", "webpack", "--w"], {stdio: "inherit"});
        }
    }).then(() => {
        return require("./scripts/copy-assets");

    });

});

gulp.task("prod", () => {
    return startServer().then(() => stylusCompiler.compile(process.env.STATIC_DIR).then(() => {
        if (!/^win/.test(process.platform)) { // linux
            return spawn("webpack", ["--config ./webpack.prod.config.js"], {stdio: "inherit"});
        } else {
            return spawn('cmd', ['/s', "/c", "webpack", "--config ./webpack.prod.config.js"], {stdio: "inherit"});
        }
    })).then(() => require("./scripts/copy-assets"));
});

