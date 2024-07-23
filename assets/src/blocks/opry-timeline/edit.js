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
import { RichText, useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
  * React hook that is used to mark the components element.
  *
  * @see https://developer.wordpress.org/block-editor/reference-guides/components/
  */
import { PanelBody, Button, TextControl, SelectControl, ColorPalette, ToggleControl } from '@wordpress/components';
/**
 * React hook that is used to mark the element.
 * 
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
*/
import { Fragment, useEffect, useState } from '@wordpress/element';
import './editor.css';

export default function Edit(props) {

	const { attributes, setAttributes } = props;

	// Destructuring Timeline Attributes
	const {
		timelineHeading,
		timelineHeadingTag,
		timelineHeadingColor,
		isCustomHeadingSize,
		timelineHeadingSize,
		timelineDescription,
		timelineDescriptionColor,
		storyCards,
		timelineMode,
	} = attributes;

	// State for the edit mode.
	const [editMode, setEditMode] = useState(timelineMode);

	// Styling Object for the heading.
	const timelineHeadingStyle = {};
	(timelineHeadingSize && isCustomHeadingSize) && (timelineHeadingStyle.fontSize = timelineHeadingSize + 'px');
	timelineHeadingColor && (timelineHeadingStyle.color = timelineHeadingColor);

	// Styling Object for the Description.
	const timelineDescriptionStyle = {};
	timelineDescriptionColor && (timelineDescriptionStyle.color = timelineDescriptionColor);

	// Function to add a Story card.
	const addStoryCard = () => {
		const newStoryCards = [...storyCards, { storyImage: { url: '', alt: '' }, storyYear: '', storyDescription: '' }];
		setAttributes({ storyCards: newStoryCards });
	}

	// Function to Remove Story card.
	const removeStoryCard = (index) => {
		const newStoryCards = [...storyCards];
		newStoryCards.splice(index, 1);
		setAttributes({ storyCards: newStoryCards });
	}

	// Function to update the Story Card.
	const updateStoryCard = (index, newAttributes) => {
		const newStoryCards = [...storyCards];
		newStoryCards[index] = { ...newStoryCards[index], ...newAttributes };
		setAttributes({ storyCards: newStoryCards });
	}

	// Function to check if all story cards have required data
	const allStoryCardsFilled = () => {
		return storyCards.every(card => card.storyImage.url && card.storyYear && card.storyDescription);
	};

	// Function to handle click event of the "Finish" button
	const handleFinish = () => {
		if (allStoryCardsFilled()) {
			setEditMode(false); // Switch to finish mode
			setAttributes({ timelineMode: false });
		} else {
			alert('Please fill all story card details before entering finish mode.');
		}
	};

	// Function to handle click event of the "Edit" button
	const handleEdit = () => {
		setEditMode(true); // Switch to edit mode
		setAttributes({ timelineMode: true });
	};

	// Function to move a story card up
	const moveStoryCardUp = (index) => {
		if (index === 0) return;
		const newStoryCards = [...storyCards];
		const temp = newStoryCards[index];
		newStoryCards[index] = newStoryCards[index - 1];
		newStoryCards[index - 1] = temp;
		setAttributes({ storyCards: newStoryCards });
	};

	// Function to move a story card down
	const moveStoryCardDown = (index) => {
		if (index === storyCards.length - 1) return;
		const newStoryCards = [...storyCards];
		const temp = newStoryCards[index];
		newStoryCards[index] = newStoryCards[index + 1];
		newStoryCards[index + 1] = temp;
		setAttributes({ storyCards: newStoryCards });
	};

	const blockProps = useBlockProps({
		className: "opry-timeline",
	})

	return (
		<Fragment>
			{/* SiderBar settings for the Banner Block */}
			<InspectorControls>
				{/* Heading Setting */}
				<PanelBody title={__('Timeline Heading', 'opry-block')} initialOpen={true}>
					<SelectControl
						label={__('Heading Tag', 'opry-block')}
						value={timelineHeadingTag}
						options={[
							{ label: __('h1', 'opry-block'), value: 'h1' },
							{ label: __('h2', 'opry-block'), value: 'h2' },
							{ label: __('h3', 'opry-block'), value: 'h3' },
							{ label: __('h4', 'opry-block'), value: 'h4' },
							{ label: __('h5', 'opry-block'), value: 'h5' },
							{ label: __('h6', 'opry-block'), value: 'h6' },
						]}
						onChange={(timelineHeadingTag) => setAttributes({ timelineHeadingTag })}
					/>
					<ColorPalette
						label={__('Heading Color', 'opry-block')}
						value={timelineHeadingColor}
						onChange={(timelineHeadingColor) => setAttributes({ timelineHeadingColor })}
					/>
					<ToggleControl
						label={__('Resize Heading', 'opry-block')}
						checked={isCustomHeadingSize}
						onChange={(isCustomHeadingSize) => setAttributes({ isCustomHeadingSize })}
					/>
					{isCustomHeadingSize && (
						<TextControl
							type='number'
							label={__('Font Size', 'opry-block')}
							value={parseInt(timelineHeadingSize)}
							onChange={(timelineHeadingSize) => setAttributes({ timelineHeadingSize })}
						/>
					)}
				</PanelBody>
				{/* Description Settings */}
				<PanelBody title={__('Description Setting', 'opry-block')} initialOpen={false}>
					<ColorPalette
						label={__('Description Color', 'opry-block')}
						value={timelineDescriptionColor}
						onChange={(timelineDescriptionColor) => setAttributes({ timelineDescriptionColor })}
					/>
				</PanelBody>
			</InspectorControls>
			{/* Main Block */}
			<div {...blockProps}>
				<section className='opry-timeline__main-container'>
					<div className='opry-timeline__timeline-wrapper'>
						{/* Timeline Header Container */}
						<div className='opry-timeline__timeline-header'>
							{/* Container Heading */}
							<RichText
								tagName={timelineHeadingTag}
								value={timelineHeading}
								className='opry-timeline__timeline-heading'
								style={timelineHeadingStyle}
								placeholder={__('Timeline Heading', 'opry-block')}
								onChange={(timelineHeading) => setAttributes({ timelineHeading })}
							/>
							{/* Conatiner Description */}
							<RichText
								tagName='p'
								value={timelineDescription}
								className='opry-timeline__timeline-description'
								style={timelineDescriptionStyle}
								placeholder={__('Description', 'opry-block')}
								onChange={(timelineDescription) => setAttributes({ timelineDescription })}
							/>
						</div>
						<div className='opry-timeline__timeline-card-wrapper'>
							{/* Iterate over the number of story of the story attributes */}
							{storyCards.map((storyCard, index) => (
								<div key={index} className={`opry-timeline__timeline-individual-story-wrapper ${index % 2 === 1 ? 'even' : ''}`}>
									{editMode && (
										<div className='opry-timeline__story-modification'>
											{/* Buttons to move the story card */}
											<Button
												className='opry-timeline__move-story-up'
												onClick={() => moveStoryCardUp(index)}
												disabled={index === 0}
											>
												<i className='dashicons dashicons-arrow-up-alt2'></i>
											</Button>
											<Button
												className='opry-timeline__move-story-down'
												onClick={() => moveStoryCardDown(index)}
												disabled={index === storyCards.length - 1}
											>
												<i className='dashicons dashicons-arrow-down-alt2'></i>
											</Button>
											{/* Button to Remove Story Card */}
											<Button className="opry-timeline__remove-story" onClick={() => removeStoryCard(index)}>
												<i className='dashicons dashicons-no-alt'></i>
											</Button>
										</div>
									)}
									{/* Media Upload for the Story */}
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => updateStoryCard(index, { storyImage: { id: media.id, url: media.url, alt: media.alt } })}
											allowedTypes={['image']}
											value={storyCard.storyImage}
											render={({ open }) => (
												<Fragment>
													{storyCard?.storyImage?.url ? (
														<div className='opry-timeline__timeline-story-image'>
															<img
																src={storyCard.storyImage.url}
																alt={storyCard.storyImage.alt}
															/>
															<Button
																className='opry-timeline__change-img'
																onClick={open}
															>
																<i className='dashicons dashicons-admin-customizer'></i>
															</Button>
														</div>
													) : (
														<Button
															className='opry-timeline__upload-img'
															onClick={open}
														>
															<i className='dashicons dashicons-cloud-upload'></i>
														</Button>
													)}
												</Fragment>
											)}
										/>
									</MediaUploadCheck>
									{/* Story Details Card */}
									<div className='opry-timeline__timeline-story-details-wrapper'>
										<div className='opry-timeline__timeline-story-details-card'>
											<RichText
												tagName='h3'
												value={storyCard.storyYear}
												className='opry-timeline__timeline-story-year'
												placeholder={__('Story Year', 'opry-block')}
												onChange={(value) => updateStoryCard(index, { storyYear: value })}
											/>
											<RichText
												tagName='p'
												value={storyCard.storyDescription}
												className='opry-timeline__timeline-story-description'
												placeholder={__('Story description', 'opry-block')}
												onChange={(value) => updateStoryCard(index, { storyDescription: value })}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
						{/* Button to be enable based on the edit mode */}
						{editMode ? (
							<div className='opry-timeline__edit-mode-on'>
								<Button onClick={handleFinish}>
									<i className='dashicons dashicons-saved'></i>
								</Button>
								{/* Button to Add Card */}
								<Button className='opry-timeline__add-story-btn' onClick={addStoryCard}>
									<i className='dashicons dashicons-plus-alt'></i>
								</Button>
							</div>
						) : (
							<Button onClick={handleEdit} className='opry-timeline__story-customizer'>
								<i className='dashicons dashicons-admin-customizer'></i>
							</Button>
						)}
					</div>
				</section>
			</div>
		</Fragment>
	);
}