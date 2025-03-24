from pydantic import BaseModel
from fastapi import FastAPI
from prophet import Prophet
from typing import List, Dict
import pandas as pd

app = FastAPI()

class OrderData(BaseModel):
    ds: str
    y: float
    product_id: str
    warehouse_id: str

@app.post("/forecast")
def forecast(data: List[OrderData]):
    df = pd.DataFrame([d.dict() for d in data])
    df["ds"] = pd.to_datetime(df["ds"])

    result_by_pair = {}

    for (warehouse_id, product_id), group in df.groupby(["warehouse_id", "product_id"]):
        group = group.dropna()
        if len(group) < 2:
            print(f"⚠️ Not enough data for {warehouse_id}-{product_id}")
            continue

        model = Prophet()
        model.fit(group[["ds", "y"]])

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(30)
        result["warehouse_id"] = warehouse_id
        result["product_id"] = product_id

        key = f"{warehouse_id}-{product_id}"
        result_by_pair[key] = result.to_dict(orient="records")

    return result_by_pair