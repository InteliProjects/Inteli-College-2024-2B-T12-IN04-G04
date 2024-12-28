class SystemState {
public:
    //Construtor
    SystemState()
    : btn(getButtonPin()), //Inicializa o botão com o pino correto
      lcd(0x27, 16, 2),    //Inicializa o display LCD com os parâmetros corretos
      sensorActivated(true), //Váriavel para caso os sensores estejam desligados
      distance(0.0f), //Distância atual entre o sensor e algo
      distance_Prev(0.0f), //Distância prévia do sensor
      previousSensorMillis(0), //Timer entre medições do sensor
      previousPublishMillis(0), //Timer entre publicações
      movementStart(0), //Horário de início do movimento da prensa
      inicioDoTrabalho(true), //Váriavel que diz se o próximo movimento da prensa vai ser o primeiro
      trabalhoAtivo(false), //Váriavel que diz se a prensa estava se movendo antes
      tempoTotal(0.0f), //Tempo total que a prensa passou se movendo
      OilQuality(100.0f) {} //Qualidade do óleo

    static uint8_t getLedRedPin()   { return 33; } //Devolve o pino Vermelho do Led RGB
    static uint8_t getButtonPin()   { return 19; } //Devolve o pino do botão
    static uint8_t getLedVerdePin() { return 25; } //Devolve o pino Verde do Led RGB
    static uint8_t getLedAzulPin()  { return 26; } //Devolve o pino Azul do Led RGB
    static uint8_t getTouchPin()    { return 15; } //Devolve o pino do interruptor
    static uint8_t getLedFalhaPin() { return 32; } //Devolve o pino do Led Vermelho
    static uint8_t getTrigPin()     { return 4; } //Devolve o pino do Trig do HC-SR04
    static uint8_t getEchoPin()     { return 5; } //Devolve o pino do Echo do HC-SR04
    static uint8_t getBuzzerPin()   { return 18; } //Devolve o pino Buzzer

    //Intervalos de tempo
    static unsigned long getSensorInterval()  { return 1000; } //Devolve o intervalo entre medições do sensor 
    static unsigned long getPublishInterval() { return 5000; } //Devolve o intervalo entre publicações

    static float getSoundSpeed() { return 0.034f; } //Velocidade do som em cm/µs

    //Credenciais e configs
    static const char* getSSID()       { return "Insira aqui a rede Wifi"; } //Devolve o ID do Wifi
    static const char* getPassword()   { return "Insira aqui a senha da rede Wifi"; } //Devolve a senha do Wifi
    static const char* getMqttServer() { return "915282f0a4ff4b8faac4c20cbefd5c1c.s1.eu.hivemq.cloud"; } //Devolve o Server do broker
    static const char* getMqttUser()   { return "bemore_broker"; } //Devolve o nome do usuário do broker
    static const char* getMqttPass()   { return "Mbw38NF9CiaNtxf@"; } //Devolve a senha do broker
    static int getMqttPort()           { return 8883; } //Devolve a porta do broker

    //Métodos de acesso ao estado
    bool isSensorActivated() const { return sensorActivated; } //Devolve o estado dos sensores
    void setSensor(bool value) { sensorActivated = value; } //Define o estado dos sensores

    long getMovementStart() { return movementStart; } //Devolve o momento em que a prensa iniciou um movimento
    void setMovementStart() { movementStart = millis(); } //Define o momento que a prensa iniciou um movimento

    float getDistance() const { return distance; } //Devolve a distância do sensor
    float getDistancePrev() const { return distance_Prev; } //Devolve a distância prévia do sensor
    void setDistance(float dist) { distance = dist; } //Define a distância do sensor
    void setDistancePrev() { distance_Prev = getDistance(); } //Define a distância prévia do sensor

    bool getInicioDoTrabalho() { return inicioDoTrabalho; } //Devolve se o movimento é o primeiro da prensa
    void setInicioDoTrabalho(bool valor) { inicioDoTrabalho = valor; } //Define se esse é o primeiro movimento da prensa

    bool getTrabalhoAtivo() { return trabalhoAtivo; } //Devolve se a prensa já estava em movimento antes
    void setTrabalhoAtivo(bool valor) { trabalhoAtivo = valor; } //Define se a prensa vai estar em movimento
    
    void resetTempoTotal() { tempoTotal = 0; } //Devolve o tempo total de funcionamento da prensa

    unsigned long getPreviousSensorMillis() const { return previousSensorMillis; } //Devolve o timer de medições do sensor
    void setPreviousSensorMillis(unsigned long val) { previousSensorMillis = val; } //Define o timer de medições do sensor

    unsigned long getPreviousPublishMillis() const { return previousPublishMillis; } //Devolve o timer de publicações
    void setPreviousPublishMillis(unsigned long val) { previousPublishMillis = val; } //Define o timere de publicações

    Button & getButton() { return btn; }

    void setBuzzer(bool valor){ digitalWrite(getBuzzerPin(), valor); } //Define se o buzzer está ligado ou nãpo

    bool getTouch() {//Define se o interruptor está ligado ou não
        if(touchRead(getTouchPin()) > 30){
            return HIGH;
        } else{
            return LOW;
        }
    }

    float getOilQuality() { return OilQuality; } //Devolve a qualidade de Óleo
    void setOilQuality() {
      float timePassed = millis() - getMovementStart(); //Define o tempo em ms entre o início do movimento da prensa e sua parada
      tempoTotal += timePassed; //Adiciona esse tempo do movimento ao banco total de tempo
      OilQuality = 100 - (tempoTotal/360000000); //Conta para definir quanto da qualidade de óleo foi gastada com o movimento, levando 1000 horas de trabalho como 100%
      if(OilQuality < 0){
        OilQuality = 0.00; //A qualidade de óleo não pode ficar abaixo de zero
      }
    }

private:
    Button btn;
    LiquidCrystal_I2C lcd;

    bool sensorActivated;
    float distance;
    float distance_Prev;
    unsigned long previousSensorMillis;
    unsigned long previousPublishMillis;
    unsigned long movementStart;
    bool inicioDoTrabalho;
    bool trabalhoAtivo;
    long tempoTotal;
    float OilQuality;
};
