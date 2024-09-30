import './style.css'


let main = document.getElementById('app');
let listDiv = document.createElement('div');
listDiv.id = 'listContainer';
let listUl = document.createElement('ul');
listUl.id = 'listUl';
let headerDiv = document.createElement('div');
headerDiv.id = 'headerContainer';

let latestInputBtn = document.createElement('button');
latestInputBtn.textContent = 'Latest entry';
let statisticsBtn = document.createElement('button');
statisticsBtn.textContent = 'Statistics';
let refreshBtn = document.createElement('button');
refreshBtn.textContent = 'Refresh';
let headerDivH1 = document.createElement('h1');
headerDivH1.textContent = 'DHT11 Sensor Data';

let sensorData = [];

main.appendChild(headerDiv);
headerDiv.appendChild(headerDivH1);
headerDiv.appendChild(latestInputBtn);
headerDiv.appendChild(statisticsBtn);
// headerDiv.appendChild(refreshBtn); 

latestInputBtn.addEventListener('click', showLatestDht11Input);
statisticsBtn.addEventListener('click', printDht11SensorData);
refreshBtn.addEventListener('click', printDht11SensorData);


main.appendChild(listDiv);
listDiv.appendChild(listUl);

function printDht11SensorData() {
  listUl.innerHTML = "";
  
  fetch(`https://orca-app-il7tk.ondigitalocean.app/get-all-dht11-sensor-data`)
   .then(response => response.json())
   .then(data => {

    console.log(data);
    sensorData = data;

    data.forEach(singleReading => {
      let listItem = document.createElement('li');
      console.log(singleReading);
      
      let timeStampString = singleReading.timeStamp.toString();
      let date = timeStampString.substring(0, 10);
      let time = timeStampString.substring(11, 16);
      
      listItem.innerHTML = `Date: ${date} | Time: ${time} | Temperature: ${singleReading.celsius}°C | Humidity: ${singleReading.humidity}%`;
      listUl.appendChild(listItem);
    });
   });  
   
  }

  // function refreshDatabase() {
  //   setInterval(() => {
  //     printDht11SensorData();
  //   }, 60000); 
  // }

  

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

  // refreshDatabase();

  printDht11SensorData();
  



