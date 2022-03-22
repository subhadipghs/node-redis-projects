"use strict";

const { getClient, connect, quit } = require("./redis");

const gk = "cities:geo";
const geoPoints = [
  {
    id: 1,
    city: "kolkata",
    latitude: 22.572645,
    longitude: 88.363892,
  },
  {
    id: 2,
    city: "burdwan",
    latitude: 23.2491,
    longitude: 87.8694,
  },
  {
    id: 3,
    city: "kharagpur",
    latitude: 22.3,
    longitude: 87.2,
  },
  {
    id: 4,
    city: "borahnagar",
    latitude: 27.732389,
    longitude: 78.753967,
  },
  {
    id: 5,
    city: "nabadwip",
    latitude: 23.399191,
    longitude: 88.363518,
  },
];

async function addGeoPoints() {
  const client = getClient();
  await connect();
  for (let geo of geoPoints) {
    await client.geoAdd(
      gk,
      {
        member: geo.id,
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
      { NX: true }
    );
    await client.zAdd("cities", {
      score: geo.id,
      value: geo.city,
    });
  }
}

async function findGeoPoints() {
  // find the geohash of a city
  const client = getClient();
  const kolkataGeoHash = await client.geoHash(gk, "kolkata");
  console.log("kolkata geo hash", kolkataGeoHash);
  // geo radius queries
  const placesWithin100KM = await client.sendCommand([
    "GEORADIUS",
    gk,
    geoPoints[0].longitude,
    geoPoints[0].latitude,
    100,
    "km",
    "WITHCOORD",
    "WITHDIST",
  ]);
  console.log(placesWithin100KM);
}

async function geoStoreInZset() {
  const client = getClient();
  await client.sendCommand([
    "GEORADIUS",
    gk,
    geoPoints[0].longitude,
    geoPoints[0].latitude,
    100,
    "km",
    "STORE",
    "intrm:100:km",
  ]);
  // get the sorted set where the results from georadius query is stored
  const citiesIn100km = await client.zRange("intrm:100:km", 0, -1);
  console.log("cities within 100km", citiesIn100km);
  // retrieve the cities that are not within the 100km
  // we perform set difference of cities and cities-within-100 sets
  const citiesNotIn100km = await client.zDiff(['cities', 'intrm:100:km'])
  console.log("cities within 100km", citiesNotIn100km);
}

const main = async () => {
  await addGeoPoints();
  await geoStoreInZset();
  await getClient().quit();
};

main();
