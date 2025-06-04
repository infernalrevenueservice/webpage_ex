#include <M5StickCPlus.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>
#include <FS.h>

// Access Point credentials
const char* ssid = "secret evil wifi";
const char* password = "evil password";

// Create WebServer object on port 80
WebServer server(80);

// Function declarations
void handleRoot();
void handleFileRead(String path);
void handleNotFound();
void handleNo();
void press();
void noPress();  
void handlePress();
void restoreNormalDisplay();
String getContentType(String filename);

void handleRoot() {
    handleFileRead("/index.html");
}

void handleFileRead(String path) {
    if (path.endsWith("/")) path += "index.html";
    
    String contentType = getContentType(path);
    
    if (SPIFFS.exists(path)) {
        File file = SPIFFS.open(path, "r");
        server.streamFile(file, contentType);
        file.close();
    } else {
        server.send(404, "text/plain", "File Not Found: " + path);
    }
}

void handleNotFound() {
    String path = server.uri();
    handleFileRead(path);
}

String getContentType(String filename) {
    if (filename.endsWith(".html")) return "text/html";
    else if (filename.endsWith(".css")) return "text/css";
    else if (filename.endsWith(".js")) return "application/javascript";
    else if (filename.endsWith(".png")) return "image/png";
    else if (filename.endsWith(".jpg")) return "image/jpeg";
    else if (filename.endsWith(".gif")) return "image/gif";
    else if (filename.endsWith(".ico")) return "image/x-icon";
    return "text/plain";
}

void press() {
    M5.Lcd.fillScreen(WHITE);
    
    for (int i = 0; i < 3; i++) {
        M5.Lcd.fillScreen(PINK);
        delay(500);
        M5.Lcd.fillScreen(TFT_MAGENTA);
        delay(500);
        M5.Lcd.fillScreen(PURPLE);
        delay(500);
    }
    
    M5.Lcd.fillScreen(TFT_BLUE);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("good job fremd ^-^ !!!");
    
    delay(2000);
    restoreNormalDisplay();
}

void noPress() {
    M5.Lcd.fillScreen(BLACK);
    
    for (int i = 0; i < 3; i++) { 
        M5.Lcd.fillScreen(WHITE);
        delay(200);
        M5.Lcd.fillScreen(BLACK);
        delay(200);
        M5.Lcd.fillScreen(RED);
        delay(200);
    }
    
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextColor(RED);
    M5.Lcd.setTextSize(2);
    M5.Lcd.setCursor(20, 40);
    M5.Lcd.println("what the heck man >:C");
    
    delay(2000);
    restoreNormalDisplay();
}


void restoreNormalDisplay() {
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(1);
    
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.println("WiFi AP Active");
    M5.Lcd.setCursor(0, 25);
    M5.Lcd.print("SSID: ");
    M5.Lcd.println(ssid);
    M5.Lcd.setCursor(0, 40);
    M5.Lcd.print("Pass: ");
    M5.Lcd.println(password);
    M5.Lcd.setCursor(0, 55);
    M5.Lcd.print("IP: ");
    M5.Lcd.println(WiFi.softAPIP());
    M5.Lcd.setCursor(0, 70);
    M5.Lcd.println("Server: Ready");
}

void handleNo() {
    noPress();
    server.send(200, "text/plain", "you little rebel (ง'̀-'́)ง");
}

void handlePress() {
    press();
    server.send(200, "text/plain", "yayyy (⚈∇⚈ )");
}

void setup() {
    M5.begin();
    
    M5.Lcd.setRotation(1);
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(1);
    
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.println("Starting...");
    
    // Initialize SPIFFS
    if (!SPIFFS.begin(true)) {
        Serial.println("An Error has occurred while mounting SPIFFS");
        M5.Lcd.println("SPIFFS Error!");
        return;
    }
    
    // List files for debugging
    Serial.println("SPIFFS files:");
    File root = SPIFFS.open("/");
    File file = root.openNextFile();
    while (file) {
        Serial.print("  ");
        Serial.println(file.name());
        file = root.openNextFile();
    }
    
    WiFi.mode(WIFI_AP);
    WiFi.softAP(ssid, password);
    
    IPAddress IP = WiFi.softAPIP();
    
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setCursor(0, 10);
    M5.Lcd.println("WiFi AP Active");
    M5.Lcd.setCursor(0, 25);
    M5.Lcd.print("SSID: ");
    M5.Lcd.println(ssid);
    M5.Lcd.setCursor(0, 40);
    M5.Lcd.print("Pass: ");
    M5.Lcd.println(password);
    M5.Lcd.setCursor(0, 55);
    M5.Lcd.print("IP: ");
    M5.Lcd.println(IP);
    M5.Lcd.setCursor(0, 70);
    M5.Lcd.println("Server: Ready");
    
    // Set up web server routes
    server.on("/", handleRoot);
    server.on("/noPress", handleNo);
    server.on("/press", handlePress);
    server.onNotFound(handleNotFound);
    
    server.begin();
    
    Serial.begin(115200);
    Serial.println("M5StickC Plus Access Point Started");
    Serial.print("SSID: ");
    Serial.println(ssid);
    Serial.print("Password: ");
    Serial.println(password);
    Serial.print("IP Address: ");
    Serial.println(IP);
    Serial.println("Web server started on port 80");
}

void loop() {
    server.handleClient();
    M5.update();
    
    static unsigned long lastUpdate = 0;
    if (millis() - lastUpdate > 5000) {
        int clients = WiFi.softAPgetStationNum();
        M5.Lcd.fillRect(0, 85, 240, 15, BLACK);
        M5.Lcd.setCursor(0, 85);
        M5.Lcd.print("Clients: ");
        M5.Lcd.println(clients);
        lastUpdate = millis();
    }
    
    delay(10);
}