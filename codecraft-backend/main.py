from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware example
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# Pydantic model for POST
class Item(BaseModel):
    name: str
    description: str = None

# GET endpoint
@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id, "name": f"Item {item_id}"}

# POST endpoint
@app.post("/items/")
async def create_item(item: Item):
    if not item.name:
        raise HTTPException(status_code=400, detail="Name is required")
    return {"message": "Item created", "item": item}

# PUT endpoint
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"message": f"Item {item_id} updated", "item": item}

# DELETE endpoint
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted"}

# Health check endpoint (optional, but good for Vercel)
@app.get("/health")
async def health_check():
    return {"message": "Health check successful"}

# This is important for Vercel
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
