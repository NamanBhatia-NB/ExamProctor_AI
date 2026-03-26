from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import logging
from datetime import datetime

app = FastAPI(title="AI Proctoring Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

@app.get("/health")
def health():
    return {"status": "AI Service Running"}

@app.post("/detect")
async def detect_face(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = face_detection.process(
        cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    )

    face_count = 0
    if results.detections:
        face_count = len(results.detections)

    suspicion_score = 0.1
    level = "LOW"

    if face_count == 0:
        suspicion_score = 0.85
        level = "HIGH"
    elif face_count > 1:
        suspicion_score = 0.95
        level = "CRITICAL"

    logging.info(f"{datetime.now()} | Faces: {face_count}")

    return {
        "timestamp": str(datetime.now()),
        "face_count": face_count,
        "suspicion_score": suspicion_score,
        "level": level
    }