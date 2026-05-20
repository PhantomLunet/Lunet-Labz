from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Lunet Labz API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class WaitlistCreate(BaseModel):
    email: EmailStr


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    tagline: str
    description: str
    image: str
    tags: List[str] = []
    web_url: Optional[str] = None
    download_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False


# ---------- Seed data ----------
SEED_PROJECTS: List[dict] = [
    {
        "id": "ghostpad",
        "title": "GhostPad",
        "tagline": "A floating notebook for half-formed ideas.",
        "description": "Ephemeral note-taking with markdown, slash commands and zero accounts.",
        "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
        "tags": ["webapp", "productivity"],
        "web_url": "#",
        "github_url": "#",
        "featured": True,
    },
    {
        "id": "lanternfm",
        "title": "Lantern.fm",
        "tagline": "Ambient radio for late-night coders.",
        "description": "Curated lofi, jazz, and field recordings — one tab, no ads, no logins.",
        "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "tags": ["webapp", "audio"],
        "web_url": "#",
    },
    {
        "id": "atlas-cli",
        "title": "Atlas CLI",
        "tagline": "Deploy with a whisper.",
        "description": "A tiny command-line companion to push static sites and small services in seconds.",
        "image": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80",
        "tags": ["cli", "devtool"],
        "download_url": "#",
        "github_url": "#",
    },
    {
        "id": "lumenboard",
        "title": "Lumenboard",
        "tagline": "Mood boards for makers.",
        "description": "Collect references, sketches and palettes into living, scrollable boards.",
        "image": "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=1200&q=80",
        "tags": ["webapp", "design"],
        "web_url": "#",
    },
    {
        "id": "tinybrew",
        "title": "Tinybrew",
        "tagline": "Brew timers for slow mornings.",
        "description": "Beautifully simple pour-over and espresso timers with brew notes.",
        "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        "tags": ["webapp", "lifestyle"],
        "web_url": "#",
    },
    {
        "id": "mothlamp",
        "title": "Mothlamp",
        "tagline": "A reading light for the web.",
        "description": "A browser extension that turns articles into warm, paper-like reading rooms.",
        "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80",
        "tags": ["extension"],
        "download_url": "#",
        "github_url": "#",
    },
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Lunet Labz API — boo."}


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    return [Project(**p) for p in SEED_PROJECTS]


@api_router.post("/waitlist", response_model=WaitlistEntry)
async def join_waitlist(payload: WaitlistCreate):
    email_lower = payload.email.lower()
    existing = await db.waitlist.find_one({"email": email_lower}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="You're already on the waitlist.")
    entry = WaitlistEntry(email=email_lower)
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.waitlist.insert_one(doc)
    return entry


@api_router.get("/waitlist/count")
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
