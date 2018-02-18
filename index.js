const fetch = require("node-fetch");
const cors = require("cors")();


const DARK_SKY_END_POINT = "https://api.darksky.net/forecast/";
const DARK_SKY_API_KEY = "0123456789abcdef9876543210fedcba"; // "d50b3716794d67676d87b72f13a3cb68";

exports.forecast = (req, res) => {
    const requestURL = `${DARK_SKY_END_POINT}${DARK_SKY_API_KEY}${req.url}`;

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
