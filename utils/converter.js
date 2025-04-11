const Rate = require("../models/rateModel");

const converter = async (wallet, currency) => {
  const rates = (await Rate.find()).reduce((acc, data) => {
    acc[data.currency.toUpperCase()] = data.rate;
    return acc;
  }, {});
  const ngn = wallet.ngn / (rates.NGN ?? 1);
  const gbp = wallet.gbp / (rates.GBP ?? 1);
  const cad = wallet.cad / (rates.CAD ?? 1);
  const eur = wallet.eur / (rates.EUR ?? 1);
  const totalUsd =
    Number(ngn) +
    Number(cad) +
    Number(eur) +
    Number(gbp) +
    Number(wallet?.usd ?? 1);
  const baseValue =
    totalUsd * (currency === "usd" ? 1 : rates[currency.toUpperCase()]);
  return parseInt(baseValue);
};

module.exports = converter;
