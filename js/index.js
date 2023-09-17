const dayWeek = document.querySelectorAll('.page-nav__day-week');
const dayNumber = document.querySelectorAll('.page-nav__day-number');
const dayWeekArr = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const today = new Date();
const todayStart = today.setHours(0, 0, 0, 0);

for (let i = 0; i < dayNumber.length; i++) {
	let dayNow = new Date(todayStart + (i * (24 * 60 * 60 * 1000)));
	dayNumber[i].textContent = `${dayNow.getDate()}`;
	dayNumber[i].parentNode.dataset.timestamp = todayStart + (i * (24 * 60 * 60 * 1000));
	dayWeek[i].textContent = `${dayWeekArr[dayNow.getDay()]}`;

	if ((dayWeek[i].textContent === 'Вс') || (dayWeek[i].textContent === 'Сб')) {
		dayNumber[i].parentNode.classList.add('page-nav__day_weekend')
	} else {
		dayNumber[i].parentNode.classList.remove('page-nav__day_weekend');
	}
};

let navButtons = [...document.querySelectorAll('.page-nav__day')];
navButtons.forEach(button => {
	button.addEventListener('click', () => {
		navButtons.forEach(e => {
			e.classList.remove('page-nav__day_chosen')
		})
		button.classList.add('page-nav__day_chosen');
		createRequest(updatePost, hallsResult);
	})
});

let main = document.querySelector("main");
let updatePost = 'event=update';
createRequest(updatePost, hallsResult);

function hallsResult(response) {
	main.innerHTML = '';
	let arr = {
		seances: response.seances.result,
		films: response.films.result,
		halls: response.halls.result.filter((hall) => hall.hall_open == 1),
	};


	arr.films.forEach(film => {
		let html = `<section class="movie">
      <div class="movie__info">
        <div class="movie__poster">
          <img class="movie__poster-image" src="${film.film_poster}">
        </div>
        <div class="movie__description">
          <h2 class="movie__title">${film.film_name}</h2>
          <p class="movie__synopsis">${film.film_description}</p>
          <p class="movie__data">
            <span class="movie__data-duration"> ${film.film_duration} минут</span>
            <span class="movie__data-origin">${film.film_origin}</span>
          </p>
        </div>
      </div>`;

		arr.halls.forEach(hall => {
			let seances = arr.seances.filter(seance => ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === film.film_id)));
			if (seances.length > 0) {
				html += `<div class="movie-seances__hall">
            <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
            <ul class="movie-seances__list">`;

				seances.forEach(seance => {
					html += `<li class="movie-seances__time-block">
                    <a class="movie-seances__time" href="hall.html"
            data-film-name="${film.film_name}" 
            data-film-id="${film.film_id}" 
            data-hall-name="${hall.hall_name}" 
            data-hall-id="${hall.hall_id}"
            data-price-standart="${hall.hall_price_standart}" 
			data-price-vip="${hall.hall_price_vip}" 
            data-seance-id="${seance.seance_id}"
			data-seance-start="${seance.seance_start}" 
            data-seance-time="${seance.seance_time}">${seance.seance_time}</a>
            </li>`;
				});
				html +=
					`</ul>
            </div>`
			}
		})
		html += `</section>`;
		main.insertAdjacentHTML("beforeend", html);
	})

let chosenSeance = document.querySelectorAll('.movie-seances__time');
	let chosenDay = document.querySelector('.page-nav__day_chosen');
	let chosenDayTimestamp = chosenDay.dataset.timestamp;
	let now = new Date().getTime();


	chosenSeance.forEach(el => {
        let seanceStart = +el.dataset.seanceStart * 60 * 1000;
        let seanseTimestamp = +chosenDayTimestamp + seanceStart;

        
		if (seanseTimestamp < now) {
			el.style.background = 'grey'
		}

		el.addEventListener('click', (event) => {
			if (seanseTimestamp < now) {
				event.preventDefault()
			} else {
				let chosenData = event.target.dataset;
				chosenData.timestamp = Math.floor(seanseTimestamp / 1000);

				chosenData.hallsResult = arr.halls.find((hall) => hall.hall_id == chosenData.hallId).hall_config;
				sessionStorage.setItem('session', JSON.stringify(chosenData));
			}
		})
	})
}

