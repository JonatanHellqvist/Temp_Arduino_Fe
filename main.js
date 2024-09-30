import './style.css'


let main = document.getElementById('app');
let listDiv = document.createElement('div');
listDiv.id = 'listContainer';
let listUl = document.createElement('ul');
listUl.id = 'listUl';
let headerDiv = document.createElement('div');
headerDiv.id = 'headerContainer';

let statisticsBtn = document.createElement('button');
statisticsBtn.textContent = 'Statistics';
// let latestInputBtn = document.createElement('button');
// latestInputBtn.textContent = 'Latest entry';
// let refreshBtn = document.createElement('button');
// refreshBtn.textContent = 'Refresh';
let headerDivH1 = document.createElement('h1');
headerDivH1.textContent = 'DHT11 Sensor Data';
let navBar = document.createElement('div');
navBar.id = 'navBar';
let sensorData = [];
let selectedSortingMode = "";

main.appendChild(headerDiv);
headerDiv.appendChild(headerDivH1);
// headerDiv.appendChild(latestInputBtn);

navBar.appendChild(statisticsBtn);
headerDiv.appendChild(navBar);

// latestInputBtn.addEventListener('click', showLatestDht11Input);
statisticsBtn.addEventListener('click', handleStatisticsClick);
// refreshBtn.addEventListener('click', printDht11SensorData);

main.appendChild(listDiv);
listDiv.appendChild(listUl);

function fetchDht11SensorData() {
  fetch(`https://orca-app-il7tk.ondigitalocean.app/get-all-dht11-sensor-data`)
    .then(response => response.json())
    .then(data => {
      sensorData = data;
      printDht11SensorData(); 
    });
}

function printDht11SensorData(sensorData) {
  listUl.innerHTML = ""; 
  
  if (!Array.isArray(sensorData) || sensorData.length === 0) {
    listUl.innerHTML = "Ingen data tillgänglig."; 
    return;
  }
  sensorData.forEach(singleReading => {
    let listItem = document.createElement('li');
    let timeStampString = singleReading.timeStamp.toString();
    let date = timeStampString.substring(0, 10);
    let time = timeStampString.substring(11, 16);
    
    listItem.innerHTML = `Date: ${date} | Time: ${time} | Temperature: ${singleReading.celsius}°C | Humidity: ${singleReading.humidity}%`;
    listUl.appendChild(listItem);
  });
}

  function showLatestDht11Input() {
    listUl.innerHTML = "";

    let latestInput = sensorData[sensorData.length - 1]; //senaste avläsning
    let timeStampString = latestInput.timeStamp.toString();
    let date = timeStampString.substring(0, 10);
    let time = timeStampString.substring(11, 16);

    let listItem = document.createElement('li');

    listItem.innerHTML = `Date: ${date} | Time: ${time} | Temperature: ${latestInput.celsius}°C | Humidity: ${latestInput.humidity}%`;
    listUl.appendChild(listItem);
  }

  ////////////////////////////////////////////////////////////
  function sortByDateDht11SensorData(criteria) {
    switch (criteria) {
      case "Today":
        return filterTodayDht11Data(0);
      case "Yesterday":
        return filterYesterdayDht11Data(1);
      case "Last 3 days":
        return filterDht11DataByDays(3);
      case "Last 7 days":
        return filterDht11DataByDays(6);
      case "Last 30 days":
        return filterDht11DataByDays(29);
      default:
        return sensorData; 
    }
  }
  function filterDht11DataByDays(days) {
    const now = new Date();
    
    const dateThresholdEnd = new Date(now);
    dateThresholdEnd.setHours(0, 0, 0, 0); 
    dateThresholdEnd.setDate(dateThresholdEnd.getDate() + 1); 

    const dateThresholdStart = new Date(dateThresholdEnd);
    dateThresholdStart.setDate(dateThresholdStart.getDate() - days); 

    return sensorData.filter(reading => {
        const readingDate = new Date(reading.timeStamp);
        return readingDate >= dateThresholdStart && readingDate < dateThresholdEnd;
    });
}

