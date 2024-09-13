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
import { RichText, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
	* React hook that is used to mark the components element.
	*
	* @see https://developer.wordpress.org/block-editor/reference-guides/components/
	*/
import { Button, TextControl } from '@wordpress/components';
/**
 * React hook that is used to mark the element.
 * 
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
*/
import { Fragment, useState, useRef, useEffect } from '@wordpress/element';
/**
 * @dnd-kit/core for handling the dragging and dropping.
 */
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
/**
 * @dnd-kit/sortable for sorting the elements.
 */
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortableItem';
import './editor.css';

export default function Edit(props) {
	const {
		attributes,
		setAttributes
	} = props;

	const {
		editableMode,
		productImgs = [{ url: '', alt: '' }],
		productUrls = [''],
		productTitles = ['']
	} = attributes;

	// Ensure at least one product card is available when the block is initially added
	useEffect(() => {
		if (productImgs.length === 0) {
			setAttributes({
				productImgs: [{ url: '', alt: '' }],
				productTitles: [''],
				productUrls: ['']
			});
		}
	}, []);

	// State to handle the edit.
	const [editMode, setEditMode] = useState(editableMode);

	const [displayCount, setDisplayCount] = useState(30); // Number of items to display initially
	const [loading, setLoading] = useState(false); // Loading status
	const [hasMore, setHasMore] = useState(true);
	const loadMoreTriggerRef = useRef(null);


	const loadMoreItems = () => {
		if (!loading && hasMore) {
			setLoading(true);
			setTimeout(() => {
				setDisplayCount(prevCount => {
					const newDisplayCount = prevCount + 30;
					if (newDisplayCount >= productImgs.length) {
						setHasMore(false); // No more items to load
					}
					setLoading(false);
					return newDisplayCount;
				});
			}, 1000);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					loadMoreItems();
				}
			},
			{
				rootMargin: '100px', // Trigger load more a bit before reaching the bottom
			}
		);

		if (loadMoreTriggerRef.current) {
			observer.observe(loadMoreTriggerRef.current);
		}

		return () => {
			if (loadMoreTriggerRef.current) {
				observer.unobserve(loadMoreTriggerRef.current);
			}
		};
	}, [loading, hasMore]);


	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const updateAttributes = (newProductImgs, newProductTitles, newProductUrls) => {
		setAttributes({ productImgs: newProductImgs, productTitles: newProductTitles, productUrls: newProductUrls });
	};

	// Function to Handle the Finish part of the Block.
	const handleFinish = () => {
		setEditMode(false);
		setAttributes({ editableMode: false });
	};

	// Function to handle the Editing part of the Block.
	const handleEdit = () => {
		setEditMode(true);
		setAttributes({ editableMode: true });
	};

	// Function to add the Product Card.
	const addProductCard = () => {
		const newProductImgs = [{ url: '', alt: '' }, ...productImgs];
		const newProductTitles = ['', ...productTitles];
		const newProductUrls = ['', ...productUrls];
		updateAttributes(newProductImgs, newProductTitles, newProductUrls);
	};

	// Function to remove the Product Card.
	const removeProductCard = (index) => {
		if (productImgs.length > 1) {
			const newProductImgs = [...productImgs];
			const newProductTitles = [...productTitles];
			const newProductUrls = [...productUrls];
			newProductImgs.splice(index, 1);
			newProductTitles.splice(index, 1);
			newProductUrls.splice(index, 1);
			updateAttributes(newProductImgs, newProductTitles, newProductUrls);
		}
	};

	// Function to updatet the product card.
	const updateProductCard = (index, newImg, newTitle, newUrl) => {
		const newProductImgs = [...productImgs];
		const newProductTitles = [...productTitles];
		const newProductUrls = [...productUrls];
		if (newImg !== undefined) newProductImgs[index] = { ...newProductImgs[index], ...newImg };
		if (newTitle !== undefined) newProductTitles[index] = newTitle;
		if (newUrl !== undefined) newProductUrls[index] = newUrl;
		updateAttributes(newProductImgs, newProductTitles, newProductUrls);
	};

	// Function to handle the dragend.
	const handleDragEnd = (event) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = active.data.current.sortable.index;
			const newIndex = over.data.current.sortable.index;
			const newProductImgs = arrayMove(productImgs, oldIndex, newIndex);
			const newProductTitles = arrayMove(productTitles, oldIndex, newIndex);
			const newProductUrls = arrayMove(productUrls, oldIndex, newIndex);
			updateAttributes(newProductImgs, newProductTitles, newProductUrls);
		}
	};

	const blockProps = useBlockProps({
		className: 'pog-products',
	});

	// Function to show the rendered products.
	const renderedProducts = productImgs
		.slice(0, displayCount)
		.map((productImg, index) => (
			(editMode || productImg.url) ? (
				<SortableItem key={index} id={index.toString()} handle={!editMode}>
					<div className='pog-products__individual-product-wrapper'>
						{editMode && (
							<div className='pog-products__product-modification'>
								{productImgs.length > 1 && (
									<Button className="pog-products__remove-product" onClick={() => removeProductCard(index)} data-tooltip={__('Remove Product', 'pog-block')}>
										<i className='dashicons dashicons-no-alt'></i>
									</Button>
								)}
							</div>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => updateProductCard(index, { url: media.url, alt: media.alt })}
								allowedTypes={['image']}
								value={productImg}
								render={({ open }) => (
									<Fragment>
										{productImg?.url ? (
											<Fragment>
												<a className='pog-products__product-image'>
													<img src={productImg.url} alt={productImg.alt} />
												</a>
												{editMode && (
													<Fragment>
														<Button className='pog-products__change-img' onClick={open} data-tooltip={__('Change Image', 'pog-block')}>
															<i className='dashicons dashicons-edit'></i>
														</Button>
														<Button className='pog-products__remove-img' onClick={() => updateProductCard(index, { url: '', alt: '' })} data-tooltip={__('Remove Image', 'pog-block')}>
															<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
														</Button>
													</Fragment>
												)}
											</Fragment>
										) : (
											editMode && (
												<Button className='pog-products__upload-img' onClick={open} data-tooltip={__('Upload Image', 'pog-block')}>
													<i className='dashicons dashicons-cloud-upload'></i>
												</Button>
											)
										)}
									</Fragment>
								)}
							/>
						</MediaUploadCheck>
						{/* Text for the Product Title */}
						{editMode ? (
							<RichText
								tagName='h3'
								value={productTitles[index]}
								placeholder={__('Product Title', 'pog-block')}
								onChange={(value) => updateProductCard(index, undefined, value)}
							/>
						) : (
							<h3>{productTitles[index] || 'Product Title'}</h3>
						)}
						{editMode && (
							// Product URL.
							<TextControl
								label={__('Product URL', 'pog-block')}
								value={productUrls[index]}
								onChange={(value) => updateProductCard(index, undefined, undefined, value)}
							/>
						)}
					</div>
				</SortableItem>
			) : null
		))
		.filter(item => item !== null);


	// Function to equalize heights of cards within each row
	const equalizeRowHeights = () => {

		const productsWrapper = document.querySelector('.pog-products__products-wrapper');
		if (window.innerWidth >= 900) {
			const productItems = productsWrapper.querySelectorAll('.pog-products__individual-product-wrapper');
			const cardsPerRow = 3;
			// Reset all heights to auto to calculate row heights correctly
			productItems.forEach(item => item.style.height = 'auto');

			productItems.forEach((item, index) => {
				const rowStartIndex = Math.floor(index / cardsPerRow) * cardsPerRow;
				const rowEndIndex = rowStartIndex + cardsPerRow;
				const rowItems = Array.from(productItems).slice(rowStartIndex, rowEndIndex);

				let maxHeight = 0;

				rowItems.forEach(rowItem => {
					const cardHeight = rowItem.getBoundingClientRect().height;
					if (cardHeight > maxHeight) {
						maxHeight = cardHeight;
					}
				});

				// Set all cards in the row to the maximum height
				rowItems.forEach(rowItem => rowItem.style.height = `${maxHeight}px`);
			});
		}
	};

	// Call equalizeRowHeights when the relevant state changes
	useEffect(() => {
		equalizeRowHeights();
	}, [productImgs, productTitles, productUrls, displayCount, editMode]);

	// Call equalizeRowHeights when the window is resized
	useEffect(() => {
		const handleResize = () => equalizeRowHeights();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		// Block Starting par
		<div {...blockProps}>
			{/* Section for the Block */}
			<section className='pog-products__main-container'>
				{/* Edit and Finish mode of the Block */}
				{editMode ? (
					<div className='pog-products__edit-mode-on'>
						<Button onClick={handleFinish} data-tooltip={__('Drag & Drop', 'pog-block')}>
							<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="37px" fill="#e8eaed"><path d="M480-80 310-250l57-57 73 73v-206H235l73 72-58 58L80-480l169-169 57 57-72 72h206v-206l-73 73-57-57 170-170 170 170-57 57-73-73v206h205l-73-72 58-58 170 170-170 170-57-57 73-73H520v205l72-73 58 58L480-80Z" /></svg>
						</Button>
						<Button className='pog-products__add-story-btn' onClick={addProductCard} data-tooltip={__('Add Product', 'pog-block')}>
							<i className='dashicons dashicons-plus-alt'></i>
						</Button>
					</div>
				) : (
					<Button onClick={handleEdit} className='pog-products__story-customizer' data-tooltip={__('Edit Products', 'pog-block')}>
						<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="37px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" /></svg>
					</Button>
				)}
				{/* Main container for the Product Listout */}
				<div className='pog-products__products-listout'>
					{/* Wrapper for the Product */}
					<div className='pog-products__products-wrapper' id='products__wrapper'>
						{editMode ? (
							renderedProducts
						) : (
							<DndContext
								sensors={sensors}
								onDragEnd={handleDragEnd}
								collisionDetection={closestCenter}
							>
								<SortableContext
									items={productImgs.map((_, index) => index.toString())}
									strategy={rectSortingStrategy}
								>
									{renderedProducts}
								</SortableContext>
							</DndContext>
						)}

					</div>
					{loading &&
						<div className='loading'>
							<div className='load-more-products'></div>
						</div>
					}
					{hasMore && <div ref={loadMoreTriggerRef} id="load-more-trigger"></div>}
				</div>
			</section>
		</div>
	);
}
