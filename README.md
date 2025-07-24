Step 1: Make sure your virtual environment is activated
    bash: .\venv\Scripts\activate

Step 2: Install uvicorn (and FastAPI if needed)
    Inside your activated environment:

        bash: pip install fastapi uvicorn pandas python-multipart

    Then verify install:

        bash: uvicorn --version

Step 3: Run uvicorn with Python explicitly
    bash: python -m uvicorn app.main:app --reload

    