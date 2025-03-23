from fastapi import FastAPI
from pydantic import BaseModel
from prophet import Prophet
import pandas as pd
from typing import List

app = FastAPI()

class DataPoint(BaseModel):
    ds: str  # datetime in string format
    y: float

@app.post("/forecast")
def forecast(data: List[DataPoint]):
    df = pd.DataFrame([d.dict() for d in data])
    model = Prophet()
    model.fit(df)
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30)
    return result.to_dict(orient="records")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}