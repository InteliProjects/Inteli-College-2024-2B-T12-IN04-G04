from fastapi import FastAPI
from sqlalchemy import create_engine, select, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, connect_args={"options": "-csearch_path=public"})

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class PrensaRunning(Base):
    __tablename__ = 'PrensaRunnings'  # Adjust table name if different

    RunningId = Column(Integer, primary_key=True, index=True)
    TimeStamp = Column(DateTime, nullable=False)
    PrensaId = Column(Integer, nullable=False)
    DistanceTraveled = Column(Float, nullable=False)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/prensa")
def get_prensa():
    with engine.connect() as connection:
        result = connection.execute(select(
            PrensaRunning.RunningId,
            PrensaRunning.TimeStamp,
            PrensaRunning.PrensaId,
            PrensaRunning.DistanceTraveled
        )).all()
    return {
        "PrensaRunnings": [
            {
                "RunningId": row.RunningId,
                "TimeStamp": row.TimeStamp.isoformat(),
                "PrensaId": row.PrensaId,
                "DistanceTraveled": row.DistanceTraveled
            }
            for row in result
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
