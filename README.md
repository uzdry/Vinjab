<h1> PSE - VINJAB </h1>
<h2> VINJAB Is Not Just A Boardcomputer </h2>

<h3> Einleitung </h3>

<body> Zur Verbesserung des Fahrens besitzen moderne PKWs eine Vielzahl an Sensoren, die praktisch alle für das Führen eines Fahrzeugs relevanten Informationen liefern. Boardcomputer, die mittlerweile serienmäßig in allen modernen Autos verbaut sind, sind für die Darstellung dieser Daten mittlerweile unverzichtbar. Die Verarbeitung dieser Daten ist jedoch zumeist nur rudimentär, die Darstellung nur wenig personalisierbar. Eine weitläufige Speicherung der Daten und deren erneute Darstellung ist zumeist nicht vorgesehen. VINJAB bietet eine Client-Server-basierten Boardcomputerfunktion, die auf beliebigen, über Netzwerk verbundenen Computern wie Laptops, Tablets und Smartphones angezeigt werden kann. Insbesondere bietet VINJAB die Möglichkeit, den Boardcomputer auch aus großer räumlicher Distanz über das Internet anzuzeigen, sowie Fahrtdaten zu analysieren, auszuwerten und in Statistiken anzuzeigen. Als Schnittstelle zum Auto wird der mittlerweile in fast jedem PKW vorhandene OBD2-Anschluss verwendet. VINJAB ist webbasiert, leichtgewichtig, und einfach zu erweitern. Außerdem wird eine API angeboten, die den Zugriff auf Funktionen wie das Verwalten, Speichern und Verteilen von Daten ermöglicht. 

<h3> Installation </h3>

<h4> Raspberry Pi </h4>

Dieses Image kann man auf eine SD-Karte schreiben. <br \>
Diese dann in einen Raspberry Pi 2 einstecken, den Pi mit einem Wifi und einem Bluetooth-Stick ausrüsten und einschalten.<br \>
Der Pi hostet dann ein Netwerk mit der SSID: vinjabPi PW: vinjabPi1123<br \>
Hier der Link : https://drive.google.com/file/d/0B6rhYnaNCrymd0ttS1BCNGdOVU0/view?usp=sharing

<h4> Direkt von Github </h4>

Dependencies:
*libbluetooth-dev
*nodejs
*npm
*bower
*typescript

Nach dem Klonen von diesem Git-Repo:
* Über install.sh installieren
* nach der Installation über start.sh starten
* seien sie sicher, dass sie die vollen Rechte an dem Ordner besitzen.

... Möglicherweise ist: "chown -R -username- ./VINJAB" nötig


</body>
