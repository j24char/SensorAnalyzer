# Sensor Data Visualization App
This Python application reads sensor data from a CSV file, processes it, and displays the results on an interactive time-series chart. It supports timestamped float values and is ideal for quick exploratory analysis of time-based signals.

## Features
Load data from a CSV file (e.g., timestamp,value)

Plot the data using time on the x-axis and value on the y-axis

Handles malformed or missing data (e.g., NaN)

Debug logging and chart rendering feedback

Stores processed data in a local SQLite database (sensor_data.db)

## Requirements
Python 3.9+

matplotlib

pandas

### You can install the dependencies with:

bash
Copy
Edit
pip install -r requirements.txt

## Usage
Place your CSV file in the root directory. Example format:

sql
Copy
Edit
timestamp,value
0.01,0.008221146557
0.02,1.253823363
Run the application:

bash
Copy
Edit
python main.py
The chart window should appear with the data plotted.

## File Structure
bash
Copy
Edit
sensor-visualizer/
│
├── main.py                # Entry point script
├── sensor_data.db         # Auto-generated SQLite DB (ignored in Git)
├── requirements.txt       # Python dependencies
├── README.md              # This file
└── data/
    └── example.csv        # Your data file(s)

### What Not to Commit
Be sure your .gitignore excludes:

markdown
Copy
Edit
venv/
__pycache__/
*.pyc
sensor_data.db

## Notes
Timestamps are assumed to be in seconds since start (e.g., 0.01 = 10 ms).

Internally, these are converted to datetime objects starting from Unix epoch (1970-01-01) for compatibility with time-series plotting.

If your chart shows no data, check the debug console output for invalid or skipped values.

## License
MIT License

## To Run
Step 1: Make sure your virtual environment is activated
    bash: .\venv\Scripts\activate

Step 2: Install uvicorn (and FastAPI if needed)
    Inside your activated environment:

        bash: pip install fastapi uvicorn pandas python-multipart

    Then verify install:

        bash: uvicorn --version

Step 3: Run uvicorn with Python explicitly
    bash: python -m uvicorn app.main:app --reload

