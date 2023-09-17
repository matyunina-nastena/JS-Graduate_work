let chosenData = JSON.parse(sessionStorage.session);
fetch("https://jscp-diplom.netoserver.ru/", {
	method: "POST",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: `event=sale_add&timestamp=${chosenData.timestamp}&hallId=${chosenData.hallId}&seanceId=${chosenData.seanceId}&hallConfiguration=${chosenData.hallsResult}`
});
const ticketTitle = document.querySelector('.ticket__title')
const ticketChairs = document.querySelector('.ticket__chairs')
const ticketHall = document.querySelector('.ticket__hall')
const ticketStart = document.querySelector('.ticket__start')

let date = new Date(chosenData.timestamp * 1000);
let dateString = date.toLocaleString("ru-RU",
{
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
});

ticketTitle.innerText = chosenData.filmName;
ticketStart.innerText = dateString;
ticketHall.innerText = chosenData.hallName.split('Зал').join('');

let chairsArr = [];
let arr = chosenData.selectedPlaces;

for(let i = 0; i < arr.length; i++) {
    chairsArr.push(`${arr[i].row}/${arr[i].place}`)
};
ticketChairs.textContent = chairsArr.join(', ');

let seanceInfo = `Билет в кино
На сеанс: "${chosenData.filmName}"
Начало сеанса: ${dateString}
Зал: ${chosenData.hallName}
Ряд/Место: ${ticketChairs.textContent}
`;

const qr = QRCreator(seanceInfo, { image: "SVG" });
document.querySelector('.ticket__info-qr').append(qr.result);