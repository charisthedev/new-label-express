const axios = require("axios");

const converter = async (wallet,currency) => {
    const rates = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.RATE_API_KEY}`);
    const ngn = wallet.ngn / rates.data.rates.NGN;
    const gbp = wallet.gbp / rates.data.rates.GBP;
    const cad = wallet.cad / rates.data.rates.CAD;
    const eur = wallet.eur / rates.data.rates.EUR;
    const totalUsd = Number(ngn) + Number(cad) + Number(eur) + Number(gbp) + Number(wallet.usd);
    const baseValue = totalUsd * (currency === "usd"?1:rates.data.rates[currency.toUpperCase()])
    return parseInt(baseValue);
}

module.exports = converter;