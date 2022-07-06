"use strict";
class VideoPlayer {
    constructor() {
        this.videoDurationMilisec = 0;
        this.isFullscreen = false;
        this.lastVolume = 0;
        this.isPlaying = false;
        this.video = document.querySelector('.video');
        this.playPause = document.getElementById('play-btn');
        this.currentTime = document.querySelector('.time-elapsed');
        this.duration = document.querySelector('.time-duration');
        this.progressRange = document.querySelector('.progress-range');
        this.progressBar = document.querySelector('.progress-bar');
        this.volumeRange = document.querySelector('.volume-range');
        this.volumeBar = document.querySelector('.volume-bar');
        this.playerSpeed = document.querySelector('.player-speed');
        this.volumeIcon = document.getElementById('volume-icon');
        this.toggleFullscreen = document.querySelector('.fa-expand');
        this.player = document.querySelector('.player');
        this.video.addEventListener('click', () => {
            this.isPlaying ? this.pause() : this.play();
        });
        this.playPause.addEventListener('click', () => {
            this.isPlaying ? this.pause() : this.play();
        });
        this.video.addEventListener('timeupdate', this.timeAndProgressBarUpdate.bind(this));
        // *Changing video position by clicking on the line(progressRange)
        this.progressRange.addEventListener('click', this.changeVideoPosition.bind(this));
        //*Changing volume
        this.volumeRange.addEventListener('click', this.volumeChange.bind(this));
        this.volumeIcon.addEventListener('click', this.toggleSound.bind(this));
        this.playerSpeed.addEventListener('input', (e) => {
            this.video.playbackRate = Number(e.target.value);
        });
        //*  https://www.w3schools.com/howto/howto_js_fullscreen.asp
        this.toggleFullscreen.addEventListener('click', () => {
            this.isFullscreen ? this.removeFullscreen() : this.addFullscreen();
        });
    }
    play() {
        this.video.play();
        this.isPlaying = true;
        this.playPause.classList.replace('fa-play', 'fa-pause');
    }
    pause() {
        this.video.pause();
        this.isPlaying = false;
        this.playPause.classList.replace('fa-pause', 'fa-play');
    }
    timeAndProgressBarUpdate(e) {
        this.currentTime.innerText = `${this.convertTime(e.target.currentTime)} /`;
        this.duration.innerText = this.convertTime(e.target.duration);
        this.videoDurationMilisec = e.target.duration;
        const percentages = (e.target.currentTime /
            e.target.duration) *
            100;
        this.progressBar.style.width = `${percentages}%`;
        if (this.progressBar.style.width === '100%')
            this.pause();
    }
    changeVideoPosition(e) {
        this.progressBar.style.width = `${(e.offsetX / this.progressRange.offsetWidth) * 100}%`;
        const newTime = (e.offsetX / this.progressRange.offsetWidth) * this.videoDurationMilisec;
        this.video.currentTime = newTime;
    }
    convertTime(time) {
        return (Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2));
    }
    volumeChange(e) {
        let value = e.offsetX / e.currentTarget.clientWidth;
        if (value < 0.1)
            value = 0;
        else if (value > 0.9)
            value = 1;
        this.lastVolume = value;
        this.volumeBar.style.width = `${value * 100}%`;
        this.video.volume = value;
        this.adjustSoundIcons();
    }
    toggleSound() {
        if (this.volumeIcon.classList.contains('fa-volume-xmark')) {
            this.video.volume = this.lastVolume || 0.5;
            this.volumeBar.style.width = `${this.video.volume * 100}%`;
            this.adjustSoundIcons();
        }
        else {
            this.volumeIcon.className = '';
            this.volumeIcon.classList.add('fa-solid', 'fa-volume-xmark');
            this.video.volume = 0;
            this.volumeBar.style.width = `${0 * 100}%`;
        }
    }
    adjustSoundIcons() {
        this.volumeIcon.className = '';
        if (this.video.volume <= 0.5 && this.video.volume !== 0) {
            this.volumeIcon.classList.add('fa-solid', 'fa-volume-low');
        }
        else if (this.video.volume > 0.5) {
            this.volumeIcon.classList.add('fa-solid', 'fa-volume-high');
        }
        else {
            this.volumeIcon.classList.add('fa-solid', 'fa-volume-xmark');
        }
    }
    addFullscreen() {
        this.player.requestFullscreen();
        this.video.classList.add('video-fullscreen');
        this.isFullscreen = !this.isFullscreen;
    }
    removeFullscreen() {
        document.exitFullscreen();
        this.video.classList.remove('video-fullscreen');
        this.isFullscreen = !this.isFullscreen;
    }
}
const videoPlayer = new VideoPlayer();
