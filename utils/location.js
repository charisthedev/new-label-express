const axios = require("axios");

const getLocationDetails = async (ip) => {
  let address = ip.split(",")[0];
  if (address.startsWith("::ffff:")) {
    address = address.substring(7);
  }
  console.log(ip, address);
  try {
    const geo = await axios.get(`http://ip-api.com/json/${address}`);
    const country = geo?.data?.country;
    const currencyResponse = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const currency = currencyResponse.data[0].currencies;
    const currencyCode = Object.keys(currency)[0].toLowerCase();
    const validCurrencies = ["ngn", "usd", "gbp", "cad", "eur"];
    return validCurrencies.includes(currencyCode) ? currencyCode : "usd";
  } catch (error) {
    console.log(error);
  }
};

module.exports = getLocationDetails;
