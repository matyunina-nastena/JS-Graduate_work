let chosenData = JSON.parse(sessionStorage.session);

let ticketTitle = document.querySelector('.ticket__title');
let ticketChairs = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
let ticketStart = document.querySelector('.ticket__start');
let ticketCost = document.querySelector('.ticket__cost');
let buttonAcception = document.querySelector('.acceptin-button');

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
ticketHall.innerText = chosenData.hallName.split('Зал').join('');
ticketStart.innerText = dateString;

let chairsArr = [];
let price = 0;
let arr = chosenData.selectedPlaces;

for(let i = 0; i < arr.length; i++) {
    chairsArr.push(`${arr[i].row}/${arr[i].place}`)
    if(arr[i].type === 'standart') {
        price += +chosenData.priceStandart;
    } else {
        price += +chosenData.priceVip; 
    }
}
ticketCost.textContent = price;
ticketChairs.textContent = chairsArr.join(', ');