
# Summoner's War Rune Build Recommendations

---

Name: Liam Poling

Date: 4/26/2017

Project Topic: Summoner's War Rune Build Recommendations

URL: https://runerecommendations-jjsugorazl.now.sh

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     monster        `Type: String`
- `Field 2`:     sets           `Type: [String]`
- `Field 3`:     stats          `Type: [String]`
- `Field 4`:     rating         `Type: Number`
- `Field 5`:     description    `Type: String`

Schema: 
{
    monster: {
        type: String,
        required: true
    },
    sets: {
        type: [String],
        required: true
    },
    stats: {
      type: [String],
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 100
    },
    description: String
}

### 2. Add New Data

HTML form route: `/newrecommendation`

POST endpoint route: `/api/recommendations`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/recommendations',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       monster: 'Rakan',
       sets: ["Vampire", Energy"],
       stats: ["HP or SPD", "CD", "HP"],
       rating: 100,
       description: 'Really good monster'
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getRecommendations`

### 4. Search Data

Search Field: monster

### 5. Navigation Pages

Navigation Filters
1. Search By Monster -> `/monsters/:m_id`
2. Search By Rune -> `/runes/:r_id`
3. Search By Stat -> `/stats/:s_id`
4. Radnom Monster -> `/random`
5. High Rated Monsters -> `/rating/74`

