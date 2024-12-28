-- CreateTable
CREATE TABLE "CompressorRunnings" (
    "RunningId" SERIAL NOT NULL,
    "CompressorId" INTEGER NOT NULL,
    "Temperature" DOUBLE PRECISION,
    "Vibration" DOUBLE PRECISION,
    "TimeStamp" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_CompressorRunnings" PRIMARY KEY ("RunningId")
);

-- CreateTable
CREATE TABLE "Compressors" (
    "Id" SERIAL NOT NULL,
    "NumberOfFailures" INTEGER,
    "MaximumTemperature" DOUBLE PRECISION,
    "MaximumVibration" DOUBLE PRECISION,
    "LastMaintenance" TIMESTAMPTZ(6),
    "OperatingTime" DOUBLE PRECISION,
    "OilQuality" TEXT,

    CONSTRAINT "PK_Compressors" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PrensaRunnings" (
    "RunningId" SERIAL NOT NULL,
    "PrensaId" INTEGER NOT NULL,
    "DistanceTraveled" DOUBLE PRECISION,
    "TimeStamp" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_PrensaRunnings" PRIMARY KEY ("RunningId")
);

-- CreateTable
CREATE TABLE "Prensas" (
    "Id" SERIAL NOT NULL,
    "NumberOfFailures" INTEGER,
    "MaximumDistance" DOUBLE PRECISION,
    "LastMaintenance" TIMESTAMPTZ(6),
    "OperatingTime" DOUBLE PRECISION,
    "OilQuality" TEXT,
    "Status" INTEGER,

    CONSTRAINT "PK_Prensas" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" VARCHAR(150) NOT NULL,
    "ProductVersion" VARCHAR(32) NOT NULL,

    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- CreateTable
CREATE TABLE "Distance" (
    "id_Running" BIGINT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "distance" REAL NOT NULL,
    "Id" BIGSERIAL NOT NULL,

    CONSTRAINT "PK_Distance" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Machines" (
    "id" BIGINT NOT NULL,
    "needFix" BOOLEAN NOT NULL,
    "maxTemperature" REAL,
    "maxVibration" REAL,
    "oil_quality" REAL NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" BIGINT NOT NULL DEFAULT 0,
    "maxDistanceTraveled" REAL,

    CONSTRAINT "PK_Machines" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runnings" (
    "id" BIGSERIAL NOT NULL,
    "id_Machine" BIGINT NOT NULL,
    "typeError" TEXT,
    "meanTemperature" REAL,
    "meanVibration" REAL,
    "start_timestamp" TIMESTAMPTZ(6) NOT NULL,
    "end_timestamp" TIMESTAMPTZ(6),
    "distanceTraveled" REAL,

    CONSTRAINT "PK_Runnings" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temperature" (
    "id_Running" BIGINT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "temperature" REAL NOT NULL,
    "Id" BIGSERIAL NOT NULL,

    CONSTRAINT "PK_Temperature" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Vibration" (
    "id_Running" BIGINT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "vibration" REAL NOT NULL,
    "Id" BIGSERIAL NOT NULL,

    CONSTRAINT "PK_Vibration" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "IX_CompressorRunnings_CompressorId" ON "CompressorRunnings"("CompressorId");

-- CreateIndex
CREATE INDEX "IX_PrensaRunnings_PrensaId" ON "PrensaRunnings"("PrensaId");

-- CreateIndex
CREATE INDEX "IX_Distance_id_Running" ON "Distance"("id_Running");

-- CreateIndex
CREATE INDEX "IX_Runnings_id_Machine" ON "Runnings"("id_Machine");

-- CreateIndex
CREATE INDEX "IX_Temperature_id_Running" ON "Temperature"("id_Running");

-- CreateIndex
CREATE INDEX "IX_Vibration_id_Running" ON "Vibration"("id_Running");

-- AddForeignKey
ALTER TABLE "CompressorRunnings" ADD CONSTRAINT "FK_CompressorRunnings_Compressors_CompressorId" FOREIGN KEY ("CompressorId") REFERENCES "Compressors"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PrensaRunnings" ADD CONSTRAINT "FK_PrensaRunnings_Prensas_PrensaId" FOREIGN KEY ("PrensaId") REFERENCES "Prensas"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Distance" ADD CONSTRAINT "FK_Distance_Runnings_id_Running" FOREIGN KEY ("id_Running") REFERENCES "Runnings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Runnings" ADD CONSTRAINT "FK_Runnings_Machines_id_Machine" FOREIGN KEY ("id_Machine") REFERENCES "Machines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "FK_Temperature_Runnings_id_Running" FOREIGN KEY ("id_Running") REFERENCES "Runnings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vibration" ADD CONSTRAINT "FK_Vibration_Runnings_id_Running" FOREIGN KEY ("id_Running") REFERENCES "Runnings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
