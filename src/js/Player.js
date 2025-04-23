import SiriWave from "./siriwave.esm.js";

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */

class Player {
	constructor(playlist) {

		this.waveContainer = null;
		this.isPlaying = false;
		this.playlist = playlist || [];
		this.trackId = 0;
		this.index = 0;
		this.wave = null;
		this.init();

	}

	init = () => {

		var self = this;
		self.waveContainer = document.getElementById("siri-container");
		
		// Setup the "waveform" animation.
		const siri = new SiriWave({
			container: this.waveContainer,
			width: 750,
			height: 80,
			cover: true,
			speed: 0.03,
			amplitude: 0.7,
			frequency: 2,
		});

		siri.start();
		this.wave = siri;

	};

	async getPlaylist() {
		/*try {
			const response = await axios.get("./src/js/data.json");
			return response.data.playlist;
		} catch (error) {
			console.error(error);
		}*/
	}

	/**
	 * Retrieves a track from the playlist by its ID.
	 * 
	 * This method searches the playlist for a track with the specified ID and returns
	 * both the track object and its index in the playlist. If no track is found, it returns `null`.
	 * 
	 * @param {number} id - The ID of the track to retrieve.
	 * @returns {Object|null} - An object containing the track and its index, or `null` if not found.
	 * @property {number} index - The index of the track in the playlist.
	 * @property {Object} track - The track object from the playlist.
	 */
	getTrackById(id) {
		const index = this.playlist.findIndex(track => track.trackId === id);
		if (index !== -1) {
			return {
				index,
				track: this.playlist[index]
			};
		}
		return null;
	}

	/**
	 * Play a song in the playlist.
	 * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
	 */
	play(trackId) {

		var self = this;
		var sound;
		var index = self.index;

		//var data = self.playlist[index];
		
		trackId = typeof trackId === "number" ? trackId : self.trackId;
		var data = self.getTrackById(trackId);

		if (data) {
			index = data.index;


			data = data.track;
		}

		// If we already loaded this track, use the current one.
		// Otherwise, setup and load a new Howl.
		if (data?.howl) {
			sound = data.howl;
		} else {

			if (!data) {
				var button = document.querySelector(".play-button[data-trackid='" + trackId + "']");
				var card = button.closest(".card");
				card.classList.remove("playing");
				button.classList.remove("is-playing");
				console.log("🔥 No track found with ID:", trackId);
				return false;
			}

			sound = data.howl = new Howl({
				src: [data.track_file + ".webm", data.track_file + ".mp3"],
				html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
				onplay: function () {
					// Display the duration.
					/*duration.innerHTML = self.formatTime(
						Math.round(sound.duration())
					);*/

					// Start updating the progress of the track.
					requestAnimationFrame(self.step.bind(self));

					// Start the wave animation if we have already loaded
					self.waveContainer.classList.add("fade-in");
					//self.waveContainer.style.display = "block";
					// bar.style.display = "none";
					// pauseBtn.style.display = "block";

					this.isPlaying = true;
				},
				onload: function () {
					// Start the wave animation.
					self.waveContainer.classList.add("fade-in");
					//self.waveContainer.style.display = "block";
					// bar.style.display = "none";
					// loading.style.display = "none";

					this.isPlaying = false;
				},
				onend: function () {
					// Stop the wave animation.
					self.waveContainer.classList.remove("fade-in");
					//self.waveContainer.style.display = "none";
					// bar.style.display = "block";
					this.isPlaying = false;
				},
				onpause: function () {
					// Stop the wave animation.
					self.waveContainer.classList.remove("fade-in");
					//self.waveContainer.style.display = "none";
					// bar.style.display = "block";
					this.isPlaying = false;
				},
				onstop: function () {
					// Stop the wave animation.
					self.waveContainer.classList.remove("fade-in");
					//self.waveContainer.style.display = "none";
					// bar.style.display = "block";
					this.isPlaying = false;
				},
				onseek: function () {
					// Start updating the progress of the track.
					requestAnimationFrame(self.step.bind(self));
				},
			});
		}

		// Begin playing the sound.
		sound.play();

		// Update the track display.
		//track.innerHTML = index + 1 + ". " + data.title;

		// Show the pause button.
		if (sound.state() === "loaded") {
		} else {
		}

		// Keep track of the index we are currently playing.
		self.index = index;
	}

	/**
	 * Pause the currently playing track.
	 */
	pause() {
		var self = this;

		// Get the Howl we want to manipulate.
		var sound = self.playlist[self.index].howl;

		// Puase the sound.
		sound.pause();
		this.isPlaying = false;
	}

	/**
	 * Skip to the next or previous track.
	 * @param  {String} direction 'next' or 'prev'.
	 */
	skip(direction) {
		var self = this;

		// Get the next track based on the direction of the track.
		var index = 0;
		if (direction === "prev") {
			index = self.index - 1;
			if (index < 0) {
				index = self.playlist.length - 1;
			}
		} else {
			index = self.index + 1;
			if (index >= self.playlist.length) {
				index = 0;
			}
		}

		self.skipTo(index);
	}

	/**
	 * Skip to a specific track based on its playlist index.
	 * @param  {Number} index Index in the playlist.
	 */
	skipTo(index) {
		var self = this;

		// Stop the current track.
		if (self.playlist[self.index].howl) {
			self.playlist[self.index].howl.stop();
		}

		// Reset progress.
		//progress.style.width = '0%';

		// Play the new track.
		self.play(index);
	}

	/**
	 * Set the volume and update the volume slider display.
	 * @param  {Number} val Volume between 0 and 1.
	 */
	volume(val) {
		var self = this;

		// Set the volume.
		Howler.volume(val);
	}

	/**
	 * Seek to a new position in the currently playing track.
	 * @param  {Number} per Percentage through the song to skip.
	 */
	seek(per) {
		var self = this;

		// Get the Howl we want to manipulate.
		var sound = self.playlist[self.index].howl;

		// Convert the percent into a seek position.
		if (sound.playing()) {
			sound.seek(sound.duration() * per);
		}
	}

	/**
	 * The step called within requestAnimationFrame to update the playback position.
	 */
	step() {
		var self = this;

		// Get the Howl we want to manipulate.
		var sound = self.playlist[self.index].howl;

		// Determine our current seek position.
		var seek = sound.seek() || 0;
		//timer.innerHTML = self.formatTime(Math.round(seek));
		//progress.style.width = ((seek / sound.duration()) * 100 || 0) + "%";

		// If the sound is still playing, continue stepping.
		if (sound.playing()) {
			requestAnimationFrame(self.step.bind(self));
		}
	}
}

export { Player };