function filterTodayDht11Data() {
  const now = new Date();

  const dateThresholdEnd = new Date(now);
  dateThresholdEnd.setHours(0, 0, 0, 0); 
  dateThresholdEnd.setDate(dateThresholdEnd.getDate() + 1); 

  const dateThresholdStart = new Date(now);
  dateThresholdStart.setHours(0, 0, 0, 0);

  return sensorData.filter(reading => {
      const readingDate = new Date(reading.timeStamp);
      return readingDate >= dateThresholdStart && readingDate < dateThresholdEnd;
  });
}

function filterYesterdayDht11Data() {
  const now = new Date();

  const dateThresholdEnd = new Date(now);
  dateThresholdEnd.setHours(0, 0, 0, 0); 

  const dateThresholdStart = new Date(dateThresholdEnd);
  dateThresholdStart.setDate(dateThresholdStart.getDate() - 1);

  return sensorData.filter(reading => {
      const readingDate = new Date(reading.timeStamp);
      return readingDate >= dateThresholdStart && readingDate < dateThresholdEnd;
  });
}

  function handleStatisticsClick() {
    listUl.innerHTML = ""; 
    
    printDht11SensorData(filterTodayDht11Data());
    
    let selectionDiv = document.createElement('div');
    selectionDiv.id = 'selectionContainer';
    selectionDiv.textContent = "Sorting Mode: ";
    let dateSelection = document.createElement('select');
    dateSelection.id = 'dateSelection';
  
    dateSelection.innerHTML = `
    <Select>
    <option value="Today">Today</option>
    <option value="Yesterday">Yesterday</option>
    <option value="Last 3 days">Last 3 days</option>
    <option value="Last 7 days">Last 7 days</option>
    <option value="Last 30 days">Last 30 days</option>
    `;
  
    dateSelection.addEventListener('change', handleSortChange);
    selectionDiv.appendChild(dateSelection);

    let existingSelectionDiv = document.getElementById('selectionContainer');

    if (existingSelectionDiv) {
      navBar.removeChild(existingSelectionDiv);
    }
    
    
    //om det behövs för css
    // let latestEntryDiv = document.createElement('div'); 
    // latestEntryDiv.id = 'latestEntryContainer';
    let latestEntryBtn = document.createElement('button');
    latestEntryBtn.id = 'latestEntry';
    latestEntryBtn.textContent = "Show latest entry";
    // latestEntryDiv.appendChild(latestEntryBtn);
    latestEntryBtn.addEventListener("click", showLatestDht11Input);
    
    //om det behövs för css
    // let showAllDataDiv = document.createElement('div');
    // showAllDataDiv.id ='showAllDataContainer';
    let showAllDataBtn = document.createElement('button');
    showAllDataBtn.id = 'showAllData';
    showAllDataBtn.textContent = "Show all data";
    showAllDataBtn.addEventListener("click", () => {
      console.log(selectedSortingMode);

      printDht11SensorData(sortByDateDht11SensorData(selectedSortingMode));
    

    });
    // showAllDataDiv.appendChild(showAllDataBtn);

    
    selectionDiv.appendChild(latestEntryBtn);
    selectionDiv.appendChild(showAllDataBtn);
    navBar.appendChild(selectionDiv);


}

function handleSortChange() {
  const dateSelectionValue = document.getElementById("dateSelection").value;
  const filteredData = sortByDateDht11SensorData(dateSelectionValue); //för att sortera efter valt model

  
  selectedSortingMode = dateSelectionValue; //sätter vilken sorteringsmodell som är vald
  console.log(selectedSortingMode);
  
  
  
  printDht11SensorData(filteredData);
}

//////////////////////////// VALD SORTMODE STATS //////////////////////////
////////////////////////////////TODO///////////////////////////////////////
//Average temp
//Average humidity

//Highest temperature / lowest temperature
// High humidity / lowest humidity
//////////////////////////////////////////////////////////////////////////
  
fetchDht11SensorData();


