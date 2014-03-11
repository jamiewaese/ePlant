module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "style/css/main.css": "style/less/main.less"
        }
      }
    },
    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['style/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  grunt.registerTask('default', ['watch']);
};