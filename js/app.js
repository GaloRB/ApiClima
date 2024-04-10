const container = document.querySelector('.container');
const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');

window.addEventListener('load', () => {
    form.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    //validar
    const city = document.querySelector('#ciudad').value;
    const country = document.querySelector('#pais').value;

    if (city === '' || country === '') {
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    callAPI(city, country);
}

function mostrarError(mensaje) {
    const alert = document.querySelector('.bg-red-100');

    if (!alert) {
        const alert = document.createElement('div');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alert.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `
        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 1500);
    }


}

function callAPI(city, country) {
    const APIKey = 'b054a0fe09172cb2fa398f5d6bd41bc4';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIKey}`;

    spinner();

    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        cleanHml();
        console.log(data);
        if (data.cod === "404") {
            mostrarError('La ciudad no pudeo ser encontrada o no existe');
            return;
        }

        //mostrar el resultado en el html
        showWeather(data);
    })
}

function showWeather(data) {
    const { name, main: { temp, temp_max, temp_min } } = data;

    const centigrade = kelvinToCentigrade(temp);
    const max = kelvinToCentigrade(temp_max);
    const min = kelvinToCentigrade(temp_min);

    const cityName = document.createElement('p');
    cityName.textContent = `El clima en ${name} es:`;
    cityName.classList.add('font-bold', 'text-2xl');

    const current = document.createElement('p');
    current.innerHTML = `${centigrade} &#8451`;
    current.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451`;
    tempMin.classList.add('text-xl');

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('text-center', 'text-white');
    resultDiv.appendChild(cityName);
    resultDiv.appendChild(current);
    resultDiv.appendChild(tempMax);
    resultDiv.appendChild(tempMin);

    result.appendChild(resultDiv);
}

function cleanHml() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

const kelvinToCentigrade = (grades) => parseInt(grades - 273.15);

function spinner() {
    cleanHml();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase')
    divSpinner.innerHTML = `
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
    `;

    result.appendChild(divSpinner);
};