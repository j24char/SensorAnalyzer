from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.routes import sanity_check
import pandas as pd

app = FastAPI()
app.include_router(sanity_check.router)

# Mount frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Store uploaded data in memory
uploaded_df = None

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    global uploaded_df
    uploaded_df = pd.read_csv(file.file)

    # Return any rows with NaNs as issues
    issues = uploaded_df[uploaded_df.isnull().any(axis=1)].to_dict(orient="records")
    return {"issues": issues}

@app.get("/data")
async def get_data():
    global uploaded_df
    if uploaded_df is None:
        return JSONResponse(content={"error": "No data uploaded"}, status_code=400)

    # Assume columns named "timestamp" and "value"
    try:
        data = uploaded_df[["timestamp", "value"]].to_dict(orient="records")
        return data
    except KeyError:
        return JSONResponse(content={"error": "Missing required columns"}, status_code=400)

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("frontend/index.html", "r") as f:
        return f.read()
