"""One-off script: regenerate ghost mascot with transparent background using Gemini Nano Banana."""
import asyncio
import os
import base64
import requests
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

load_dotenv("/app/backend/.env")

SOURCE_URL = "https://static.prod-images.emergentagent.com/jobs/cf313e6c-1ef6-480f-8538-031db3fc25ba/images/7c5b31871d6467e38ff062ebd5f5f5ed2acc32acd94f16699c3b8feb62fd6dda.png"
OUT = Path("/app/frontend/public/ghost-transparent.png")


async def main():
    print("Downloading source ghost...")
    img_bytes = requests.get(SOURCE_URL, timeout=30).content
    b64 = base64.b64encode(img_bytes).decode("utf-8")

    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id="ghost-bg-removal",
        system_message="You are an expert image editor that produces clean cut-outs.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )

    prompt = (
        "Take the soft bone-white ceramic ghost figure from this image and produce a clean cutout "
        "with a FULLY TRANSPARENT background (alpha channel). Keep the ghost exactly as-is including "
        "the </> code-symbol mouth, the small eye holes, the cute pose, and the soft matte ceramic "
        "shading. Remove ALL background (no shadow on the ground, no warm beige backdrop). The output "
        "must be a PNG with transparency, ghost centered, fitting the frame snugly with about 10% "
        "padding on each side."
    )

    msg = UserMessage(text=prompt, file_contents=[ImageContent(b64)])
    text, images = await chat.send_message_multimodal_response(msg)
    print("Model text:", text[:200] if text else "(no text)")
    if not images:
        print("No image returned!")
        return

    img = images[0]
    print(f"Got image: {img['mime_type']}")
    out_bytes = base64.b64decode(img["data"])
    OUT.write_bytes(out_bytes)
    print(f"Saved -> {OUT} ({len(out_bytes)} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
