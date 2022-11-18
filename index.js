//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

const API_BASE = 'https://api.nobelprize.org/2.1';
const API_LAUREATES = `${API_BASE}/laureates`;
let currSort = "name";
let currCategoryFilter = "---";
let currGenderFilter = "---"; //create another filter!
let wholeData = null;
let currData = null;

const app = document.getElementById('app');

const dataSort = document.getElementById("data-sort");

dataSort.addEventListener("change", async (event) => {
  console.log("Data Sort Change");
  console.log(event.target.value);

  currSort = event.target.value;
  
  const data = currData;
  sortData(data, currSort);
  await renderUI(data);
})

function sortData(data, key) {
  data = data.sort((a, b) => {
    if (key === "name") {
      return a.fullName > b.fullName ? 1 : -1 ;
    } 
    else if(key === "country") {
      return a.birthCountry > b.birthCountry ? 1 : -1;
    }
    else if (key === "age") {
      return a.age > b.age ? 1 : -1 ;
    }
    else if (key === "year") {
      return parseInt(a.year) > parseInt(b.year) ? 1 : -1 ;
    }
    else if (key === "curr worth") {
      return parseInt(a.worth) > parseInt(b.worth) ? 1 : -1 ;
    }
  })
}

// runs the code that activates all different kinds of filters.
// if there is a new filter in the code, *this is where* we make sure that it runs.
function activateAllFilters() {
  const data = wholeData;
  sortData(data, currSort);
  const filteredData = filterGenderData(filterCategoryData(data, currCategoryFilter), currGenderFilter);
  currData = filteredData;
  return filteredData;
}

const categoryFilter = document.getElementById("category-filter");

categoryFilter.addEventListener("change", async (event) => {
  console.log("Category Filter Change");
  console.log(event.target.value);

  currCategoryFilter = event.target.value;
  await renderUI(activateAllFilters());
})

const genderFilter = document.getElementById("gender-filter");

genderFilter.addEventListener("change", async (event) => {
  console.log("Gender filter change");
  console.log(event.target.value);

  currGenderFilter = event.target.value;
  await renderUI(activateAllFilters());
})

function filterCategoryData(data, key) {
  console.log("filter data just in");
  data = data.filter((laureate) => {
    if (key === "---") {
      return laureate;
    }
    else {
      return key === laureate.category;
    }
  });
  return data;
}

function filterGenderData(data, key) {
  console.log("filter data just in");
  data = data.filter((laureate) => {
    if (key === "---") {
      return laureate;
    }
    else {
      return key === laureate.gender;
    }
  });
  return data;
}

// a helper function that fetches data from a given endpoint
async function queryEndpoint(endpoint) {
  let data = null
  try {
      const response = await fetch(endpoint);
      if (response.ok) {
          data = await response.json();
      }
  } catch(error) {
      console.log("oh no! an API FETCHING error? not again..");
      console.error(error);
  }
  return data;
}

function checkCountry(item) {
  let country = null;
     try {
      country = item.birth.place.country.en;
     } catch(error) {
      country = "unknown";
     }
     return country
}

function extractData(rawData) {
  const semplifiedData = [];
  for (const item of rawData) {
    semplifiedData.push({
    fullName : item.fullName.en,
    gender : item.gender,
    birthCountry : checkCountry(item),
    category : item.nobelPrizes[0].category.en,
    year : item.nobelPrizes[0].awardYear,
    worth : item.nobelPrizes[0].prizeAmountAdjusted,
    reason : item.nobelPrizes[0].motivation.en
    })
  }
  return semplifiedData;
}

async function getData() {
  const laureatesData = await queryEndpoint(API_LAUREATES);
  const semplifiedData = extractData(laureatesData.laureates);
  wholeData = semplifiedData;
  currData = semplifiedData;
  return semplifiedData;
}

function clearUI() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}

async function renderUI(data) {
  console.log("data");
  console.log(data);
  console.log("DONE. data");
  clearUI();

  const cardTemplate = document.getElementById("card-template"); 

  for (const laureate of data) {

    const recordClone = cardTemplate.content.firstElementChild.cloneNode(true);

    const laureateName = recordClone.querySelector("h2");
    const gender = recordClone.querySelector("img");
    const year = recordClone.querySelector("h3");
    const category = recordClone.querySelector("h4");
    const reason = recordClone.querySelector("p");

    laureateName.innerHTML = laureate.fullName;
    gender.src = `${laureate.gender}.png`;
    year.innerHTML = laureate.year;
    category.innerHTML = laureate.category;
    reason.innerHTML = laureate.reason;

    app.appendChild(recordClone);
  }
}

const data = await getData();

await renderUI(data);
