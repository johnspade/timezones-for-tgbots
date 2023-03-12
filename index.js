const dateTimeUtc = moment.utc();
document.querySelector(".js-TimeUtc").innerHTML = dateTimeUtc.format("ddd, DD MMM YYYY HH:mm:ss");

const selectorOptions = moment.tz.names()
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
    .reduce((memo, tz) => {
        const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';

        return memo.concat(`<option value="${tz.name}">(GMT${timezone}) ${tz.name}</option>`);
    }, "");

document.querySelector(".js-Selector").innerHTML = selectorOptions;

document.querySelector(".js-Selector").addEventListener("change", e => {
    const timestamp = dateTimeUtc.unix();
    const offset = moment.tz(e.target.value).utcOffset() * 60;
    const dateTimeLocal = moment.unix(timestamp + offset).utc();

    document.querySelector(".js-TimeLocal").innerHTML = dateTimeLocal.format("ddd, DD MMM YYYY HH:mm:ss");
});

document.querySelector(".js-Selector").value = "Europe/London";

const event = new Event("change");
document.querySelector(".js-Selector").dispatchEvent(event);

function sendSelectedTimezone() {
    const timezone = document.querySelector('.js-Selector').value;
    window.Telegram.WebApp.sendData(JSON.stringify({ timezone: timezone }));
}
