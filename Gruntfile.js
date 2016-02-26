module.exports = function (grunt)
{
    "use strict";

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig(
        {
            pkg: grunt.file.readJSON('package.json'),
            browserify:
            {
                dev:
                {
                    files:
                    {
                        'src/tsnode/ui/dashboard.b.js': ['src/tsnode/ui/dashboard.js']
                    },
                    options:
                    {

                        debug: true

                    }
                }
            },
            karma:{
                unit:{
                    configFile:"./spec/ui/karma.conf.js"
                }
            }
        });
};
