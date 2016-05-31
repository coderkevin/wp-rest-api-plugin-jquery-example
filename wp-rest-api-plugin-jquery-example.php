<?php /*

********************************************************************************

Plugin Name: REST API Plugin - JQuery Example
Plugin URI:  https://github.com/coderkevin/wp-rest-api-plugin-jquery-example
Description: Example code for using the WordPress REST API in a plugin
Version:     0.1.0
Author:      Kevin Killingsworth
Author URI:  https://github.com/coderkevin
License:     GPL-3.0+
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Requires at least: 4.4

Text Domain: rest-api-plugin-jquery-example
Domain Path: /languages/

*******************************************************************************/

defined( 'ABSPATH' ) or die( 'No direct access.' );

/**
 * Main class.
 */
class REST_API_Plugin_JQuery_Example {

	const VERSION = '0.1.0';

	public function __construct() {
		// Add an Admin Menu for our plugin.
		add_action( 'admin_menu', array( $this, 'attach_menu' ) );
	}

	public function attach_menu() {
		add_menu_page(
			__( 'REST API Plugin Example Using jQuery', 'rest-api-plugin-jquery-example' ),
			__( 'REST API Example', 'rest-api-plugin-jquery-example' ),
			'read',
			'rest-api-plugin-jquery-example',
			array( $this, 'output_page' ),
			null,
			null
		);
	}

	public function output_page() {

		wp_enqueue_script( 'jquery' );

		wp_enqueue_script(
			'rest-api-plugin-jquery-example-js',
			plugins_url( 'assets/js/rest-example-jquery.js', __FILE__ ),
			array(),
			REST_API_Plugin_JQuery_Example::VERSION,
			true
		);

		wp_localize_script( 'rest-api-plugin-jquery-example-js', 'screen_data', array(
			'api_root' => esc_url_raw( rest_url() ),
			'api_nonce' => wp_create_nonce( 'wp_rest' ),
			'i18n' => array(
				'post'       => __( "Post", 'rest-api-plugin-jquery-example' ),
				'author'     => __( "Author", 'rest-api-plugin-jquery-example' ),
			)
		) );

?>
	<div>
		<h1>REST API Plugin Example Using jQuery</h1>
		<p>This is the example page for using the REST API from a plugin using jQuery!</p>
		<div id="example-post-list">
		</div>
	</div>
<?php
	}

}

return new REST_API_Plugin_JQuery_Example();

