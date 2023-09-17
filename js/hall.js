let chosenData = JSON.parse(sessionStorage.session);

let buyingInfoTitle = document.querySelector('.buying__info-title');
let buyingInfoStart = document.querySelector('.buying__info-start');
let buyingInfoHall = document.querySelector('.buying__info-hall');
let priceStandart = document.querySelector('.price-standart');
let priceVip = document.querySelector('.price-vip');

buyingInfoTitle.innerText = `${chosenData.filmName}`;
buyingInfoStart.innerText = `Начало сеанса ${chosenData.seanceTime}`;
buyingInfoHall.innerText = `${chosenData.hallName.split('Зал').join('Зал ')}`;
priceStandart.innerText = `${chosenData.priceStandart}`;
priceVip.innerText = `${chosenData.priceVip}`;

const buttonAcception = document.querySelector('.acceptin-button');
let configHall = document.querySelector('.conf-step__wrapper');
let chairs = [...document.querySelectorAll('.conf-step__chair')];
buttonAcception.setAttribute('disabled', 'disabled');

let updateRequest = `event=get_hallConfig&timestamp=${chosenData.timestamp}&hallId=${chosenData.hallId}&seanceId=${chosenData.seanceId}`;
createRequest( updateRequest, (response) => {
	if (response) {
		chosenData.hallsResult = response;
	}
	configHall.innerHTML = chosenData.hallsResult;

	let chairs = [...document.querySelectorAll('.conf-step__chair')];
	
    chairs.forEach(chair => {
        chair.addEventListener('click', (e) => {
            
            if (e.target.closest('.conf-step__legend-price') || e.target.classList.contains('conf-step__chair_taken') || e.target.classList.contains('conf-step__chair_disabled')) {
				return;
			}
				e.target.classList.toggle('conf-step__chair_selected');
				arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
            if (arrSelectedChairs.length > 0) {
                buttonAcception.removeAttribute('disabled');
            } else {
                buttonAcception.setAttribute('disabled', 'disabled');
            }
			})
        })
		
		buttonAcception.addEventListener('click', () => {
			let arrSelectedChairs = [...document.querySelectorAll('.conf-step__row .conf-step__chair_selected')];
			let selectedChairs = [];
			arrSelectedChairs.forEach((chair) => {
				let row = chair.closest('.conf-step__row');
				let rowIndex = Array.from(row.parentNode.children).indexOf(row) + 1;
				let chairIndex = Array.from(row.children).indexOf(chair) + 1;
				let chairType = (chair.classList.contains('conf-step__chair_standart')) ? 'standart' : 'vip';
				selectedChairs.push({ row: rowIndex, place: chairIndex, type: chairType});
			})
		chosenData.hallsResult = configHall.innerHTML;
		chosenData.selectedPlaces = selectedChairs;
		sessionStorage.setItem('session', JSON.stringify(chosenData));
		window.location.href = 'payment.html';
    })
});



