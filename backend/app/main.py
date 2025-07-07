from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uuid
from fastapi.responses import StreamingResponse, JSONResponse
import io
import shutil
from .agent.triage_agent import traige_agent
from io import BytesIO
from agents import Runner
import zipfile
from pathlib import Path
from .schemas import ChatRequest, Response
import os
from groq import Groq
from gtts import gTTS
import base64

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Basic route
@app.get("/")
def read_root():
    return {"Message": "Hello World! FastAPI is working."}


@app.get("/greet/{name}")
def greet(name: str):
    return {"Message": f"Hello, {name}!"}


@app.post("/chat/")
async def chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Message query cannot be empty")

    try:
        result = await Runner.run(traige_agent, input=req.query)
        print(f"Agent response: {result.final_output}")
        response = result.final_output
        if not response:
            raise HTTPException(
                status_code=500,
                detail="Failed to get agent response",
            )
        return Response(status="success", data=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/voice/")
# async def echo_voice(file: UploadFile = File(...)):
#     """
#     Receives an audio file and echoes back the exact same audio content.
#     """
#     # Validate MIME type
#     if not file.content_type.startswith("audio/"):
#         raise HTTPException(
#             status_code=415,
#             detail="Unsupported media type. Please upload an audio file.",
#         )
#     # Read bytes
#     data = await file.read()
#     # Create a BytesIO stream for response
#     audio_stream = io.BytesIO(data)
#     # Return streaming response with same media type and original filename
#     headers = {"Content-Disposition": f"attachment; filename=echo_{file.filename}"}
#     return StreamingResponse(
#         audio_stream, media_type=file.content_type, headers=headers
#     )


# @app.post("/transcribe/")
# async def receive_and_transcribe(file: UploadFile = File(...), user_id: int = 0):
#     if not file.content_type.startswith("audio/"):
#         raise HTTPException(status_code=415, detail="Unsupported media type.")

#     try:
#         # tell OpenAI exactly what filename and content-type to use
#         transcription = client.audio.transcriptions.create(
#             file=(
#                 file.filename,  # e.g. "ttsmaker-file-2025-7-7-11-1-39.wav"
#                 file.file,  # the file-like object
#                 file.content_type,  # e.g. "audio/wav"
#             ),
#             model="whisper-large-v3-turbo",
#             prompt="Specify context or spelling",
#             response_format="verbose_json",
#             timestamp_granularities=["word", "segment"],
#             language="en",
#             temperature=0.0,
#         )

#         return {
#             "user_id": user_id,
#             "filename": file.filename,
#             "transcription": transcription,
#         }

#     except Exception as e:
#         # if it's a 400 from OpenAI, you might unwrap e to inspect the API error
#         raise HTTPException(status_code=500, detail=str(e))


# ← Change this to your desired directory
# BASE_DIR = Path(__file__).resolve().parent.parent
# UPLOAD_DIR = BASE_DIR / "docs" / "voices"


# @app.post("/transcribe-save-file")
# async def receive_and_transcribe_savefile(
#     file: UploadFile = File(...), user_id: int = 0
# ):
#     """
#     Receives an audio file, saves it to disk under UPLOAD_DIR,
#     sends it to Whisper for transcription, and returns the result.
#     """
#     # 1. Validate file type
#     if not file.content_type.startswith("audio/"):
#         raise HTTPException(
#             status_code=415,
#             detail="Unsupported media type. Please upload an audio file.",
#         )

#     # 2. Ensure upload dir exists
#     os.makedirs(UPLOAD_DIR, exist_ok=True)

#     # 3. Build the save path
#     save_path = os.path.join(UPLOAD_DIR, file.filename)

#     try:
#         # 4. Write the incoming upload to disk
#         with open(save_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # 5. Re-open for Whisper
#         with open(save_path, "rb") as audio_in:
#             transcription = client.audio.transcriptions.create(
#                 file=audio_in,
#                 model="whisper-large-v3-turbo",
#                 prompt="Specify context or spelling",
#                 response_format="verbose_json",
#                 timestamp_granularities=["word", "segment"],
#                 language="en",
#                 temperature=0.0,
#             )

#         # 6. Return result
#         return {
#             "user_id": user_id,
#             "filename": file.filename,
#             "transcription": transcription,
#         }

#     except Exception as e:
#         # Optional: clean up on error
#         if os.path.exists(save_path):
#             os.remove(save_path)
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/tts-groq")
# async def text_to_speech(req: ChatRequest):
#     """
#     Receives just text, calls PlayAI TTS with fixed model/voice,
#     and returns audio/wav bytes directly.
#     """
#     if not req.query.strip():
#         raise HTTPException(status_code=400, detail="`text` must not be empty")

#     try:
#         # 1. Call the TTS API
#         response = client.audio.speech.create(
#             model="playai-tts",
#             voice="Fritz-PlayAI",
#             input=req.query,
#             response_format="wav",
#         )

#         # 2. Capture the WAV bytes into memory
#         wav_buffer = BytesIO()
#         response.write_to_file(wav_buffer)  # writes into our BytesIO
#         wav_buffer.seek(0)

#         # 3. Stream it back
#         return StreamingResponse(
#             wav_buffer,
#             media_type="audio/wav",
#             headers={
#                 "Content-Disposition": f'attachment; filename="tts-{uuid.uuid4()[:8]}.wav"'
#             },
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"TTS generation failed: {e}")


