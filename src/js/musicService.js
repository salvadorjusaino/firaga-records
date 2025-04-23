export class musicService {
	constructor() {
		this.data = null;
		this.tracks = [];
		this.albums = [];
	}

	// Método asíncrono para cargar los datos desde el archivo
	async loadData() {
		try {

			/*const data = this.data;
			this.tracks = this.tracks.map(track => ({
				...track,
				[Howl]: null
			}));*/

			if (!this.data) {
				
				/*const response = await fetch("./src/data/homeData.json");
				if (!response.ok) {
					throw new Error(`Error HTTP: ${response.status}`);
				}
				this.data = await response.json();
				*/

				if (!window.playerData) {
					console.log(`⚠️ window.playerData is not defined.`);
					this.data = {
						tracks: []
					};
				} else {
					this.data = window.playerData;
				}
			}

			this.tracks = this.data.tracks || [];

		} catch (error) {
			console.error("Error loading music data:", error);
			this.tracks = [];
		}
	}

	// Devuelve todos los tracks
	getAllTracks() {
		return this.tracks || [];
	}

	// Devuelve todos los Albums
	getAllAlbums() {
		return this.albums || [];
	}

	// Devuelve un track por su ID
	getTrackById(id) {
		return this.tracks.find(track => track.trackId === id);
	}

	// Devuelve los tracks destacados
	getHighlightedTracks() {
		return this.tracks.filter(track => track.highlight);
	}

	// Devuelve los tracks con botón de play
	getTracksWithPlayButton() {
		return this.tracks.filter(track => track.showPlayButton);
	}

	// Devuelve los tracks con botón de compra
	getTracksWithBuyButton() {
		return this.tracks.filter(track => track.showBuyButton);
	}

	// Devuelve los tracks con botón de vista
	getTracksWithViewButton() {
		return this.tracks.filter(track => track.showViewButton);
	}

	// Búsqueda por texto
	searchTracks(query) {
		const q = query.toLowerCase();
		return this.tracks.filter(track =>
			track.artistName.toLowerCase().includes(q) ||
			track.trackName.toLowerCase().includes(q)
		);
	}
}
