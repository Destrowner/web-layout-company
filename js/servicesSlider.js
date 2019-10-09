/* 
clientLeft, clientTop - ширина границ елемента;

offsetWidth, offsetHeight - ширина елемента с падингами и границами;
clientWidth, clientHeight - ширина елемента с падингом (без полосы прокрутки и границ);

scrollLeft, scrollTop - на сколько элемент, имеющий полосу прокрутки, прокручен слева и сверху;
scrollWidth, scrollHeight - полная ширина и высота элемента с учетом прокрученной части.

offsetParent - родитель, относительно которого позиционируется элемент;
offsetLeft, offsetTop - позиция в пикселях левого верхнего угла блока относительно его offsetParent.

pageXOffset, pageYOffset - прокрутка страницы;

scrollTo(по горизонтали, по вертикали) - позволяет прокрутить страницу по горизонтали и (или) вертикали в указанное место;
scrollBy(по горизонтали, по вертикали) - позволяет прокрутить страницу по горизонтали и вертикали относительно текущей прокрутки.

scrollIntoView(true/false) - позволяет прокрутить страницу так, что бы элемент оказался вверху либо внизу.
*/

/*
document.documentElement.clientWidth/Height - получения размеров видимой части окна;
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
) - получения размеров страницы с учётом прокрутки;
*/



var multiItemSlider = (function () {
	return function (selector, config) {
		var
			_mainElement = document.querySelector(selector), // основный элемент блока
			_sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
			_sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
			_sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
			_sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
			_sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
			_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
			_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
			_positionLeftItem = 0, // позиция левого активного элемента
			_transform = 0, // значение транфсофрмации .slider_wrapper
			_step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
			_items = [], // массив элементов
			_interval = 0,
			_config = {
				isCycling: false, // автоматическая смена слайдов
				direction: 'right', // направление смены слайдов
				interval: 5000, // интервал между автоматической сменой слайдов
				pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
			};

		for (var key in config) {
			if (key in _config) {
				_config[key] = config[key];
			}
		}

		// наполнение массива _items
		_sliderItems.forEach(function (item, index) {
			_items.push({ item: item, position: index, transform: 0 });
		});

		var position = {
			getItemMin: function () {
				var indexItem = 0;
				_items.forEach(function (item, index) {
					if (item.position < _items[indexItem].position) {
						indexItem = index;
					}
				});
				return indexItem;
			},
			getItemMax: function () {
				var indexItem = 0;
				_items.forEach(function (item, index) {
					if (item.position > _items[indexItem].position) {
						indexItem = index;
					}
				});
				return indexItem;
			},
			getMin: function () {
				return _items[position.getItemMin()].position;
			},
			getMax: function () {
				return _items[position.getItemMax()].position;
			}
		}

		var _transformItem = function (direction) {
			var nextItem;
			if (direction === 'right') {
				_positionLeftItem++;
				if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
					nextItem = position.getItemMin();
					_items[nextItem].position = position.getMax() + 1;
					_items[nextItem].transform += _items.length * 100;
					_items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
				}
				_transform -= _step;
			}
			if (direction === 'left') {
				_positionLeftItem--;
				if (_positionLeftItem < position.getMin()) {
					nextItem = position.getItemMax();
					_items[nextItem].position = position.getMin() - 1;
					_items[nextItem].transform -= _items.length * 100;
					_items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
				}
				_transform += _step;
			}
			_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
		}

		var _cycle = function (direction) {
			if (!_config.isCycling) {
				return;
			}
			_interval = setInterval(function () {
				_transformItem(direction);
			}, _config.interval);
		}

		// обработчик события click для кнопок "назад" и "вперед"
		var _controlClick = function (e) {
			var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
			e.preventDefault();
			_transformItem(direction);
			clearInterval(_interval);
			_cycle(_config.direction);
		};

		var _setUpListeners = function () {
			// добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
			_sliderControls.forEach(function (item) {
				item.addEventListener('click', _controlClick);
			});
			if (_config.pause && _config.isCycling) {
				_mainElement.addEventListener('mouseenter', function () {
					clearInterval(_interval);
				});
				_mainElement.addEventListener('mouseleave', function () {
					clearInterval(_interval);
					_cycle(_config.direction);
				});
			}
		}

		// инициализация
		_setUpListeners();
		_cycle(_config.direction);

		return {
			right: function () { // метод right
				_transformItem('right');
			},
			left: function () { // метод left
				_transformItem('left');
			},
			stop: function () { // метод stop
				_config.isCycling = false;
				clearInterval(_interval);
			},
			cycle: function () { // метод cycle 
				_config.isCycling = true;
				clearInterval(_interval);
				_cycle();
			}
		}

	}
}());

var slider = multiItemSlider('.slider__services', {
	isCycling: true
})