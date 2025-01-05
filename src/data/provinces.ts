export const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
] as const;

export const provinceData = {
  "Alberta": [
    "Calgary",
    "Edmonton",
    "Red Deer",
    "Lethbridge",
    "St. Albert",
    "Medicine Hat",
    "Grande Prairie",
    "Airdrie",
    "Spruce Grove",
    "Leduc"
  ],
  "British Columbia": [
    "Vancouver",
    "Victoria",
    "Surrey",
    "Burnaby",
    "Richmond",
    "Abbotsford",
    "Kelowna",
    "Nanaimo",
    "Kamloops",
    "Prince George"
  ],
  "Manitoba": [
    "Winnipeg",
    "Brandon",
    "Steinbach",
    "Thompson",
    "Portage la Prairie",
    "Selkirk",
    "Dauphin",
    "Winkler",
    "Morden",
    "The Pas"
  ],
  "New Brunswick": [
    "Saint John",
    "Moncton",
    "Fredericton",
    "Dieppe",
    "Miramichi",
    "Edmundston",
    "Bathurst",
    "Campbellton",
    "Oromocto",
    "Grand Falls"
  ],
  "Newfoundland and Labrador": [
    "St. John's",
    "Mount Pearl",
    "Corner Brook",
    "Paradise",
    "Conception Bay South",
    "Grand Falls-Windsor",
    "Gander",
    "Happy Valley-Goose Bay",
    "Torbay",
    "Portugal Cove-St. Philip's"
  ],
  "Northwest Territories": [
    "Yellowknife",
    "Hay River",
    "Inuvik",
    "Fort Smith",
    "Norman Wells",
    "Fort Simpson",
    "Behchokǫ̀",
    "Fort Resolution",
    "Fort Liard",
    "Tuktoyaktuk"
  ],
  "Nova Scotia": [
    "Halifax",
    "Dartmouth",
    "Sydney",
    "Truro",
    "New Glasgow",
    "Glace Bay",
    "Bridgewater",
    "Kentville",
    "Amherst",
    "Yarmouth"
  ],
  "Nunavut": [
    "Iqaluit",
    "Rankin Inlet",
    "Arviat",
    "Baker Lake",
    "Cambridge Bay",
    "Igloolik",
    "Pond Inlet",
    "Pangnirtung",
    "Kugluktuk",
    "Cape Dorset"
  ],
  "Ontario": [
    "Toronto",
    "Ottawa",
    "Mississauga",
    "Hamilton",
    "London",
    "Brampton",
    "Windsor",
    "Kingston",
    "Kitchener",
    "Waterloo"
  ],
  "Prince Edward Island": [
    "Charlottetown",
    "Summerside",
    "Stratford",
    "Cornwall",
    "Montague",
    "Kensington",
    "Souris",
    "Alberton",
    "Georgetown",
    "Tignish"
  ],
  "Quebec": [
    "Montreal",
    "Quebec City",
    "Laval",
    "Gatineau",
    "Longueuil",
    "Sherbrooke",
    "Saguenay",
    "Levis",
    "Trois-Rivieres",
    "Terrebonne"
  ],
  "Saskatchewan": [
    "Saskatoon",
    "Regina",
    "Prince Albert",
    "Moose Jaw",
    "Swift Current",
    "Yorkton",
    "North Battleford",
    "Estevan",
    "Weyburn",
    "Warman"
  ],
  "Yukon": [
    "Whitehorse",
    "Dawson City",
    "Watson Lake",
    "Haines Junction",
    "Mayo",
    "Carmacks",
    "Faro",
    "Teslin",
    "Ross River",
    "Beaver Creek"
  ]
} as const;

export type Province = keyof typeof provinceData;
export type City = typeof provinceData[Province][number];