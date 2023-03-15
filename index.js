var selectedTimezoneElement = document.querySelector('.selected-timezone');
var timezoneListElement = document.querySelector('.timezone-list');
var searchInput = timezoneListElement.querySelector('input');
var timezoneUl = timezoneListElement.querySelector('ul');
var guessedTimezone = moment.tz.guess();
var userTimezone = guessedTimezone ? guessedTimezone : 'UTC'
selectedTimezoneElement.innerText = userTimezone;

var timezones = moment.tz.names()
    .reduce((memo, tz) => {
        memo.push({
            name: tz,
            offset: moment.tz(tz).utcOffset()
        });
        return memo;
    }, [])
    .sort((a, b) => {
        return a.offset - b.offset
    })
timezones.forEach(timezone => {
    var offset = timezone.offset ? moment.tz(timezone.name).format('Z') : '';
    var li = document.createElement('li');
    li.innerText = `(GMT${offset}) ${timezone.name}`;
    timezoneUl.appendChild(li);

    li.addEventListener('click', () => {
        selectedTimezoneElement.innerText = li.innerText;
        timezoneListElement.classList.remove('show');
    });
});

selectedTimezoneElement.addEventListener('click', () => {
    timezoneListElement.classList.toggle('show');
    searchInput.value = '';
    filterTimezones('');
    searchInput.focus();
});

searchInput.addEventListener('input', () => {
    var searchTerm = searchInput.value.toLowerCase();
    filterTimezones(searchTerm);
});

function filterTimezones(searchTerm) {
    var liElements = timezoneUl.getElementsByTagName('li');
    Array.from(liElements).forEach(li => {
        var timezoneName = li.innerText.toLowerCase();
        if (timezoneName.indexOf(searchTerm) > -1) {
            li.style.display = 'block';
        } else {
            li.style.display = 'none';
        }
    });
}

window.Telegram.WebApp.MainButton.onClick(sendSelectedTimezone).show()

function sendSelectedTimezone() {
    var timezone = document.querySelector('.selected-timezone').value.split(' ');
    var name = timezone[timezone.length - 1];
    window.Telegram.WebApp.sendData(JSON.stringify({ timezone: name }));
}
