from fastapi import FastAPI

app = FastAPI(
    title="HOK Gameplay Analyzer API"
)

@app.get("/")
def root():
    return {
        "message": "HOK Gameplay Analyzer Backend is running"
    }