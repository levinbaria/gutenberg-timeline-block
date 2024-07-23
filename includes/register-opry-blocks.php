<?php
/**
 * Register Blocks
 *
 * @package OPRY_Blocks
 */
function opry_block_register() {

	$all_blocks = array(
		array(
			'name'    => 'opry-timeline',
			'options' => array(),
		),
	);

	foreach ( $all_blocks as $block ) {
		register_block_type(
			OPRY_BLOCK_PLUGIN_DIR . 'assets/build/blocks/' . $block['name'] . '/block.json',
			isset( $block['options'] ) ? $block['options'] : array()
		);
	}
}
add_action( 'init', 'opry_block_register' );
