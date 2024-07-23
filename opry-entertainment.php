<?php
/**
 * Plugin Name: Opry Entertainment
 * Description: This is the Opry Entertainment Plugin for the Gutenberg Blocks.
 * Version: 1.0
 * Author: Levin Baria
 * Author Uri: https://training-levinb.md-staging.com/mynotes/
 */

defined( 'ABSPATH' ) || exit;

define( 'OPRY_BLOCK', '1.0' );
define( 'OPRY_BLOCK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Render CB files for the blocks
 */
$all_includes_files   = glob( OPRY_BLOCK_PLUGIN_DIR . 'includes/*.php' );
$all_includes_folders = glob( OPRY_BLOCK_PLUGIN_DIR . 'includes/**/*.php' );
$all_includes         = array_merge( $all_includes_files, $all_includes_folders );

foreach ( $all_includes as $file ) {
	require_once $file;
}

/**
 * Function for Block Categories.
 *
 * @return @array of $categories.
 */
function opry_blocks_custom_category( $categories ) {

	$categories[] = array(
		'slug'  => 'opry-blocks-custom-category',
		'title' => 'Opry Entertainment',
	);

	return $categories;
}
// Creating Custom Category for the Opry Blocks.
add_filter( 'block_categories_all', 'opry_blocks_custom_category', 10, 2 );

/**
 * Enqueues jQuery and jQuery UI Sortable scripts.
 */
function opry_blocks_editor_enqueue_scripts() {
	// Enqueue jQuery script from WordPress core.
	wp_enqueue_script( 'jquery' );

	// Enqueue jQuery UI Sortable script from WordPress core.
	wp_enqueue_script( 'jquery-ui-sortable', array( 'jquery' ), false, true );
}

add_action( 'enqueue_block_assets', 'opry_blocks_editor_enqueue_scripts' );
