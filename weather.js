let currentPeriod = 'current';
const apiKey = "97cdcb7bfc4e5a40ba5b719636b59f10";

function switchPeriod(period){
    currentPeriod = period;
    getWeather(period);
}

function getWeatherEmoji(main) {
    switch(main) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain':
        case 'Drizzle': return '🌧️';
        case 'Thunderstorm': return '⛈️';
        case 'Snow': return '❄️';
        case 'Mist':
        case 'Fog': return '🌫️';
        default: return '🌡️';
    }
}

async function getWeather(period='current') {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        document.getElementById("weather").innerHTML = "<p style='color:red'>Please enter a city</p>";
        return;
    }

    try {
        let url;
        if (period === 'current') {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("City not found or forecast unavailable");
        const data = await res.json();

        let html = '';

        if (period === 'current') {
            html += `
                <div class="card">
                    <h3>${city}</h3>
                    <div class="sticker">${getWeatherEmoji(data.weather[0].main)}</div>
                    <p>${data.weather[0].description}</p>
                    <p>${data.main.temp}°C</p>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                </div>
            `;
            // смена видео по погоде
            changeWeatherVideo(data.weather[0].main);
        } else {
            const dailyMap = {};
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!dailyMap[date]) dailyMap[date] = [];
                dailyMap[date].push(item);
            });

            let days = Object.keys(dailyMap);
            if (period === '3days') days = days.slice(0, 3);

            days.forEach(day => {
                const dayData = dailyMap[day][0];
                html += `
                    <div class="card">
                        <h3>${day}</h3>
                        <div class="sticker">${getWeatherEmoji(dayData.weather[0].main)}</div>
                        <p>${dayData.weather[0].description}</p>
                        <p>${dayData.main.temp}°C</p>
                    </div>
                `;
            });
        }

        document.getElementById("weather").innerHTML = html;

    } catch(err) {
        document.getElementById("weather").innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}

function changeWeatherVideo(condition) {
    const video = document.getElementById('weatherVideo');
    switch(condition) {
        case 'Clear':
            video.src = './video/sunny.mp4';
            break;
        case 'Clouds':
            video.src = './video/cloud.mp4';
            break;
        case 'Rain':
        case 'Drizzle':
            video.src = './video/rain.mp4';
            break;
        case 'Snow':
            video.src = './video/snow.mp4';
            break;
        default:
            video.src = './video/sunny.mp4';
    }
    video.play();
}