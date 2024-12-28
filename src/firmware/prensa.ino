#include <Wire.h> //Biblioteca para gerenciar as entradas I2C(para o Display LCD)
#include <WiFi.h> //Biblioteca para o uso do Wifi com o ESP32
#include <ArduinoJson.h> //Biblioteca para a criação de arquivos .JSON
#include <PubSubClient.h> //Bilioteca para a criação de Publishes e Subscribes de tópicos MQTT em um Broker
#include <WiFiClientSecure.h> //Biblioteca para a conexão segura ao Wifi
#include <LiquidCrystal_I2C.h> //Biblioteca para o uso do Display LCD
#include "Button.h" //Arquivo contendo a classe botão para o Debouncing por software dele
#include "Certificate.h" //Arquivo contendo o certificado do Broker
#include "System.h" //Arquivo contendo a classe que controla a maioria das coisas

static SystemState state; //Definendo "state" como objeto da classe do sistema
LiquidCrystal_I2C lcd(0x27, 16, 2); //Definendoi o Display LCD na classe de sua biblioteca
WiFiClientSecure espClient; 
PubSubClient client(espClient); 

//Função para alternar entre as cores do Led RGB 
void RGBColor(bool red, bool green, bool blue) {
    digitalWrite(state.getLedRedPin(),   red); //Alterna o Vermelho
    digitalWrite(state.getLedVerdePin(), green);//Alterna o Verde
    digitalWrite(state.getLedAzulPin(),  blue);//Alterna o Amarelo
}

