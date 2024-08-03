const axios = require("axios");

const calculateBaseCurrency = async (wallet,currency) => {
    const rates = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.RATE_API_KEY}`);
    const ngn = rates.data.rates.NGN * wallet.ngn;
    const gbp = rates.data.rates.GBP * wallet.gbp;
    const cad = rates.data.rates.CAD * wallet.cad;
    const eur = rates.data.rates.EUR * wallet.eur;
    const totalUsd = Number(ngn) + Number(cad) + Number(eur) + Number(gbp) + Number(wallet.usd);
    const baseValue = totalUsd / rates.data[currency.toUpperCase()]
    return baseValue;
}

module.exports = calculateBaseCurrency;