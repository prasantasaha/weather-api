const fetch = require("node-fetch");
const cors = require("cors")();

const DARK_SKY_END_POINT = "https://api.darksky.net/forecast/";
const DARK_SKY_API_KEY = "0123456789abcdef9876543210fedcba"; // "841b9a6d7365fde1d393b2e77687a399";

exports.forecast = (req, res) => {
    const requestURL = new url.URL(
        `${DARK_SKY_END_POINT}${DARK_SKY_API_KEY}${req.url}`);

    cors(req, res, () => {
        fetch(requestURL)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data.error && data.code) {
                    res.status(data.code);
                }
                res.send(data);
            });
    });








}
