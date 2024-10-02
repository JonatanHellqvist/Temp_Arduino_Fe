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
headerDivH1.id = 'headerContainerH1';
headerDivH1.textContent = 'Temperature/humidity Tracker';
let headerDivH2 = document.createElement('h2');
headerDivH2.id = 'headerContainerH2';
headerDivH2.textContent = 'Sensor: DHT11';
let headerTextDiv = document.createElement('div');
headerTextDiv.id = 'headerTextContainer';

let navBar = document.createElement('div');
let buttonsDiv = document.createElement('div');
buttonsDiv.id = 'buttonsContainer';

navBar.id = 'navBar';
let sensorData = [];
let selectedSortingMode = "";

 //om det behövs för css
    // let latestEntryDiv = document.createElement('div'); 
    // latestEntryDiv.id = 'latestEntryContainer';
    let latestEntryBtn = document.createElement('button');
    latestEntryBtn.id = 'latestEntry';
    latestEntryBtn.textContent = "Show latest entry";
    // latestEntryDiv.appendChild(latestEntryBtn);
    latestEntryBtn.addEventListener("click", showLatestDht11Input);

    headerTextDiv.appendChild(headerDivH1);
    headerTextDiv.appendChild(headerDivH2);
    headerDiv.appendChild(headerTextDiv);
    main.appendChild(headerDiv);
    
// headerDiv.appendChild(headerDivH1);
// headerDiv.appendChild(headerDivH2);
// headerDiv.appendChild(latestInputBtn);

// navBar.appendChild(statisticsBtn);
// navBar.appendChild(latestEntryBtn);

buttonsDiv.appendChild(statisticsBtn);
buttonsDiv.appendChild(latestEntryBtn);
navBar.appendChild(buttonsDiv);
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
  console.log(selectedSortingMode);
  
  let listH1 = document.createElement("h1");
  listH1.id = "listH1";
  listH1.innerText = `All Sensor Data For: ${selectedSortingMode}`
  listUl.appendChild(listH1);

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
    })
    //sortera efter senaste först
    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
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
  })
  //sortera efter senaste först
  .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)); 
  
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
  })
  //sortera efter senaste först
  .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)); 
}

  function handleStatisticsClick() {
    listUl.innerHTML = ""; 

    selectedSortingMode = "Today";
    // printDht11SensorData(filterTodayDht11Data(selectedSortingMode)); <- Om man vill visa all data istället vid klick på statisticBTMN
    printSelectedModeStats(printDht11SensorData(filterTodayDht11Data(selectedSortingMode)));
    
    let selectionDiv = document.createElement('div');
    selectionDiv.id = 'selectionContainer';

    let sortingModeLabel = document.createElement('label');
    sortingModeLabel.textContent = "Sorting Mode: ";
    sortingModeLabel.setAttribute('for', 'dateSelection'); // Koppla label till select
    selectionDiv.appendChild(sortingModeLabel);
    let sortingModeDiv = document.createElement('div');
    sortingModeDiv.id = 'sortingModeContainer';
    
    // selectionDiv.textContent = "Sorting Mode: ";
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
  
    dateSelection.addEventListener('change', () => {
      handleSortChange();
      printSelectedModeStats();
    });
    sortingModeDiv.appendChild(sortingModeLabel);
    sortingModeDiv.appendChild(dateSelection);
    selectionDiv.appendChild(sortingModeDiv);
    // selectionDiv.appendChild(dateSelection);

    let existingSelectionDiv = document.getElementById('selectionContainer');

    if (existingSelectionDiv) {
      navBar.removeChild(existingSelectionDiv);
    }
    
    
   
    
    //om det behövs för css
    // let showAllDataDiv = document.createElement('div');
    // showAllDataDiv.id ='showAllDataContainer';
    let showAllDataBtn = document.createElement('button');
    showAllDataBtn.id = 'showAllData';
    showAllDataBtn.textContent = `Show all data for: ${selectedSortingMode}`;
    showAllDataBtn.addEventListener("click", () => {
      console.log(selectedSortingMode);

      printDht11SensorData(sortByDateDht11SensorData(selectedSortingMode));
    

    });
    // showAllDataDiv.appendChild(showAllDataBtn);

    
    // selectionDiv.appendChild(latestEntryBtn);
    selectionDiv.appendChild(showAllDataBtn);
    navBar.appendChild(selectionDiv);


}

function handleSortChange() {
  const dateSelectionValue = document.getElementById("dateSelection").value;
  const filteredData = sortByDateDht11SensorData(dateSelectionValue); //för att sortera efter valt model

  
  selectedSortingMode = dateSelectionValue; //sätter vilken sorteringsmodell som är vald
  console.log(selectedSortingMode);
  
  const showAllDataBtn = document.getElementById('showAllData');
  if (showAllDataBtn) {
    showAllDataBtn.textContent = `Show all data for: ${selectedSortingMode}`;
  }

  printDht11SensorData(filteredData);
}

//////////////////////////// VALD SORTMODE STATS //////////////////////////
////////////////////////////////TODO///////////////////////////////////////

function printSelectedModeStats() {
  let filteredData = [];

  switch (selectedSortingMode) {
    case "Today":
      filteredData = filterTodayDht11Data();
      break;
    case "Yesterday":
      filteredData = filterYesterdayDht11Data();
      break;
    case "Last 3 days":
      filteredData = filterDht11DataByDays(3);
      break;
    case "Last 7 days":
      filteredData = filterDht11DataByDays(7);
      break;
    case "Last 30 days":
      filteredData = filterDht11DataByDays(30);
      break;
    default:
      console.log("");
      return;
  }
   if (filteredData.length === 0) {
    listUl.innerHTML = "No Data Available";
    return;
  }

  let totalTemp = 0, totalHumidity = 0;
  let maxTemp = Math.max(...filteredData.map(data => data.celsius));
  let minTemp = Math.min(...filteredData.map(data => data.celsius));
  let maxHumidity = Math.max(...filteredData.map(data => data.humidity));
  let minHumidity = Math.min(...filteredData.map(data => data.humidity));

  filteredData.forEach(data => {
    totalTemp += data.celsius;
    totalHumidity += data.humidity;
  });
  let numberOfImputs = filteredData.length;
  let avgTemp = (totalTemp / filteredData.length).toFixed(2);
  let avgHumidity = (totalHumidity / filteredData.length).toFixed(2);

  listUl.innerHTML = `
    <div id="statsH1Container">
    <li><h1 id=statsH1>Statistics for: ${selectedSortingMode}</h1></li>
    </div>
    <div id="averageContainer" class="flexContainer">
    <li>Avg Temp: ${avgTemp}°C</li>
    <li>Avg Humidity: ${avgHumidity}%</li>
    </div>
    <div id="tempContainer" class="flexContainer">
    <li>Highest Temp: ${maxTemp}°C</li>
    <li>Lowest Temp: ${minTemp}°C</li>
    </div>
    <div id="humidityContainer" class="flexContainer">
    <li>Highest Humidity: ${maxHumidity}%</li>
    <li>Lowest Humidity: ${minHumidity}%</li>
    </div>
    <div id="entriesContainer" class="flexContainer">
    <li>Number of entries: ${numberOfImputs}</li>
    </div>
  `;
  
}

//////////////////////////////////////////////////////////////////////////
  
fetchDht11SensorData();


