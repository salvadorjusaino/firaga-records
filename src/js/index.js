import { setupProgressBar } from './EmblaCarouselProgressBar.js';
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons.js';
import { preloadImages } from "./Utils.js";
import { Loader } from "./Loader.js";
import { Scroll } from "./Scroll.js";
import { Player } from "./Player.js";
import { MusicService } from "./MusicService.js";

let mm = gsap.matchMedia();
let imgLoaded = false,
	domLoaded = false,
	siteReady = false;

export default class Index {
	constructor() {
		gsap.registerPlugin(ScrollTrigger);

		this.service = new MusicService();
		this.siteReady = false;
		this.animate = false;
		this.animateMobile = false;
		this.images = 0;
		this.imgLoaded = false;
		this.player = null;
		this.lenis = null;
		this.loader = new Loader();
		this.scroll = new Scroll();

		window.Alpine = Alpine;

		this.lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			direction: "vertical",
			gestureDirection: "vertical",
			smooth: true,
			mouseMultiplier: 1,
			smoothTouch: false,
			touchMultiplier: 2,
			infiniteThreshold: 50
		});

		// Update ScrollTrigger each time the user scrolls
		this.lenis.on("scroll", () => ScrollTrigger.update());

		const scrollFn = (time) => {
			this.lenis.raf(time);
			requestAnimationFrame(scrollFn);
		};

		requestAnimationFrame(scrollFn);

		this.lenis.off();
		this.init();
		this.initMobileMenu();
		this.preloadImgs();
		this.hoverRoll();
		this.initIntroAnimated();

		this.applyActiveStyles();
		window.addEventListener("resize", this.applyActiveStyles);

		this.initPlayer();
		this.initFeaturedArtists();
		this.initFeaturedAlbums();
		this.initFeaturedPlaylists();
	}

	// Initialize the main scripts
	async init() {
		this.scroll.gotoIntro().then((response) => {
			this.loader.on().then((response) => {
				this.lenis.on();
				this.siteReady = true;
			});
		});
	}

	preloadImgs() {
		var imgLoad = preloadImages().then((resolve) => {
			if (resolve.isComplete) {
				this.imgLoaded = true;
				document.body.classList.remove("loading");
			}
		});
	};

	hoverRoll() {
		document.querySelectorAll(".roll").forEach((roll) => {
			let t;
			roll.addEventListener("mouseenter", (e) => {
				const o = e.target;
				o.classList.remove("on");
				o.offsetWidth;
				o.classList.add("on");
				window.clearTimeout(t);
				t = setTimeout(() => {
					o.classList.remove("on");
				}, 400);
			});
		});
	};

	initMobileMenu() {

		let menuOpen = false;
		const menuButton = document.querySelector(".button-burger");
		const headerMobile = document.querySelector(".header__navigation__mobile");
		const a = headerMobile.querySelectorAll("a");
		var o = gsap.timeline();
		
		const i = () => {
			menuOpen = !1,
				menuButton.classList.remove("close"),
				document.body.setAttribute("data-nav-status", "closed"),
				document.body.classList.remove("overflow-hidden"),
				o.clear().to(headerMobile, {
					yPercent: -120
				}, "<+=0.2").set(headerMobile, {
					display: "none"
				})
		};

		menuButton.addEventListener("click", (() => {
			menuOpen ? i() : (menuOpen = !0,
				menuButton.classList.add("close"),
				document.body.setAttribute("data-nav-status", "open"),
				this.lenis.off(),
				document.body.classList.add("overflow-hidden"),
				o.clear().set(headerMobile, {
					display: "flex"
				}, "<").fromTo(headerMobile, {
					yPercent: -120
				}, {
					yPercent: 0
				}, "<+=0.2").fromTo(a, {
					autoAlpha: 0,
					yPercent: 50
				}, {
					autoAlpha: 1,
					yPercent: 0,
					stagger: .05
				}, "<+=0.25")
			)
		}));

		i();
	}

	initIntroAnimated() {
		mm.add({
			isMobile: `(min-width: 767.98px)`,
			isTablet: `(min-width: 768px) and (max-width: 991.98px)`,
			isDesktop: `(min-width: 992px)`
		}, (context) => {

			let { isDesktop, isTablet, isMobile } = context.conditions;
			let tl = gsap.timeline();
			if (this.animate) {
				
				if (isMobile && this.animateMobile) {
					gsap.to(".div1 .ct-poligon-clip-path", {
						width: "+=10px",
						height: "+=10px",
						marginTop: "+=10px",
						marginLeft: "-=05px",
						paddingBottom: "+=10px",
						paddingRight: "+=5px",
						clipPath: "polygon(0 0, calc(100% - 80px) 0, 100% 80px, 100% 100%, 80px 100%, 0 calc(100% - 80px))",
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div2 .ct-poligon-clip-path", {
						width: "+=20px",
						height: "+=10px",
						marginTop: "-=10px",
						marginLeft: "-=10px",
						paddingBottom: "+=40px",
						paddingRight: "+=0px",
						clipPath: "polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 60px 100%, 0 calc(100% - 60px))",
						delay: 0.75,
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div3 .ct-poligon-clip-path", {
						width: "+=10px",
						height: "+=10px",
						marginTop: "-=10px",
						marginLeft: "-=05px",
						paddingBottom: "+=10px",
						paddingRight: "+=5px",
						clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
						delay: 0.5,
						duration: 2.3,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

				} else if (isTablet) {
					gsap.to(".div1 .ct-poligon-clip-path", {
						width: "+=20px",
						height: "+=20px",
						marginTop: "-=20px",
						marginLeft: "-=30px",
						paddingBottom: "+=30px",
						paddingRight: "+=30px",
						clipPath: "polygon(0 0, calc(100% - 80px) 0, 100% 80px, 100% 100%, 80px 100%, 0 calc(100% - 80px))",
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div2 .ct-poligon-clip-path", {
						width: "+=20px",
						height: "+=10px",
						marginTop: "-=10px",
						marginLeft: "-=10px",
						paddingBottom: "+=40px",
						paddingRight: "+=0px",
						clipPath: "polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 60px 100%, 0 calc(100% - 60px))",
						delay: 0.75,
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div3 .ct-poligon-clip-path", {
						width: "+=20px",
						height: "+=20px",
						marginTop: "-=10px",
						marginLeft: "-=10px",
						paddingBottom: "+=10px",
						clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
						delay: 0.5,
						duration: 2.3,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});
				} else {
					gsap.to(".div1 .ct-poligon-clip-path", {
						//width: "+=20px",
						height: "+=50px",
						marginTop: "-=20px",
						marginLeft: "-=30px",
						paddingBottom: "+=30px",
						paddingRight: "+=30px",
						clipPath: "polygon(0 0, calc(100% - 80px) 0, 100% 80px, 100% 100%, 80px 100%, 0 calc(100% - 80px))",
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div2 .ct-poligon-clip-path", {
						//width: "+=20px",
						//height: "+=50px",
						marginTop: "-=40px",
						marginLeft: "-=20px",
						paddingBottom: "+=80px",
						paddingRight: "+=0px",
						clipPath: "polygon(0 0, calc(100% - 70px) 0, 100% 70px, 100% 100%, 70px 100%, 0 calc(100% - 70px))",
						delay: 0.75,
						duration: 2,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});

					gsap.to(".div3 .ct-poligon-clip-path", {
						//width: "+=20px",
						marginTop: "-=20px",
						marginLeft: "-=20px",
						paddingBottom: "+=40px",
						clipPath: "polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 60px 100%, 0 calc(100% - 60px))",
						delay: 0.5,
						duration: 2.3,
						yoyo: true,
						repeat: -1,
						ease: "power1.inOut",
					});
				}
			}
		});
	}

	applyActiveStyles = () => {
		const featureMusic = document.querySelector(".featured-music");

		if (featureMusic) {

			const featureList = featureMusic.querySelector(".featured-wrapper");
			const listItems = featureList.querySelectorAll(".card");

			mm.add(
				{
					isDesktop: "(min-width: 992px)",
					isMobile: "(max-width: 991.98px)",
				},
				(context) => {
					let { isDesktop, isMobile, reduceMotion } =
						context.conditions;

					listItems.forEach((li) => {
						li.classList.remove("card-lg");
					});

					// Dynamically generate the pattern based on the length of the list
					if (isMobile) {
						let activeIndexes = [];
						let num = 1; // First active element

						while (num <= listItems.length) {
							activeIndexes.push(num);
							num += 5; // Self-creation with +4 increase
						}

						// Apply styles to active elements
						listItems.forEach((li, index) => {
							if (activeIndexes.includes(index + 1)) {
								li.classList.add("card-lg");
							}
						});
					} else {
						let activeIndexes = [];
						let num = 1; // First active element

						while (num <= listItems.length) {
							activeIndexes.push(num);
							num += 9; // Self-creation with +4 increase
						}

						// Apply styles to active elements
						listItems.forEach((li, index) => {
							if (activeIndexes.includes(index + 1)) {
								li.classList.add("card-lg");
							}
						});
					}
				}
			);

			//lenis.resize();
		}
	};

	initPlayer = async () => {

		await this.service.loadData();
		const allTracks = this.service.getAllTracks();
		this.player = new Player(allTracks);

		const buttons = document.querySelectorAll(".play-button");

		if (buttons && allTracks.length > 0) {
			
			buttons.forEach((button) => {

				if (!button.hasAttribute('data-trackId')) {
					button.classList.add("is-disabled");
					button.closest(".card").classList.add("not-wave");
					button.disabled = true;
				}

				button.addEventListener("click", (e) => {
					e.preventDefault();
					let card = e.target.closest(".card");
					let trackId = parseInt(e.target.getAttribute("data-trackId"));

					if (!trackId) {
						return false;
					} else {

						buttons.forEach((element) => {
							if (element != e.target) {
								let _card = element.closest(".card");
								_card.classList.remove("playing");
								element.classList.remove("is-playing");
							}
						});

						e.target.classList.toggle("is-playing");

						if (e.target.classList.contains("is-playing")) {
							card.classList.add("playing");
							this.player.skipTo(trackId);
						} else {
							card.classList.remove("playing");
							this.player.pause();
						}
					}
				});
			});
		}

	};

	initFeaturedArtists = () => {

		const sectionsPlaylists = document.querySelectorAll(".featured-artists");

		const OPTIONS = { align: 'center', loop: true, dragFree: false, dragThreshold: 20 };

		if (sectionsPlaylists) {
			sectionsPlaylists.forEach((section, index) => {

				const splideListArtists = section.querySelectorAll(".artists-list .roll");
				const emblaNode = section.querySelector('.embla');
				const viewportNode = emblaNode.querySelector('.embla__viewport');
				const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [EmblaCarouselClassNames(), EmblaCarouselFade(), EmblaCarouselAutoplay({ playOnInit: true, delay: 3000, stopOnInteraction: false })]);

				emblaApi.on('select', () => {
					const selectedIndex = emblaApi.selectedScrollSnap();

					splideListArtists.forEach((el) => {
						el.classList.remove("roll-active");
						el.parentElement.classList.remove("is-active");
					});

					var rollActive = splideListArtists[selectedIndex];
					rollActive.classList.add("roll-active");
					rollActive.parentElement.classList.add("is-active");

					rollActive.classList.add("on");
					setTimeout(() => {
						rollActive.classList.remove("on");
					}, 400);
				});

				splideListArtists.forEach((roll) => {
					roll.addEventListener("mouseenter", (e) => {
						e.preventDefault();
						var index = parseInt(
							e.target.getAttribute("data-index")
						);

						splideListArtists.forEach((el) => {
							el.classList.remove("roll-active");
							el.parentElement.classList.remove("is-active");
						});

						e.target.parentElement.classList.add("is-active");
						e.target.classList.add("roll-active");

						emblaApi.scrollTo(index);

					});
				});

			});
		}
	};

	initFeaturedAlbums = () => {
		const sectionsAlbums = document.querySelectorAll(".featured-albums");

		const OPTIONS = { dragFree: false, align: 'center', loop: false, dragThreshold: 20 };

		if (sectionsAlbums) {
			sectionsAlbums.forEach((section, index) => {
				
				const emblaNode = section.querySelector('.embla');
				const viewportNode = emblaNode.querySelector('.embla__viewport');
				const prevBtn = emblaNode.querySelector('.embla__button--prev');
				const nextBtn = emblaNode.querySelector('.embla__button--next');
				const progressNode = emblaNode.querySelector('.embla__progress__bar');

				const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [EmblaCarouselClassNames(), EmblaCarouselWheelGestures()])
				const { applyProgress, removeProgress } = setupProgressBar(
					emblaApi,
					progressNode
				)

				const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
					emblaApi,
					prevBtn,
					nextBtn
				)

				emblaApi
					.on('init', applyProgress)
					.on('reInit', applyProgress)
					.on('scroll', applyProgress)
					.on('slideFocus', applyProgress)
					.on('destroy', removeProgress)
					.on('destroy', removePrevNextBtnsClickHandlers);
			});
		}
	};

	initFeaturedPlaylists = () => {

		const sectionsPlaylists = document.querySelectorAll(".featured-playlists");

		const OPTIONS = { align: 'center' };

		if (sectionsPlaylists) {
			sectionsPlaylists.forEach((section, index) => {

				const emblaNode = section.querySelector('.embla');
				const viewportNode = emblaNode.querySelector('.embla__viewport');
				const prevBtn = emblaNode.querySelector('.embla__button--prev');
				const nextBtn = emblaNode.querySelector('.embla__button--next');
				const progressNode = emblaNode.querySelector('.embla__progress__bar');

				const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [EmblaCarouselClassNames(), EmblaCarouselWheelGestures()])
				const { applyProgress, removeProgress } = setupProgressBar(
					emblaApi,
					progressNode
				)

				const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
					emblaApi,
					prevBtn,
					nextBtn
				)

				emblaApi
					.on('init', applyProgress)
					.on('reInit', applyProgress)
					.on('scroll', applyProgress)
					.on('slideFocus', applyProgress)
					.on('destroy', removeProgress)
					.on('destroy', removePrevNextBtnsClickHandlers);

			});
		}
	};
}

new Index();

window.addEventListener("load", () => {
	domLoaded = true;
	if (imgLoaded) {
		siteReady = true;
	}
});

function onresize() {
	const e = window.innerWidth;
	const t = Math.max(e - document.documentElement.clientWidth, 0);
	document.documentElement.style.setProperty("--scrollbar-width", `${t}px`);
	document.documentElement.classList.remove("is-mobile");
	if (e < 991.98) {
		document.documentElement.classList.add("is-mobile");
	}
}

onresize();
window.addEventListener("resize", onresize);
