from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings

# from app.core.security import oauth2_scheme
from app.modules.admin.routes import router as admin_router
from app.modules.care_facilities.routes import care_facilities_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

if settings.ENABLE_ADMIN_ROUTES:
    app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(care_facilities_router, prefix=settings.API_V1_STR)
