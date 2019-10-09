function dropdownLinks() {
	let close = function() {
		let subm = document.querySelectorAll('.main__nav-item > a');
		for (let i of subm) {
			i.nextElementSibling.style.display = 'none';
		}
	}

	let nav = document.querySelector('.main__nav');
	nav.addEventListener('mouseover', (e) => {
		let target = e.target;
		let targetParent = target.closest('.main__nav-item');
		if (targetParent) {
			let subm = targetParent.querySelector('.main__nav-item > a');
			close();
			if (subm) {
				subm.nextElementSibling.style.display = 'flex';
			}
		}
	});
}
dropdownLinks();

function dropdownMenu() {
	document.addEventListener('mouseup', function(e) {
		let btn = document.querySelector('#menuToggle');
		if (e.target.parentElement == btn) {
			document.querySelector('header nav').classList.toggle('show');
		}
		let nav = document.querySelector('.main__nav');
		if (!e.path.includes(nav) && e.target.parentElement != btn) {
			document.querySelector('header nav').classList.remove('show');
			btn.querySelector('input').checked = false;
		}
	});
}
dropdownMenu();



let animateButton = function(e) {
  e.preventDefault;
  e.target.classList.remove('animate');
	e.target.classList.add('animate');
	
  setTimeout(function(){
    e.target.classList.remove('animate');
  }, 700);
};

let bubblyButtons = document.getElementsByClassName("bubbly-button");

for (let i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}

function feedbackSlider() {
	let slides = document.querySelectorAll('.feedback__slide');
	let currentSlide = 0;
	let slideInterval = setInterval(nextSlide, 2000);
	function nextSlide(){
		currentSlide = (currentSlide + 1) % slides.length;
		if (currentSlide > 0) {
			slides[currentSlide - 1].style.opacity = '0';
		} else if (currentSlide == 0) {
			slides[slides.length - 1].style.opacity = '0'
		}
		slides[currentSlide].style.opacity = '1';
	}
}
feedbackSlider();

function validate() {
	let name = document.getElementById('name');
	let btn = document.getElementById('contacts-button');
	let nameReg = /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']?$/;
	let telReg = /^\d[\d\(\)\ -]{4,14}\d$/;

	name.addEventListener('input', function() {
		if (!nameReg.test(name.value)) {
			name.style.backgroundColor = '#FF9E9E';
		} else {
			name.style.backgroundColor = 'white';
		}
	});

	let tel = document.getElementById('tel');
	tel.addEventListener('input', function() {
		if (!telReg.test(tel.value)) {
			tel.style.backgroundColor = '#FF9E9E';
		} else {
			tel.style.backgroundColor = 'white';
		}
	});
	
	btn.onclick = function(e) {
		if (nameReg.test(name.value) == false || telReg.test(tel.value) == false || name.value == '' || tel.value == '') {
			e.preventDefault();
		}
	}

	let email = document.getElementById('email');
	email.addEventListener('input', function() {
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value)) {
			email.style.backgroundColor = '#FF9E9E';
			email.nextElementSibling.setAttribute('disabled', 'true');
		} else {
			email.style.backgroundColor = 'white';
			email.nextElementSibling.removeAttribute('disabled');
		}
	});
}
validate();