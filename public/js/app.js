if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/service-worker.js")
		.then((reg) => console.log("Service Worker registered", reg))
		.catch((err) => console.log("Service Worker registration failed", err));
}

document.addEventListener("DOMContentLoaded", function () {
	const colorPicker = document.getElementById("colorPicker");
	const colorScreen = document.getElementById("colorScreen");
	const colorOptions = document.querySelectorAll(".color-option");
	let isFullScreen = false;
	let brightness = 1;
	let touchStartY = 0;
	let adjustingBrightness = false;
	let lastTapTime = 0;

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
        const color = this.dataset.color; 
        colorScreen.style.backgroundColor = color;
        colorScreen.style.display = "block";
        colorPicker.style.display = "none";
        isFullScreen = true;
        enterFullScreen();
    });
});


	function enterFullScreen() {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
	}

	function exitFullScreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		colorScreen.style.display = "none";
		colorPicker.style.display = "flex";
		isFullScreen = false;
	}

	colorScreen.addEventListener("touchstart", function (e) {
		if (e.touches.length === 1) {
			const currentTime = new Date().getTime();
			if (currentTime - lastTapTime < 300) {
				exitFullScreen();
				return;
			}
			lastTapTime = currentTime;
			touchStartY = e.touches[0].clientY;
			adjustingBrightness = true;
		}
	});

	colorScreen.addEventListener("touchmove", function (e) {
		if (adjustingBrightness && e.touches.length === 1) {
			let touchMoveY = e.touches[0].clientY;
			let diff = (touchStartY - touchMoveY) / 500;
			brightness = Math.max(0.1, Math.min(1, brightness + diff));
			colorScreen.style.filter = `brightness(${brightness})`;
			touchStartY = touchMoveY;
		}
	});

	colorScreen.addEventListener("touchend", function () {
		adjustingBrightness = false;
	});
});

//add author info to app
//add push notifications