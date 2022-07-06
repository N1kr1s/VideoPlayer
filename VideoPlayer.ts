class VideoPlayer {
  videoDurationMilisec: number = 0;
  isFullscreen: boolean = false;
  lastVolume: number = 0;
  isPlaying: boolean = false;
  video: HTMLVideoElement;
  playPause: HTMLElement;
  currentTime: HTMLSpanElement;
  duration: HTMLSpanElement;
  progressBar: HTMLDivElement;
  volumeRange: HTMLDivElement;
  volumeBar: HTMLDivElement;
  playerSpeed: HTMLSelectElement;
  progressRange: HTMLDivElement;
  volumeIcon: HTMLElement;
  toggleFullscreen: HTMLElement;
  player: HTMLDivElement;

  constructor() {
    this.video = document.querySelector('.video') as HTMLVideoElement;
    this.playPause = document.getElementById('play-btn') as HTMLElement;
    this.currentTime = document.querySelector(
      '.time-elapsed'
    ) as HTMLSpanElement;
    this.duration = document.querySelector('.time-duration') as HTMLSpanElement;
    this.progressRange = document.querySelector(
      '.progress-range'
    ) as HTMLDivElement;
    this.progressBar = document.querySelector(
      '.progress-bar'
    ) as HTMLDivElement;
    this.volumeRange = document.querySelector(
      '.volume-range'
    ) as HTMLDivElement;
    this.volumeBar = document.querySelector('.volume-bar') as HTMLDivElement;
    this.playerSpeed = document.querySelector(
      '.player-speed'
    ) as HTMLSelectElement;
    this.volumeIcon = document.getElementById('volume-icon') as HTMLElement;
    this.toggleFullscreen = document.querySelector('.fa-expand') as HTMLElement;
    this.player = document.querySelector('.player') as HTMLDivElement;

    this.video.addEventListener('click', () => {
      this.isPlaying ? this.pause() : this.play();
    });

    this.playPause.addEventListener('click', () => {
      this.isPlaying ? this.pause() : this.play();
    });

    this.video.addEventListener(
      'timeupdate',
      this.timeAndProgressBarUpdate.bind(this)
    );

    // *Changing video position by clicking on the line(progressRange)
    this.progressRange.addEventListener(
      'click',
      this.changeVideoPosition.bind(this)
    );

    //*Changing volume
    this.volumeRange.addEventListener('click', this.volumeChange.bind(this));

    this.volumeIcon.addEventListener('click', this.toggleSound.bind(this));

    this.playerSpeed.addEventListener('input', (e: Event) => {
      this.video.playbackRate = Number((e.target as HTMLSelectElement).value);
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

  timeAndProgressBarUpdate(e: Event) {
    this.currentTime.innerText = `${this.convertTime(
      (e.target as HTMLVideoElement).currentTime
    )} /`;
    this.duration.innerText = this.convertTime(
      (e.target as HTMLVideoElement).duration
    );
    this.videoDurationMilisec = (e.target as HTMLVideoElement).duration;

    const percentages =
      ((e.target as HTMLVideoElement).currentTime /
        (e.target as HTMLVideoElement).duration) *
      100;
    this.progressBar.style.width = `${percentages}%`;

    if (this.progressBar.style.width === '100%') this.pause();
  }

  changeVideoPosition(e: MouseEvent) {
    this.progressBar.style.width = `${
      (e.offsetX / this.progressRange.offsetWidth) * 100
    }%`;

    const newTime =
      (e.offsetX / this.progressRange.offsetWidth) * this.videoDurationMilisec;
    this.video.currentTime = newTime;
  }

  convertTime(time: number) {
    return (
      Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
    );
  }

  volumeChange(e: MouseEvent) {
    let value = e.offsetX / (e.currentTarget as HTMLDivElement).clientWidth;
    if (value < 0.1) value = 0;
    else if (value > 0.9) value = 1;

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
    } else {
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
    } else if (this.video.volume > 0.5) {
      this.volumeIcon.classList.add('fa-solid', 'fa-volume-high');
    } else {
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
