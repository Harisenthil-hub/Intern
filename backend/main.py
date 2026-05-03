from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174","http://localhost:5173" "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── PASTE YOUR SUPABASE VALUES HERE ──
SUPABASE_URL="https://ldwjyulvksuxvoqwstnz.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkd2p5dWx2a3N1eHZvcXdzdG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDk3MzMsImV4cCI6MjA5MjM4NTczM30.S1aeIKdXXvI-11CpeETeZ_CZRWbX14SonVpQ8BX6Tls"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


async def supabase_request(method: str, table: str, data: dict = None, filters: str = ""):
    url = f"{SUPABASE_URL}/rest/v1/{table}{filters}"
    async with httpx.AsyncClient() as client:
        if method == "GET":
            response = await client.get(url, headers=HEADERS)
        elif method == "POST":
            response = await client.post(url, headers=HEADERS, json=data)
        elif method == "PATCH":
            response = await client.patch(url, headers=HEADERS, json=data)
        else:
            raise HTTPException(status_code=400, detail="Unsupported method")

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


# ── MODELS ──

class Cylinder(BaseModel):
    serial: str
    gasType: str
    qty: str
    unit: str

class DispatchModel(BaseModel):
    dispatchId: str
    customerName: str
    vehicle: str
    driver: str
    route: str
    date: str
    cylinders: List[Cylinder]
    status: str

class ReturnCylinder(BaseModel):
    serial: str
    condition: str

class ReturnModel(BaseModel):
    returnId: str
    customerName: str
    date: str
    cylinders: List[ReturnCylinder]
    status: str

class TrackerModel(BaseModel):
    serial: str
    location: str
    cylinderStatus: str
    status: str
    date: Optional[str] = None


# ── DISPATCH ──

@app.get("/dispatch")
async def get_dispatches():
    rows = await supabase_request("GET", "dispatches", filters="?order=created_at.desc")
    return [map_dispatch_out(r) for r in rows]

@app.post("/dispatch")
async def create_dispatch(data: DispatchModel):
    rows = await supabase_request("POST", "dispatches", data=map_dispatch_in(data))
    return map_dispatch_out(rows[0])

@app.put("/dispatch/{id}")
async def update_dispatch(id: str, data: DispatchModel):
    rows = await supabase_request("PATCH", "dispatches", data=map_dispatch_in(data), filters=f"?id=eq.{id}")
    return map_dispatch_out(rows[0])

@app.patch("/dispatch/{id}/post")
async def post_dispatch(id: str):
    rows = await supabase_request("PATCH", "dispatches", data={"status": "posted"}, filters=f"?id=eq.{id}")
    return map_dispatch_out(rows[0])

def map_dispatch_in(data: DispatchModel):
    return {
        "dispatch_id": data.dispatchId,
        "customer_name": data.customerName,
        "vehicle": data.vehicle,
        "driver": data.driver,
        "route": data.route,
        "date": data.date,
        "cylinders": [c.dict() for c in data.cylinders],
        "status": data.status,
    }

def map_dispatch_out(row: dict):
    return {
        "_id": row.get("id"),
        "dispatchId": row.get("dispatch_id"),
        "customerName": row.get("customer_name"),
        "vehicle": row.get("vehicle"),
        "driver": row.get("driver"),
        "route": row.get("route"),
        "date": row.get("date"),
        "cylinders": row.get("cylinders", []),
        "status": row.get("status"),
    }


# ── RETURN ──

@app.get("/return")
async def get_returns():
    rows = await supabase_request("GET", "returns", filters="?order=created_at.desc")
    return [map_return_out(r) for r in rows]

@app.post("/return")
async def create_return(data: ReturnModel):
    rows = await supabase_request("POST", "returns", data=map_return_in(data))
    return map_return_out(rows[0])

@app.put("/return/{id}")
async def update_return(id: str, data: ReturnModel):
    rows = await supabase_request("PATCH", "returns", data=map_return_in(data), filters=f"?id=eq.{id}")
    return map_return_out(rows[0])

@app.patch("/return/{id}/post")
async def post_return(id: str):
    rows = await supabase_request("PATCH", "returns", data={"status": "posted"}, filters=f"?id=eq.{id}")
    return map_return_out(rows[0])

def map_return_in(data: ReturnModel):
    return {
        "return_id": data.returnId,
        "customer_name": data.customerName,
        "date": data.date,
        "cylinders": [c.dict() for c in data.cylinders],
        "status": data.status,
    }

def map_return_out(row: dict):
    return {
        "_id": row.get("id"),
        "returnId": row.get("return_id"),
        "customerName": row.get("customer_name"),
        "date": row.get("date"),
        "cylinders": row.get("cylinders", []),
        "status": row.get("status"),
    }


# ── TRACKER ──

@app.get("/tracker")
async def get_trackers():
    rows = await supabase_request("GET", "trackers", filters="?order=created_at.desc")
    return [map_tracker_out(r) for r in rows]

@app.post("/tracker")
async def create_tracker(data: TrackerModel):
    rows = await supabase_request("POST", "trackers", data=map_tracker_in(data))
    return map_tracker_out(rows[0])

@app.put("/tracker/{id}")
async def update_tracker(id: str, data: TrackerModel):
    rows = await supabase_request("PATCH", "trackers", data=map_tracker_in(data), filters=f"?id=eq.{id}")
    return map_tracker_out(rows[0])

@app.patch("/tracker/{id}/post")
async def post_tracker(id: str):
    rows = await supabase_request("PATCH", "trackers", data={"status": "posted"}, filters=f"?id=eq.{id}")
    return map_tracker_out(rows[0])

def map_tracker_in(data: TrackerModel):
    return {
        "serial": data.serial,
        "location": data.location,
        "cylinder_status": data.cylinderStatus,
        "status": data.status,
        "date": data.date,
    }

def map_tracker_out(row: dict):
    return {
        "_id": row.get("id"),
        "serial": row.get("serial"),
        "location": row.get("location"),
        "cylinderStatus": row.get("cylinder_status"),
        "status": row.get("status"),
        "date": row.get("date"),
    }