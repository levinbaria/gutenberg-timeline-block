<?php
/**
 * Registers the md-modules/sample block.
 *
 * @global array    $attrs   Block attributes passed to the render callback.
 * @global string   $content Block content from InnerBlocks passed to the render callback.
 * @global WP_Block $block   Block registration object.
 *
 * @package md-modules
 */

namespace md_modules\Blocks;

use md_modules\Inc\Block_Base;

/**
 *  Class for the md-modules/sample block.
 */
class Pog_Product_Images extends Block_Base {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->_block = 'pog-product-images';
	}
}
