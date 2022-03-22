const { getClient, connect, quit } = require("./redis");

const gk = "cities:geo";
const geoPoints = [
  {
    city: "kolkata",
    latitude: 22.572645,
    longitude: 88.363892,
  },
  {
    city: "burdwan",
    latitude: 23.2491,
    longitude: 87.8694,
  },
  {
    city: "kharagpur",
    latitude: 22.3,
    longitude: 87.2,
  },
  {
    city: "borahnagar",
    latitude: 27.732389,
    longitude: 78.753967,
  },
  {
    city: "nabadwip",
    latitude: 23.399191,
    longitude: 88.363518,
  },
];

async function addGeoPoints() {
  const client = getClient();
  await connect();
  const replies = [];
  for (let geo of geoPoints) {
    const rep = await client.geoAdd(
      gk,
      {
        member: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
      { NX: true }
    );
    replies.push(rep);
  }
  console.dir(replies);
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
addGeoPoints()
  .then(() => {
    findGeoPoints()
      .then(() => {
        quit();
      })
      .catch(() => quit());
  })
  .catch(() => quit());
