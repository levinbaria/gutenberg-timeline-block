/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save(props) {
	const { attributes } = props;
	const { productImgs, productUrls, productTitles } = attributes;

	const blockProps = useBlockProps.save({
		className: "pog-image-block"
	});

	const initialDisplayCount = 30; // Initial number of products to display

	// Helper function to generate product items
	const generateProductItems = () => {
		return productImgs.map((productImg, index) => (
			(productImg?.url && productTitles[index]) && (
				<div
					key={index}
					className={`pog-products__individual-product-wrapper ${index >= initialDisplayCount ? 'pog-products__hidden' : ''}`}
					data-index={index}
				>
					{productUrls[index] ? (
						<a href={productUrls[index]} className='pog-products__product-image' target='_blank' rel='noopener noreferrer'>
							<img src={productImg.url} alt={productImg.alt || 'product-image'} />
						</a>
					) : (
						<div className='pog-products__product-image'>
							<img src={productImg.url} alt={productImg.alt || 'product-image'} />
						</div>
					)}
					{productUrls[index] ? (
						<a className='pog-products__product-title' href={productUrls[index]} target='_blank' rel='noopener noreferrer'>
							<RichText.Content tagName='h3' value={productTitles[index]} />
						</a>
					) : (
						<div className='pog-products__product-title'>
							<RichText.Content tagName='h3' value={productTitles[index]} />
						</div>
					)}
				</div>
			)
		));
	};

	return (
		<div {...blockProps}>
			{/* Main Section for the Product Block */}
			<section className='pog-products__main-container'>
				<div className='pog-products__products-listout'>
					{/* Individual Product card */}
					<div className='pog-products__products-wrapper' id='products__wrapper'>
						{generateProductItems()}
					</div>
				</div>
				<div id='load-more-trigger' className='pog-products__load-more-trigger'>
					{/* Spinner */}
					<div className='load-more-products'></div>
				</div>
			</section>
		</div>
	);
}
