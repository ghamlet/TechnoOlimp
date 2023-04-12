

const char* ssid = "iPhone Vladimir";
const char* password = "12345609";
byte tries = 10;  // Попыткок подключения к точке доступа

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (--tries && WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Non Connecting to WiFi..");
  }
  else
  {
  
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }
}
