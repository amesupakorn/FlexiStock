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
    # แปลงข้อมูลจาก List of OrderData ให้เป็น DataFrame
    df = pd.DataFrame([d.dict() for d in data])
    
    # แปลงวันที่ (ds) เป็น datetime
    df["ds"] = pd.to_datetime(df["ds"])

    # สร้าง dictionary เพื่อเก็บผลลัพธ์การพยากรณ์
    result_by_pair = {}

    # กลุ่มข้อมูลตาม warehouse_id และ product_id
    for (warehouse_id, product_id), group in df.groupby(["warehouse_id", "product_id"]):
        group = group.dropna()  # ลบข้อมูลที่มี NaN
        if len(group) < 2:  # ถ้ามีข้อมูลน้อยเกินไป ก็ข้ามการพยากรณ์
            print(f"⚠️ Not enough data for {warehouse_id}-{product_id}")
            continue

        # ตั้งค่าโมเดล Prophet
        model = Prophet()
        model.fit(group[["ds", "y"]])  # ใช้คอลัมน์ 'ds' และ 'y' ในการฝึกโมเดล

        # สร้างข้อมูลในอนาคต
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)
        
        # เก็บผลลัพธ์จากการทำนาย
        result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(30)  # ใช้แค่ 30 วันที่สุดท้าย
        result["warehouse_id"] = warehouse_id
        result["product_id"] = product_id

        key = f"{warehouse_id}-{product_id}"
        result_by_pair[key] = result.to_dict(orient="records")

    # คืนค่าผลลัพธ์การพยากรณ์ในรูปแบบ JSON
    return result_by_pair