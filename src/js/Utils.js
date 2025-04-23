/**
 * Preloads images specified by the CSS selector.
 * @function
 * @param {string} [selector='img'] - CSS selector for target images.
 * @returns {Promise} - Resolves when all specified images are loaded.
 */
const preloadImages = (selector = "img") => {
	return new Promise((resolve) => {
		// The imagesLoaded library is used to ensure all images (including backgrounds) are fully loaded.
		imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
	});
};

const shuffleArray = (e) => {
	for (let t = e.length - 1; t > 0; t--) {
		const o = Math.floor(Math.random() * (t + 1));
		[e[t], e[o]] = [e[o], e[t]];
	}
	return e;
};

const goTop = () => {
	window.scrollTo(0, 0);
};

export { preloadImages, shuffleArray, goTop };
