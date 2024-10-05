# Temp_Arduino_be

Projekt beskrivning:

Detta projekt skickar sensor data från ett Arduino R4 kort över wifi och denna hanteras sedan med en java backend.
Frontenden är byggd med Node.js och vi använder MongoDb som databas för att spara sensor data.
Syftet med projektet är att samla in data (just nu med en intervall på 15 minuter) och sedan hantera datan och visa statistik.

Backend:
	*Java 21
	*Spring

	dependencies:
		* spring dev tools
		* spring web
		* spring data mongodb

Frontend:
	* vite
	* Node.js med npm
	* javascript

Arduino:
	* model - R4
	* sensor - Dht11 temp/humidty sensor
