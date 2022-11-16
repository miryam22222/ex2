//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

const API_BASE = 'https://api.nobelprize.org/2.1';
const API_LAUREATES = `${API_BASE}/laureates`;
let currSort = "name";
let currFilter = "---";
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

const dataFilter = document.getElementById("data-filter");

dataFilter.addEventListener("change", async (event) => {
  console.log("Data Filter Change");
  console.log(event.target.value);

  currFilter = event.target.value;

  const data = wholeData;
  sortData(data, currSort);
  const filteredData = filterData(data, currFilter);
  currData = filteredData;
  await renderUI(filteredData);
})

function filterData(data, key) {
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

// change function to calculate actual age based on the date the award was given
function ageOfWinning(birthDateString, winningDateString) {
  const birthDate = new Date(birthDateString);
  const winningDate = new Date(winningDateString);
  const diff = winningDate - birthDate;
  const age = new Date(winningDate - birthDate).getFullYear() - 1970;
  console.log("age");
  console.log(diff);
  console.log("DONE. age");
  return age;
}

function extractData(rawData) {
  const semplifiedData = [];

  for (const item of rawData) {
    let country = null;
     try {
      country = item.birth.place.country.en;
     } catch(error) {
      country = "unknown";
     }

     semplifiedData.push({
      fullName : item.fullName.en,
      gender : item.gender,
      birthCountry : country,
      category : item.nobelPrizes[0].category.en,
      year : item.nobelPrizes[0].awardYear,
      age : ageOfWinning(item.birth.date, item.nobelPrizes[0].dateAwarded),
      worth : item.nobelPrizes[0].prizeAmountAdjusted
     })
  }
  return semplifiedData;
}

async function getData() {
  // write you logic for getting the data from the API here
  // return your data from this function
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

  const slideTemplate = document.getElementById("info-slide-template"); 

  for (const laureate of data) {

    const recordClone = slideTemplate.content.firstElementChild.cloneNode(true);

    const laureateName = recordClone.querySelector("h2");
    const gender = recordClone.querySelector("img");
    const year = recordClone.querySelector("h3");
    const category = recordClone.querySelector("h4");

    laureateName.innerHTML = laureate.fullName;
    gender.src = `${laureate.gender}.png`;
    year.innerHTML = laureate.year;
    category.innerHTML = laureate.category;

    app.appendChild(recordClone);
  }


  // you have your data! add logic here to render it to the UI
  // notice in the HTML file we call render();
  // const dummyItemElement = Object.assign(document.createElement("div"), { className: "item" })
  // const dummyContentElement = Object.assign(document.createElement("div"), { className: "content" })
  // dummyContentElement.innerHTML = "hey";
  // dummyItemElement.appendChild(dummyContentElement);
  // app.appendChild(dummyItemElement);
}

const data = await getData();

await renderUI(data);
