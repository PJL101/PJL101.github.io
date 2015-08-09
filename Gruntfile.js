module.exports = function(grunt) {

  'use strict';

  // Time grunt tasks
  require('time-grunt')(grunt);

  // Load all grunt tasks
  require('jit-grunt')(grunt);

  grunt.initConfig({
    // Read needed files
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),

    // Clean files
    clean: {
      dist: [
        '<%= site.dist %>',
      ],
      bower: [
        'bower_components',
        'bower_filtered',
        '<%= site.srcAssets %>/scss/vendor/bower',
        '<%= site.srcAssets %>/js/vendor/bower',
      ],
      grunticon: [
        '_grunticon',
        '_tmp-icon'
      ]
    },

    // Copy files
    copy: {
      bower: {
        files: [{
          expand: true,
          cwd: 'bower_filtered',
          src: ['**/*'],
          dest: '<%= site.srcAssets %>'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/fonts/',
          src: ['**/*'],
          dest: '<%= site.distAssets %>/fonts/'
        }]
      },
      files: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/files/',
          src: ['**/*'],
          dest: '<%= site.dist %>/'
        }]
      },
      grunticon: {
        files: [{
          expand: true,
          cwd: '_grunticon/',
          src: ['**/*', '!*.js', '!*.html'],
          dest: '<%= site.dist %>/'
        }]
      }
    },

    // Run shell tasks
    shell: {
      bower: {
        command: 'bower-installer'
      }
    },

    // Assemble
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.distAssets %>',
        partials: ['<%= site.partials %>', '<%= site.layouts %>'],
        helpers: '<%= site.helpers %>',
        layout: false,
        data: '<%= site.data %>',
      },
      site: {
        src: '<%= site.pages %>',
        dest: '<%= site.dist %>/'
      }
    },

    // Csscomb
    csscomb: {
      partials: {
        expand: true,
        cwd: '<%= site.srcAssets %>/scss/partials/',
        src: ['**/*.scss'],
        dest: '<%= site.srcAssets %>/scss/partials/',
        ext: '.scss'
      },
      modules: {
        expand: true,
        cwd: '<%= site.srcAssets %>/scss/modules/',
        src: ['**/*.scss'],
        dest: '<%= site.srcAssets %>/scss/modules/',
        ext: '.scss'
      }
    },

    // Compile SASS
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/scss/',
          src: ['**/*.scss'],
          dest: '<%= site.distAssets %>/css',
          ext: '.css'
        }],
        options: {
          sourceComments: false,
          sourceMap: true,
          sourceMapContents: true,
          sourceMapEmbed: false
        }
      },
      prd: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/scss/',
          src: ['**/*.scss'],
          dest: '<%= site.distAssets %>/css',
          ext: '.css'
        }],
        options: {
          sourceComments: false,
          sourceMap: false,
          sourceMapContents: false,
          sourceMapEmbed: false
        }
      }
    },

    // Postcss functions
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('postcss-will-change'), // Will change fallback
            require('autoprefixer-core')(), // add vendor prefixes
            require('css-mqpacker')(), // Combine media queries
          ],
        },
        src: '<%= site.distAssets %>/css/**/*.css',
      },
      prd: {
        options: {
          map: false,
          processors: [
            require('postcss-will-change'), // Will change fallback
            require('autoprefixer-core')(), // add vendor prefixes
            require('css-mqpacker')(), // Combine media queries
            require('cssnano')(), // minify stylesheet
          ],
        },
        src: '<%= site.distAssets %>/css/**/*.css',
      }
    },

    // Change to rem units
    px_to_rem: {
      dev: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
        options: {
          fallback: false,
          fallback_existing_rem: false,
          map: true,
          ignore: ['content']
        }
      },
      prd: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
        options: {
          fallback: false,
          fallback_existing_rem: false,
          map: false,
          ignore: ['content']
        }
      },
    },

    // Image minification
    imagemin: {
      img: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{

          }]
        },
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/img/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= site.distAssets %>/img/'
        }]
      },
      grunticon: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{

          }]
        },
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/icons/',
          src: ['**/*.{png,svg}'],
          dest: '_tmp-icon/'
        }]
      }
    },

    // Grunticon
    grunticon: {
      prd: {
        files: [{
            expand: true,
            cwd: '_tmp-icon/',
            src: ['**/*.{png,svg}'],
            dest: "_grunticon"
        }],
        options: {
          pngfolder: 'assets/img/icon-fallback/'
        }
      }
    },

    // JSHint modules
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: false
      },
      all: [
        '<%= site.gruntFile %>',
        '<%= site.srcAssets %>/js/global.js',
        '<%= site.srcAssets %>/js/modules/**/*.js',
        '<%= site.srcAssets %>/js/main.js',
      ]
    },

    // Modernizr
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%= site.srcAssets %>/js/vendor/bower/modernizr-custom.js',
        extra: {
          "shiv" : false,
          "printshiv": false,
          "load": false,
          "mq": false,
          "cssclasses": true
        },
        uglify: false,
        files: {
          src: [
            '<%= site.srcAssets %>/js/**/*.js',
            '<%= site.distAssets %>/css/**/*.css'
          ]
        }
      }
    },

    // Uglify Javascript
    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          preserveComments: 'all',
          beautify: true,
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: {
          '<%= site.distAssets %>/js/head.js': ['<%= site.srcAssets %>/js/head/**/*.js'],
          '<%= site.distAssets %>/js/site.js': [
            '<%= site.srcAssets %>/js/global.js',
            '<%= site.srcAssets %>/js/vendor/**/*.js',
            '<%= site.srcAssets %>/js/plugins/**/*.js',
            '<%= site.srcAssets %>/js/modules/**/*.js',
            '<%= site.srcAssets %>/js/main.js',
          ]
        }
      },
      prd: {
        options: {
          mangle: true,
          compress: true,
          beautify: false,
          preserveComments: 'some',
          sourceMap: false,
          sourceMapIncludeSources: false
        },
        files: {
          '<%= site.distAssets %>/js/head.js': ['<%= site.srcAssets %>/js/head/**/*.js'],
          '<%= site.distAssets %>/js/site.js': [
            '<%= site.srcAssets %>/js/global.js',
            '<%= site.srcAssets %>/js/vendor/**/*.js',
            '<%= site.srcAssets %>/js/plugins/**/*.js',
            '<%= site.srcAssets %>/js/modules/**/*.js',
            '<%= site.srcAssets %>/js/main.js',
          ]
        }
      },
    },

    // HTML minification
    htmlmin: {
      prd: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: ['**/*.html'],
          dest: '<%= site.dist %>',
        }]
      }
    },

    // Critical CSS
    critical: {
      dev: {
        options: {
          base: './',
          css: [
            '<%= site.distAssets %>/css/site.css'
          ],
          minify: false,
          width: 1300,
          height: 900
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: ['**/*.html'],
          dest: '<%= site.dist %>'
        }]
      },
      prd: {
        options: {
          base: './',
          css: [
            '<%= site.distAssets %>/css/site.css'
          ],
          minify: true,
          width: 1300,
          height: 900
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: ['**/*.html'],
          dest: '<%= site.dist %>'
        }]
      }
    },

    // Start server & watch
    browserSync: {
      dev: {
        bsFiles: {
          src: [
           '<%= site.distAssets %>/**/*',
           '<%= site.dist %>/**/*.html'
          ]
        },
        options: {
          server: '<%= site.dist %>',
          watchTask: true
        }
      }
    },

    // Watch for changes
    watch: {
      js: {
        files: ['<%= site.srcAssets %>/js/**/*.js'],
        tasks: ['jshint', 'uglify:dev'],
      },
      scss: {
        files:['<%= site.srcAssets %>/scss/**/*.scss'],
        tasks:['csscomb', 'sass:dev', 'postcss:dev', 'px_to_rem:dev', 'critical:dev'],
      },
      img: {
        files: ['<%= site.srcAssets %>/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['newer:imagemin:img'],
      },
      grunticon: {
        files: ['<%= site.srcAssets %>/icons/**/*.{png,svg}'],
        tasks: ['imagemin:grunticon', 'grunticon', 'copy:grunticon'],
      },
      fonts: {
        files: ['<%= site.srcAssets %>/fonts/**/*'],
        tasks: ['newer:copy:fonts'],
      },
      files: {
        files: ['<%= site.srcAssets %>/files/**/*'],
        tasks: ['newer:copy:files'],
      },
      assemble: {
        files: ['<%= site.templates %>/**/*', '_config.yml'],
        tasks: ['assemble'],
      },
    },

    // Bump task
    // Use by running: 'grunt bump:patch', 'grunt bump:minor', 'grunt bump:major'
    bump: {
      options: {
        files: ['package.json', 'README.md'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'README.md'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
  });

  // Tasks
  grunt.registerTask('dev', [
    'clean',
    'shell:bower',
    'copy:bower',
    'assemble',
    'csscomb',
    'sass:dev',
    'postcss:dev',
    'px_to_rem:dev',
    'imagemin',
    'grunticon:prd',
    'copy:grunticon',
    'jshint',
    'modernizr',
    'uglify:dev',
    'copy:fonts',
    'copy:files',
    'critical:dev',
    'browserSync',
    'watch',
  ]);

  grunt.registerTask('prd', [
    'clean',
    'shell:bower',
    'copy:bower',
    'assemble',
    'csscomb',
    'sass:prd',
    'postcss:prd',
    'px_to_rem:prd',
    'imagemin',
    'grunticon:prd',
    'copy:grunticon',
    'jshint',
    'modernizr',
    'uglify:prd',
    'copy:fonts',
    'copy:files',
    'critical:prd',
    'htmlmin:prd',
  ]);

  grunt.registerTask('default', 'dev');
  grunt.registerTask('reset', ['clean']);
};
