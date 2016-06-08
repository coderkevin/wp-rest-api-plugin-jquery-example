module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig( {
		makepot: {
			options: {
				type: 'wp-plugin',
				domainPath: '/languages',
				potHeaders: {
					'report-msgid-bugs-to': 'https://github.com/coderkevin/wp-rest-api-plugin-jquery-example/issues'
				}
			},
			dist: {
				options: {
					potFilename: 'wp-rest-api-plugin-jquery-example.pot'
				}
			}
		},
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
}