# @app.post("/tts-gtts")
# async def text_to_speech_gtts(req: ChatRequest):
#     """
#     Receives just text, calls gTTS, and returns audio/mp3 bytes directly.
#     """
#     text = req.query.strip()
#     if not text:
#         raise HTTPException(status_code=400, detail="`text` must not be empty")

#     try:
#         # 1. Synthesize speech into a buffer
#         tts = gTTS(text=text, lang="en")
#         audio_buffer = io.BytesIO()
#         tts.write_to_fp(audio_buffer)
#         audio_buffer.seek(0)

#         # 2. Stream it back as MP3
#         return StreamingResponse(
#             audio_buffer,
#             media_type="audio/mpeg",
#             headers={
#                 "Content-Disposition": f'attachment; filename="tts-{uuid.uuid4().hex[:8]}.mp3"'
#             },
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"TTS generation failed: {e}")


@app.post("/voice-chat-base-64/")
async def voice_chat(user_id: int, chat_id: int, file: UploadFile = File(...)):
    # 1. Validate
    if not file.content_type.startswith("audio/"):
        raise HTTPException(415, "Please upload an audio file.")

    # 2. Read original audio bytes
    original_bytes = await file.read()

    # 3. Transcribe
    try:
        transcription = client.audio.transcriptions.create(
            file=(file.filename, BytesIO(original_bytes), file.content_type),
            model="whisper-large-v3-turbo",
            prompt="Specify context or spelling",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language="en",
            temperature=0.0,
        )
    except Exception as e:
        raise HTTPException(500, f"Transcription failed: {e}")

    # 4. Agent response
    try:
        result = await Runner.run(traige_agent, input=transcription.text)
        response_text = result.final_output.strip()
        if not response_text:
            raise ValueError("Empty agent response")
    except Exception as e:
        raise HTTPException(500, f"Agent failed: {e}")

    # 5. TTS synthesis (gTTS → MP3)
    try:
        tts_buffer = BytesIO()
        gTTS(text=response_text, lang="en").write_to_fp(tts_buffer)
        tts_buffer.seek(0)
        output_filename = f"tts-{uuid.uuid4().hex[:8]}.mp3"
        output_bytes = tts_buffer.read()
    except Exception as e:
        raise HTTPException(500, f"TTS generation failed: {e}")

    # 6. Base64‑encode both blobs
    input_b64 = base64.b64encode(original_bytes).decode()
    output_b64 = base64.b64encode(output_bytes).decode()

    # 7. Return JSON with both payloads
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "input_audio": {
                "filename": file.filename,
                "media_type": file.content_type,
                "data_base64": input_b64,
            },
            "output_audio": {
                "filename": output_filename,
                "media_type": "audio/mpeg",
                "data_base64": output_b64,
            },
        },
    )


@app.post("/voice-chat-zip/")
async def voice_chat_zip(user_id: int, chat_id: int, file: UploadFile = File(...)):
    """
    1. Receives audio.
    2. Transcribes via Whisper.
    3. Feeds text to your agent.
    4. Synthesizes agent reply.
    5. Returns a ZIP containing:
       - input/<original filename>
       - output/tts-<uuid>.mp3
    """
    # 1. Validate
    if not file.content_type.startswith("audio/"):
        raise HTTPException(415, "Please upload an audio file.")

    # 2. Read original audio bytes
    original_bytes = await file.read()

    # 3. Transcribe
    try:
        transcription = client.audio.transcriptions.create(
            file=(file.filename, BytesIO(original_bytes), file.content_type),
            model="whisper-large-v3-turbo",
            prompt="Specify context or spelling",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language="en",
            temperature=0.0,
        )

    except Exception as e:
        raise HTTPException(500, f"Transcription failed: {e}")

    # 4. Agent response
    try:
        result = await Runner.run(traige_agent, input=transcription.text)
        response_text = result.final_output.strip()
        if not response_text:
            raise ValueError("Empty agent response")
    except Exception as e:
        raise HTTPException(500, f"Agent failed: {e}")

    # 5. TTS synthesis
    try:
        # -- Option A: gTTS to MP3 --
        tts_mp3 = BytesIO()
        gTTS(text=response_text, lang="en").write_to_fp(tts_mp3)
        tts_mp3.seek(0)
        output_filename = f"tts-{uuid.uuid4().hex[:8]}.mp3"
        output_bytes = tts_mp3.read()

        # -- Option B: (uncomment to use Groq TTS) --
        # tts_wav = BytesIO()
        # tts_resp = client.audio.speech.create(
        #     model="playai-tts", voice="Fritz-PlayAI",
        #     input=response_text, response_format="wav"
        # )
        # tts_resp.write_to_file(tts_wav)
        # tts_wav.seek(0)
        # output_filename = f"tts-{uuid.uuid4().hex[:8]}.wav"
        # output_bytes = tts_wav.read()

    except Exception as e:
        raise HTTPException(500, f"TTS generation failed: {e}")

    # 6. Zip both files together
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, mode="w") as z:
        # store original
        z.writestr(f"input/{file.filename}", original_bytes)
        # store generated
        z.writestr(f"output/{output_filename}", output_bytes)
    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="voice-chat-{uuid.uuid4().hex[:6]}.zip"'
        },
    )


@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            text = await websocket.receive_text()
            result = await Runner.run(traige_agent, input=text)
            print(f"Agent response: {result.final_output}")
            response = result.final_output
            await websocket.send_text(response)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
