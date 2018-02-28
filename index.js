'use strict';

const fetch = require('node-fetch');
const cors = require('cors')();
const googleMaps = require('@google/maps');
const url = require('url');
const UrlPattern = require('url-pattern');
const Promise = require('es6-promise').Promise;

const DARK_SKY_END_POINT = 'https://api.darksky.net/forecast/';
const DARK_SKY_API_KEY = 'd50b3716794d67676d87b72f13a3cb68';

exports.forecasts = (req, res) => {
  if (req.method === 'GET') {
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
  } else {
    // Only support GET.
    res.status(405).end();
  }
};

const GOOGLE_PLACES_API_KEY = 'AIzaSyBhLkWlQgsVgvd9XaybJQecqXDSi8fHX4c';

const googleMapsClient = googleMaps.createClient({
  key: GOOGLE_PLACES_API_KEY,
});

let getPlacesAutoComplete = query => {
  const input = query['input'] || '';
  return new Promise((resolve, reject) => {
    if (input && input.length > 1 && typeof input === 'string') {
      googleMapsClient.placesAutoComplete(
        {
          input: query.input,
          types: '(cities)',
        },
        (err, response) => {
          if (!err) {
            resolve(response);
          } else {
            reject(err);
          }
        }
      );
    } else {
      resolve({ predictions: [input] });
    }
  });
};

let getReverseGeocode = query => {
  const latitude = query['latitude'] || '';
  const longitude = query['longitude'] || '';

  return new Promise((resolve, reject) => {
    if (latitude && longitude) {
      googleMapsClient.reverseGeocode(
        { latlng: `${latitude},${longitude}` },
        (err, response) => {
          if (!err) {
            resolve(response);
          } else {
            reject(err);
          }
        }
      );
    } else {
      reject(
        new Error('Geocoder.reverseGeocode requires a latitude and longitude.')
      );
    }
  });
};

let getPlaceById = query => {
  const placeid = query['placeid'] || '';

  return new Promise((resolve, reject) => {
    if (placeid) {
      googleMapsClient.place({ placeid: placeid }, (err, response) => {
        if (!err) {
          resolve(response);
        } else {
          reject(err);
        }
      });
    } else {
      reject(new Error('placeid is required.'));
    }
  });
};

exports.maps = (req, res) => {
  if (req.method === 'GET') {
    const requestUrl = url.parse(req.url, true);
    const pattern = new UrlPattern('*(/:path)*');
    const path = pattern.match(requestUrl.href).path.toLowerCase() || '';
    const query = requestUrl.query || {};

    cors(req, res, () => {
      let promise;
      switch (path) {
        case 'autocomplete':
          promise = getPlacesAutoComplete(query);
          break;

        case 'reversegeocode':
          promise = getReverseGeocode(query);
          break;

        case 'place':
          promise = getPlaceById(query);
          break;

        default:
          promise = new Promise((resolve, reject) => {
            // path not found.
            reject(new Error('No handler configured'));
          });
      }

      promise.then(
        response => {
          res.json(response.json ? response.json : response);
        },
        err => {
          res.status(400);
          res.json({ message: err.message ? err.message : 'Unknown error' });
        }
      );
    });
  } else {
    // Only support GET.
    res.status(404.6).json({ message: 'Verb denied.' });
  }
};
