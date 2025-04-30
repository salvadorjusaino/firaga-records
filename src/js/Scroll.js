import settings from "./Settings.js";
import { gsap } from "gsap";

class Scroll {
	constructor() {
		this.promises = [];
	}

	gotoIntro() {
		return new Promise((resolve, reject) => {

			const tl = gsap.timeline({
				paused: true,
			});

			tl.to(window, {
				scrollTo: {
					y: settings.body,
					offsetY: -1,
				},
				duration: 1,
				delay: 0,
				onStart: () => {
					//this.off();
				},
				onComplete: () => {
					this.loaded = true;
					this.promises.push({ loaded: true });
					resolve(this.loaded);
				},
			});

			tl.play();

		});
	}

	gotoFooter() {
		return new Promise((resolve, reject) => {

			const tl = gsap.timeline({
				paused: true,
			});

			tl.to(window, {
				scrollTo: {
					y: settings.footer,
					offsetY: -1,
				},
				duration: 1,
				delay: 0,
				onStart: () => {
					//this.off();
				},
				onComplete: () => {
					this.loaded = true;
					this.promises.push({ loaded: true });
					resolve(this.loaded);
				},
			});

			tl.play();

		});
	}
}

export { Scroll };
