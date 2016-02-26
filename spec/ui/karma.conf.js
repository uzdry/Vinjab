module.exports = function(config)
{
    config.set({

        basePath: '',

        frameworks: ['browserify', 'jasmine-jquery', 'jasmine'],

        files: [
            '../../bower_components/lodash/lodash.js',
            '../../bower_components/jquery/jquery.min.js',
            '../../bower_components/conduitjs/lib/conduit.min.js',
            '../../src/lib/postal.js',
            '../../src/lib/underscore-min.js',
            '../../src/lib/backbone-min.js',
            '../../node_modules/jquery/dist/jquery.js',
            '../../node_modules/gridster/dist/jquery.gridster.js',
            '../../node_modules/socket.io-client/socket.io.js',
            '../../src/tsnode/ui/dataModel.js',
            '../../src/tsnode/ui/dataCollection.js',
            '../../src/tsnode/ui/widget.js',
            '../../src/tsnode/ui/Map.js',
            '../../src/tsnode/ui/widgets/*.js',
            '../../src/lib/*.js',
            '../../src/js/canv-gauge/gauge.js',
            './*-test.js',
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyCVDZqbOdFHkJ1buQP8m-aWPOg8Frlq-a4&signed_in=true&libraries=places'

        ],

        exclude: [
            '../../src/lib/postal.lodash*'
        ],

        preprocessors: {
            './*-test.js': ['browserify'],
            '../../src/tsnode/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['Firefox', 'Chrome'],

        browserify: {
            debug: true,
            transform: []
        },

        coverageReporter:{
            type: 'html',
            dir: 'coverage/'
        },

        plugins: [
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-browserify',
            'karma-jasmine-jquery',
            'karma-coverage'],

        singleRun: true
    });
};
