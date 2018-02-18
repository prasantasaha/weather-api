const fetch = require("node-fetch");
const cors = require("cors")();
const googleMaps = require('@google/maps');
const url = require('url');

const DARK_SKY_END_POINT = "https://api.darksky.net/forecast/";
const DARK_SKY_API_KEY = "0123456789abcdef9876543210fedcba"; // "d50b3716794d67676d87b72f13a3cb68";
const GOOGLE_PLACES_API_KEY = "AIzaSyBhLkWlQgsVgvd9XaybJQecqXDSi8fHX4c";

const googleMapsClient = googleMaps.createClient({
    key: GOOGLE_PLACES_API_KEY
});

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

exports.placesAutoComplete = (req, res) => {
    const query = url.parse(req.url, true).query || {};
    const input = query['input'] || "";

    if (input && input.length > 1 && typeof input === 'string') {
        googleMapsClient.placesAutoComplete({
            input: query.input,
            types: '(cities)'
        }, function (err, response) {
            if (!err) {
                res.json(response.json);
            } else {
                res.status(400);
                res.json(err.json ? err.json : { message: 'Unknown error' });
            }
        });
    } else {
        res.json({ predictions: [] });
    }

}