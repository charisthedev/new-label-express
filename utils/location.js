const axios = require("axios");

const getLocationDetails = async (ip) => {
    let clientIp = ip
    if (ip === '::1') {
        clientIp = '127.0.0.1';
    }
    const geo = await axios.get(`http://ip-api.com/json/${ip}`);
    const country = geo.country;
    const currencyResponse = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
    const currency = currencyResponse.data[0].currencies;
    const currencyCode = Object.keys(currency)[0].toLowerCase();
    return currencyCode;
}

module.exports = getLocationDetails;