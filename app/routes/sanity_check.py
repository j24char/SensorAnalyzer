from fastapi import APIRouter, UploadFile, File
import pandas as pd
from io import StringIO
from fastapi.responses import JSONResponse

latest_data = None  # In-memory storage for plotting

router = APIRouter()

def sanity_check(df: pd.DataFrame) -> dict:
    issues = []

    # Check for required columns
    if 'timestamp' not in df.columns or 'value' not in df.columns:
        issues.append("Missing 'timestamp' or 'value' column.")
        return {"issues": issues}

    # Check for NaNs
    if df['timestamp'].isnull().any():
        issues.append("Some timestamps are missing (NaN).")

    if df['value'].isnull().any():
        issues.append("Some values are missing (NaN).")

    # Check for non-numeric 'value' column
    if not pd.api.types.is_numeric_dtype(df['value']):
        issues.append("Value column contains non-numeric data.")

    # Optional: Check for duplicated timestamps
    if df['timestamp'].duplicated().any():
        issues.append("Duplicated timestamps found.")

    return {"issues": issues or ["No issues detected."]}


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    global latest_data
    df = pd.read_csv(file.file)

    # Always run sanity check first
    issues_report = sanity_check(df)

    # Only store the data if critical columns exist
    if "Missing 'timestamp' or 'value' column." in issues_report["issues"]:
        return JSONResponse(content=issues_report, status_code=400)

    # Preprocess
    df.dropna(subset=['timestamp', 'value'], inplace=True)

    #df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    #df = df.dropna(subset=['timestamp'])  # Remove bad timestamps
    try:
        df['timestamp'] = df['timestamp'].astype(float)
        #df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s', origin='unix').dt.strftime('%Y-%m-%dT%H:%M:%S.%3fZ')
    except Exception as e:
        return JSONResponse(content={"error": f"Timestamp conversion failed: {str(e)}"}, status_code=400)
    df = df.dropna(subset=['timestamp'])  # Remove any bad timestamps

    latest_data = df.to_dict(orient='records')  # Store for chart

    return issues_report  # Always return result of sanity_check


@router.get("/data")
async def get_data():
    global latest_data
    if latest_data is None:
        return JSONResponse(content={"error": "No data loaded"}, status_code=400)
    return latest_data
