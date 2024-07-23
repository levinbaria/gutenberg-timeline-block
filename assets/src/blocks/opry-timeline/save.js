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

	const { attributes } = props

	const {
		timelineHeading,
		timelineHeadingTag,
		timelineHeadingColor,
		isCustomHeadingSize,
		timelineHeadingSize,
		timelineDescription,
		timelineDescriptionColor,
		storyCards,
	} = attributes;

	// Styling Object for the heading.
	const timelineHeadingStyle = {};
	(timelineHeadingSize && isCustomHeadingSize) && (timelineHeadingStyle.fontSize = timelineHeadingSize + 'px');
	timelineHeadingColor && (timelineHeadingStyle.color = timelineHeadingColor);

	// Styling Object for the Description.
	const timelineDescriptionStyle = {};
	timelineDescriptionColor && (timelineDescriptionStyle.color = timelineDescriptionColor);

	// If all the details are there for the story card then it will be shown, otherwise not.
	const validStoryCards = storyCards.filter(
		({ storyImage, storyYear, storyDescription }) =>
			storyImage?.url && storyYear && storyDescription
	);

	const blockProps = useBlockProps.save({
		className: "opry-timeline",
	});

	return (
		<div {...blockProps}>
			{/* Timeline Container */}
			<section className='opry-timeline__main-container'>
				<div className='opry-timeline__timeline-wrapper'>
					{/* Timeline Header Container */}
					<div className='opry-timeline__timeline-header'>
						{timelineHeading && (
							<RichText.Content
								tagName={timelineHeadingTag}
								value={timelineHeading}
								className='opry-timeline__timeline-heading'
								style={timelineHeadingStyle}
							/>
						)}
						{timelineDescription && (
							<RichText.Content
								tagName='p'
								value={timelineDescription}
								className='opry-timeline__timeline-description'
								style={timelineDescriptionStyle}
							/>
						)}
					</div>
					{/* Container for the  storyCards */}
					<div className='opry-timeline__timeline-card-wrapper'>
						{/* Iterate over the valid Story Cards */}
						{validStoryCards.map((storyCard, index) => (
							<div key={index} className={`opry-timeline__timeline-individual-story-wrapper ${index % 2 === 1 ? 'even' : ''}`}>
								{storyCard.storyImage.url && (
									<div className='opry-timeline__timeline-story-image'>
										<img
											src={storyCard.storyImage.url}
											alt={storyCard.storyImage.alt}
										/>
									</div>
								)}
								<div className='opry-timeline__timeline-story-details-wrapper'>
									<div className='opry-timeline__timeline-story-details-card'>
										{storyCard.storyYear && (
											<RichText.Content
												tagName='h3'
												value={storyCard.storyYear}
												className='opry-timeline__timeline-story-year'
											/>
										)}
										{storyCard.storyDescription && (
											<RichText.Content
												tagName='p'
												value={storyCard.storyDescription}
												className='opry-timeline__timeline-story-description'
											/>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}