//Função para iniciar o Wifi
void setup_wifi() {
    Serial.print("Conectando a ");
    Serial.println(state.getSSID()); //Permite ver em qual rede Wifi o ESP32 se conectou
    WiFi.mode(WIFI_STA); //Configurando o modo do Wifi
    WiFi.begin(state.getSSID(), state.getPassword()); //Se conecta ao Wifi

    while (WiFi.status() != WL_CONNECTED) { //Enquanto não conectado ao wifi imprima um ponto e tente novamente
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi conectado. Endereço IP: ");
    Serial.println(WiFi.localIP()); //Indica que o ESP32 se conectou com sucesso ao Wifi
}

//Função para publicar tópicos MQTT
void publishMessage(const char* topic, const String &payload, boolean retained) {
    if (client.publish(topic, payload.c_str(), retained)) {//Publica o tópico com o payload que é montado mais embaixo no código
        Serial.println("Mensagem publicada [" + String(topic) + "]: " + payload);//Indicação de que a publicação ocorreu com sucesso
    }
}

//Função para medir distância com validação
void measureDistance() {
    //Inicializando o sensor
    digitalWrite(state.getTrigPin(), LOW);
    delayMicroseconds(2);
    digitalWrite(state.getTrigPin(), HIGH);
    delayMicroseconds(10);
    digitalWrite(state.getTrigPin(), LOW);

    unsigned long duration = pulseIn(state.getEchoPin(), HIGH, 20000); //Pega o tempo que demora para uma onda sonora sair do sensor, bater em algo e retornar à ele
    float distance_Prev = state.getDistancePrev(); //Distância previamente medida

    if (duration == 0) {//Caso o pulso devolvido pelo sensor seja 0, o sensor está com algum problema e o sistema necessita de ajuda
        Serial.println("Nenhum pulso recebido. Usando valor anterior.");
       
        //Cria indicações visuais do problema
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Falha no Sensor!");

        RGBColor(HIGH, LOW, LOW);

        while(1){};
    }

    float measuredDistance = duration * state.getSoundSpeed() / 2;//Transforma o tempo entre o objeto e o sensor em distância
    if (measuredDistance >= 2 && measuredDistance <= 400) {//Os limites do sensor são distâncias abaixo de 2 e acima de 400cm, então no caso dessas medições o sistema será interrompido com falha no sensor
      state.setDistance(measuredDistance);//Define a distãncia como essa medida
    } else {
        //Indicação visual do problema
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Falha no Sensor!");

        RGBColor(HIGH, LOW, LOW);

        while(1){};
    }
}

//Função de SETUP do ESP32
void setup() {
    Serial.begin(115200);//Iniciando o Serial Monitor
    Serial.println("Iniciando Programa...");
    
    //Indicação visual de que o ESP32 está em SETUP
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Iniciando...");
    delay(1000);

    //Definendo os pinos conectados ao ESP32 como INPUT e OUTPUT
    pinMode(state.getTrigPin(), OUTPUT);
    pinMode(state.getEchoPin(), INPUT);
    pinMode(state.getLedRedPin(), OUTPUT);
    pinMode(state.getLedVerdePin(), OUTPUT);
    pinMode(state.getLedAzulPin(), OUTPUT);
    pinMode(state.getLedFalhaPin(), OUTPUT);
    pinMode(state.getBuzzerPin(), OUTPUT);

    setup_wifi();//Inicia a função para o setup do Wifi
    espClient.setCACert(root_ca);
    client.setServer(state.getMqttServer(), state.getMqttPort());//Configurando para conectar ao Broker
}

//Função de loop do ESP32
void loop() {    
    if (WiFi.status() != WL_CONNECTED) { //Caso o ESP32 não esteja conectado ao Wifi, tente novamente
      setup_wifi();//Tenta fazer o setup do Wifi novamente em caso de desconexão 
    }
    
    if (!client.connected()) {//Caso o ESP32 não esteja conectado no Broker, tente novamente
      String(clientId) = "ESP32Client-" + String(random(0xffff), HEX);
      if (client.connect(clientId.c_str(), state.getMqttUser(), state.getMqttPass())) {
          Serial.println("Conectado ao broker MQTT");//Indicação de que ele se conectou com sucesso
      }
    }
    
    client.loop();
    state.getButton().update();//Atualiza o estado do botão
    
    if (state.getButton().wasClicked()) {//Caso o botão seja apertado reinicie as váriaveis de trabalho e tempo
      state.setInicioDoTrabalho(true);//Define que a prensa ainda vai começar a se mover
      state.setTrabalhoAtivo(false);//Define que a prensa não está ativamente trabalhando ainda

      state.resetTempoTotal();//Zera o tempo total de funcionamento da prensa
    }

    state.setSensor(state.getTouch());//Confere se o interruptor está ligado ou não, assim ligando ou não os sensores

    if (state.isSensorActivated()) {//Caso os sensores estiverem ligados
        unsigned long currentMillis = millis();//Define váriavel do momento atual
        RGBColor(LOW,HIGH,LOW);//Liga o LedRGB para verde indicando visualmente de que tudo está funcionando

        //Medir distância em intervalos
        if (currentMillis - state.getPreviousSensorMillis() >= state.getSensorInterval()) {
            measureDistance();//Medir a distância atual detectada pelo sensor
            
            if (std::abs(state.getDistance() - state.getDistancePrev()) > 0.1 && !state.getTrabalhoAtivo() && state.getInicioDoTrabalho()) {//Caso a distância atual seja diferente da prévia com uma margem de 0,1cm, a prensa não esteja atualmente em trabalho e seja o início do movimento da prensa,
              state.setMovementStart();//Define o horário em que a prensa começou a se mover
              state.setInicioDoTrabalho(false);//Define que a prensa já começou a se mover
              state.setTrabalhoAtivo(true);//Define quea prensa está ativamente se movendo
            }else if(std::abs(state.getDistance() - state.getDistancePrev()) <= 0.1 && state.getTrabalhoAtivo()){ //Caso a prensa tenha parado de se mover e ela estava em movimento antes,
              state.setOilQuality(); //Define a qualidade de Óleo
              state.setInicioDoTrabalho(true);//Define que o próximo movimento vai ser o início
              state.setTrabalhoAtivo(false);//Define que a prensa não está mais se movendo
            }
            
            state.setPreviousSensorMillis(currentMillis);//Atualiza o timer entre medições
            state.setDistancePrev();//Atualiza a distância prévia      

            //Mostra as stats da prensa tanto no Serial Monitor quanto pelo LCD
            Serial.print("Distância(cm): ");
            Serial.println(state.getDistance());
            Serial.print("Qualidade do Óleo: ");
            Serial.println(state.getOilQuality());
            
            lcd.clear();
            lcd.backlight();
            lcd.setCursor(0, 0);
            lcd.print("Dist(cm): ");
            lcd.print(state.getDistance());

            lcd.setCursor(0, 1);
            lcd.print("OilQual: ");
            lcd.print(state.getOilQuality());
            lcd.print("%");

            // Alterar cor do LED com base na qualidade do Óleo
            digitalWrite(state.getLedFalhaPin(), state.getOilQuality() <= 5);//Caso a qualidade do Óleo for menor que 5%, então ele liga o led de aviso de troca de óleo
            state.setBuzzer(state.getOilQuality() <= 5);//Caso a qualidade do Óleo for menor que 5%, o Buzzer liga
        }


        //Publicar dados no MQTT em intervalos
        if (currentMillis - state.getPreviousPublishMillis() >= state.getPublishInterval()) {
            state.setPreviousPublishMillis(currentMillis);//Atualiza o timer entre publicações

            //Monta o arquivo .JSON
            DynamicJsonDocument doc(1024);
            doc["id"] = 3;
            doc["distance"] = state.getDistance();
            doc["oil_quality"] = state.getOilQuality();
            doc["millis"] = millis();
            doc["machineType"] = "Prensa";

            String mqtt_message;
            serializeJson(doc, mqtt_message);
            publishMessage("prensa", mqtt_message, true);//Publica no tópico "prensa"
        }
    } else {//Caso os sensores estiverem desligados,
        //Indicações visuais do modo interrompido do sistema
        RGBColor(LOW, LOW, HIGH);
        state.setBuzzer(LOW);

        lcd.clear();
        lcd.backlight();
        lcd.setCursor(0, 0);
        lcd.print("Interrompido");
    }
}
