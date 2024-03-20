from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from routes import userRoutes, adminRoutes, authRoutes

app = FastAPI(
    docs_url="/",
    root_path="/api/v1",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1},
    title="The KANBAN User Panel",
    version="1.0"
)

routes = [
    userRoutes,
    adminRoutes,
    authRoutes
]
app.mount("/images/payment_ss", StaticFiles(directory="images/payment_ss"), name="images")
[app.include_router(route.router) for route in routes]

# CORS middleware to allow requests from any origin, including WebSocket connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="127.0.0.1", port=9000, reload=True, workers=5)
