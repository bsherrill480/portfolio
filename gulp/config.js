export default {

    browserPort: 5000,
    UIPort: 3001,
    testPort: 3002,

    sourceDir: './app/',
    buildDir: './build/',

    styles: {
        src: 'app/styles/main.scss',
        srcAll: 'app/styles/**/*.scss', 
        ignore: '!app/styles/**/my_flat_style_tweaks.scss',
        dest: 'build/css',
        prodSourcemap: false,
        sassIncludePaths: []
    },

    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/js',
        test: 'test/**/*.js',
        gulp: 'gulp/**/*.js',
        server: 'server/**/*.js'
    },

    images: {
        src: 'app/images/**/*',
        dest: 'build/images'
    },

    fonts: {
        src: ['app/fonts/**/*'],
        dest: 'build/fonts'
    },

    assetExtensions: [
        'js',
        'css',
        'png',
        'jpe?g',
        'gif',
        'svg',
        'eot',
        'otf',
        'ttc',
        'ttf',
        'woff2?'
    ],

    views: {
        index: 'app/index.html',
        src: 'app/views/**/*.html',
        dest: 'app/js'
    },

    gzip: {
        src: 'build/**/*.{html,xml,json,css,js,js.map,css.map}',
        dest: 'build/',
        options: {}
    },

    browserify: {
        bundleName: 'main.js',
        prodSourcemap: false
    },

    test: {
        karma: 'test/karma.conf.js',
        protractor: 'test/protractor.conf.js'
    },

    BROWSER_SYNC_RELOAD_DELAY: 500,

    server: {
        path: 'server/',
        tests: 'test/server_unit/**/*spec.js',
        file: 'server/index.js', // from top directory
        files: 'server/**/*.js',
        testTemp: 'test_tmp/'
    },

    init: function() {
        this.views.watch = [
            this.views.index,
            this.views.src
        ];

        return this;
    }

}.init();
