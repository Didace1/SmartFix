# smartfix/AI_BACKEND/app/main_clean.py
# Clean AI Backend - Inventory Recommendations + Chatbot

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from api.inventory import router as inventory_router
from api.chatbot import router as chatbot_router

# Create FastAPI app
app = FastAPI(
    title="SmartFix AI - Inventory & Chatbot System",
    version="2.0.0",
    description="AI-powered inventory recommendations and customer chatbot for SmartFix"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inventory_router, prefix="/api", tags=["inventory"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["chatbot"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "SmartFix AI System",
        "status": "running",
        "version": "2.0.0",
        "endpoints": {
            "inventory_recommendations": "/api/inventory-recommendations",
            "refresh_recommendations": "/api/inventory-recommendations/refresh",
            "test_connection": "/api/test-connection",
            "chatbot": "/api/chatbot/chat",
            "chatbot_suggestions": "/api/chatbot/suggestions",
            "chatbot_test": "/api/chatbot/test",
            "docs": "/docs"
        },
        "note": "Make sure Java backend is running on port 8080"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["inventory-ai", "chatbot"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
