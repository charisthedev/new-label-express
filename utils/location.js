const axios = require("axios");

const getLocationDetails = async (ip) => {
    const geo = await axios.get(`http://ip-api.com/json/${ip.split(",")[0]}`)
    const country = geo?.data?.country;
    const currencyResponse = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
    const currency = currencyResponse.data[0].currencies;
    const currencyCode = Object.keys(currency)[0].toLowerCase();
    return currencyCode;
}

module.exports = getLocationDetails;