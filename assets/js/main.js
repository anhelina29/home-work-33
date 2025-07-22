const API_MOVIE_KEY = '904089eb'
const API_MOVIE_URL = 'http://www.omdbapi.com/'

const API_PHOTOS_ACCESS_KEY = 'setVKry_0ESdqVshrXhwF0GfddTj0hDjM7k5V3mrkUU'
const API_PHOTOS_URL = `https://api.unsplash.com/search/photos?client_id=${API_PHOTOS_ACCESS_KEY}&per_page=1&orientation=${screen.orientation.type.split('-')[0]}&query=`

const fetchMovie = async (movie) => {
    const query = `?apikey=${API_MOVIE_KEY}&t=${movie}`;

    const response = await fetch(API_MOVIE_URL + query);
    const data = await response.json();

    if (data.Response === 'True') {
        console.log(data);
        return data;
    } else {
        console.error(data.Error);
        alert('Щось пішло не так')
    }
    return data;
}

const fetchPhoto = async (movieName) => {
    const response = await fetch(API_PHOTOS_URL + movieName);
    const data = await response.json();

    document.body.style.backgroundImage = `url(${data?.results?.[0].urls.full})`;
}

const renderMovie = (movieData, containerSelector) => {
    const container = document.querySelector(containerSelector);
    container.innerHTML = '';

    container.appendChild(createMovieElement(
        'h2',
        `Movie: ${movieData.Title}`,
        'movie-title'
    ));

    const poster = document.createElement('img');
    poster.src = movieData.Poster
    poster.alt = movieData.Title
    container.appendChild(poster);

    container.appendChild(createMovieElement(
        'p',
        `Year: ${movieData.Year}`,
        'movie-year'
    ));

    container.appendChild(createMovieElement(
        'p',
        `Type of movie: ${movieData.Type}`,
        'movie-type'
    ));
}

const createMovieElement = (tagName, value, classes) => {
    const elem = document.createElement(tagName);
    elem.innerText = value;
    elem.className = classes;

    return elem;
}
document.forms.movieForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const movie = this.elements.movie.value;

    renderMovie(await fetchMovie(movie), '#movie');
    console.log(await fetchPhoto(movie));
    console.log(await fetchMovie(movie));
});


let timeout;

document.forms.movieForm.addEventListener('input', function (event) {
    event.preventDefault();

    const movie = this.elements.movie.value;

    clearTimeout(timeout)
    timeout = setTimeout(async function () {
        const data = await fetchMovie(movie);
        renderMovie(data, '#movie');
        await fetchPhoto(movie);
    }, 1000)
})


fetchPhoto();
