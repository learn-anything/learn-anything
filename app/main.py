from fastapi import FastAPI
from app.routers import example_router

app = FastAPI()

# Include routers
app.include_router(example_router.router)

@app.get("/")
def read_root():
    return {"message": "You have succesfully accessed learn-anything.xyz fastapi."}

