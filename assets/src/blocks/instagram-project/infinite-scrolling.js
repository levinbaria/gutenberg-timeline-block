jQuery(document).ready(function ($) {
	const initialDisplayCount = 30; // Initial number of items to display
	let displayCount = initialDisplayCount;
	let isLoading = false;
	const $productsWrapper = $('#products__wrapper');
	const $loadMoreTrigger = $('#load-more-trigger');
	const $spinner = $('.pog-products__spinner');
	let timeout;

	// If the products wrapper or load more trigger does not exist, exit the function
	if (!$productsWrapper.length || !$loadMoreTrigger.length) {
		return;
	}

	// Function to update the visibility of product items based on the display count
	function updateDisplay() {
		const $productItems = $productsWrapper.find('.pog-products__individual-product-wrapper');
		$productItems.each(function (index) {
			// Show items up to the current display count, hide the rest
			if (index < displayCount) {
				$(this).removeClass('pog-products__hidden');
			} else {
				$(this).addClass('pog-products__hidden');
			}
		});
		// Hide the load more trigger if all items are displayed
		if (displayCount >= $productItems.length) {
			$loadMoreTrigger.hide();
		}
	}

	// Function to load more items when triggered
	function loadMoreItems() {
		if (isLoading) return;
		isLoading = true;
		$spinner.show();
		setTimeout(function () {
			displayCount += 30;
			updateDisplay();
			isLoading = false;
			$spinner.hide();
		}, 1000);
	}

	// Create an IntersectionObserver to watch for the load more trigger coming into view
	const observer = new IntersectionObserver(function (entries) {
		if (entries[0].isIntersecting) {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(loadMoreItems, 100);
		}
	}, {
		root: null,
		rootMargin: '0px',
		threshold: 1.0
	});

	observer.observe($loadMoreTrigger[0]); // Start observing the load more trigger

	updateDisplay();  // Initial call to display the first set of items
	
	// Function to equalize heights of cards within each row
	function equalizeRowHeights() {
		if ($(window).width() >= 900) {
			const $productItems = $productsWrapper.find('.pog-products__individual-product-wrapper');
			const cardsPerRow = 3;
			// Reset all heights to auto to calculate row heights correctly
			$productItems.css('height', 'auto');

			$productItems.each(function (index) {
				const rowStartIndex = Math.floor(index / cardsPerRow) * cardsPerRow;
				const rowEndIndex = rowStartIndex + cardsPerRow;
				const $rowItems = $productItems.slice(rowStartIndex, rowEndIndex);

				let maxHeight = 0;

				$rowItems.each(function () {
					const cardHeight = $(this).outerHeight();
					if (cardHeight > maxHeight) {
						maxHeight = cardHeight;
					}
				});

				// Set all cards in the row to the maximum height
				$rowItems.css('height', maxHeight);
			});
		}

	}

	// Run on initial load and on window resize
	equalizeRowHeights();
	$(window).on('resize', equalizeRowHeights);
});
