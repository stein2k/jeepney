const { task, series, src, dest, parallel } = require('gulp');
const { log } = require('gulp-util');
const path = require('path');
const exec = require('child_process').exec;
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');

function logExec(stdout, stderr) {
    if (stdout) {
        stdout.toString().trim()
            .split(/\r?\n/)
            .forEach((line) => {
                log(line);
            });
    }

    if (stderr) {
        stderr.toString().trim()
            .split(/\r?\n/)
            .forEach((line) => {
                log(colors.red(line));
            });
    }
}

function getNativeBuildOptions() {
    // const target = (argv.rebuild ? 'Rebuild' : 'Build');
    const config = 'Release';
    const arch = process.arch === 'x64' ? 'x64' : 'Win32';
    // const verbose = (argv.verbose ? '' : 'ErrorsOnly;WarningsOnly')
    const outDir = 'out/';
    const networkOutDir = 'out/native/network/' + config + '/' + arch + '/';
    const outArch = arch === 'x64' ? '64' : '';

    return {
        target: 'Build',
        config: config,
        arch: arch,
        verbose: 'ErrorsOnly;WarningsOnly',
        outDir: outDir,
        networkOutDir: networkOutDir,
        outArch: outArch
    };
}

task('clean', clbk =>{
    const opts = getNativeBuildOptions();
    var del = require('del');
    del(path.join(opts.outDir,'**')).then(function(){
      clbk();
    });
});

task('compile-typescript', (clbk) => {
    const tsproj = typescript.createProject('src/tsconfig.json');
    return tsproj.src()
        .pipe(sourcemaps.init())
        .pipe(tsproj())
        .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src', 'jeepney')), includeContent: false}))
        .pipe(dest('out/jeepney'));    

});

// task('compile-typescript', parallel( (clbk) => {
//     const tsproj = typescript.createProject('src/jeepney/workbench/tsconfig.json');
//     return tsproj.src()
//         .pipe(sourcemaps.init())
//         .pipe(tsproj())
//         .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src', 'jeepney')), includeContent: false}))
//         .pipe(dest('dist/jeepney'));
// }, (clbk) => {
//     const tsproj = typescript.createProject('src/tsconfig.json');
//     return tsproj.src()
//         .pipe(sourcemaps.init())
//         .pipe(tsproj())
//         .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src', 'jeepney')), includeContent: false}))
//         .pipe(dest('dist/jeepney'));    

// }));

task('build-core', parallel('compile-typescript', (clbk)=>{
    const opts = getNativeBuildOptions();
    return src(['src/bootstrap-amd.js', 'src/bootstrap-window.js', 'src/bootstrap.js', 'src/hello.js', 'src/main.js'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src'))}))
        .pipe(dest(opts.outDir));
}, (clbk)=>{
    const opts = getNativeBuildOptions();
    return src(['src/jeepney/loader.js'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src/jeepney'))}))
        .pipe(dest(path.join(opts.outDir, 'jeepney')));
}, (clbk)=>{
    const opts = getNativeBuildOptions();
    return src(['src/jeepney/hello.js'])
        .pipe(babel({plugins: ['@babel/plugin-transform-modules-amd']}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {sourceRoot: path.resolve(path.join(__dirname, 'src/jeepney'))}))
        .pipe(dest(path.join(opts.outDir, 'jeepney')));
}));

task('build-addon', (clbk)=>{
    const opts = getNativeBuildOptions();
    const arch = opts.arch === 'Win32' ? 'ia32' : 'x64';
    const gypPath = path.join(__dirname, '/node_modules/.bin/node-gyp');
    const module_path = 'build/Release/addon.node';
    return exec('cd src/native/addon && ' + gypPath + ' clean configure build --arch=' + arch, function (err, stdout, stderr) {
        logExec(stdout);
        logExec(stderr); // node-gyp sends info through stderr and we don't want to treat it as error
        clbk(err);
    });
});

task('move-assets', (clbk) => {
    const opts = getNativeBuildOptions();
    return src(['src/jeepney/core/electron-browser/index.html', 'src/jeepney/core/electron-browser/index.js'], {base: 'src/'})
        .pipe(dest(path.join(opts.outDir)))
});

task('build', series('clean', parallel('build-core', 'build-addon', 'move-assets')));