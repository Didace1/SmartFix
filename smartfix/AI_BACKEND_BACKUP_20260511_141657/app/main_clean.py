# smartfix/AI_BACKEND/app/main_clean.py
# Clean AI Backend - ONLY Inventory Recommendations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import ONLY inventory router
from api.inventory import router as inventory_router

# Create FastAPI app
app = FastAPI(
    title="SmartFix AI - Inventory System",
    version="1.0.0",
    description="AI-powered inventory recommendations for SmartFix"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include ONLY inventory router
app.include_router(inventory_router, prefix="/api", tags=["inventory"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "SmartFix AI Inventory System",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "inventory_recommendations": "/api/inventory-recommendations",
            "refresh_recommendations": "/api/inventory-recommendations/refresh",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "inventory-ai"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
