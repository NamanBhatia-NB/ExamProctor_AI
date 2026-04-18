# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# import cv2
# import numpy as np
# import mediapipe as mp
# import logging
# from datetime import datetime

# app = FastAPI(title="AI Proctoring Service")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# logging.basicConfig(level=logging.INFO)

# mp_face = mp.solutions.face_detection
# face_detection = mp_face.FaceDetection(
#     model_selection=0,
#     min_detection_confidence=0.6
# )

# @app.get("/health")
# def health():
#     return {"status": "AI Service Running"}

# @app.post("/detect")
# async def detect_face(file: UploadFile = File(...)):
#     contents = await file.read()
#     nparr = np.frombuffer(contents, np.uint8)
#     image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     results = face_detection.process(
#         cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     )

#     face_count = 0
#     if results.detections:
#         face_count = len(results.detections)

#     suspicion_score = 0.1
#     level = "LOW"

#     if face_count == 0:
#         suspicion_score = 0.85
#         level = "HIGH"
#     elif face_count > 1:
#         suspicion_score = 0.95
#         level = "CRITICAL"

#     logging.info(f"{datetime.now()} | Faces: {face_count}")

#     return {
#         "timestamp": str(datetime.now()),
#         "face_count": face_count,
#         "suspicion_score": suspicion_score,
#         "level": level
#     }

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import logging
from datetime import datetime
import math

app = FastAPI(title="Advanced AI Proctoring")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. UPGRADE to FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=2,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)


def calculate_distance(point1, point2):
    return math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)


@app.post("/detect")
async def detect_behavior(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert for MediaPipe
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)

    face_count = 0
    is_talking = False
    is_looking_away = False
    suspicion_score = 0.0
    flags = []

    if results.multi_face_landmarks:
        face_count = len(results.multi_face_landmarks)

        if face_count == 1:
            landmarks = results.multi_face_landmarks[0].landmark

            # --- A. TALKING DETECTION (Mouth Aspect Ratio) ---
            # Landmarks 13 (upper lip) and 14 (lower lip)
            mouth_distance = calculate_distance(landmarks[13], landmarks[14])
            if mouth_distance > 0.05:  # Threshold varies based on camera distance
                is_talking = True
                flags.append("TALKING_DETECTED")
                suspicion_score += 0.3

            # --- B. GAZE/HEAD POSE ESTIMATION (Simplified) ---
            # Compare nose tip (1) to sides of face (234, 454) to see if head is turned
            nose_x = landmarks[1].x
            left_side_x = landmarks[234].x
            right_side_x = landmarks[454].x

            # Calculate center point between sides of face
            face_center_x = (left_side_x + right_side_x) / 2.0

            # If nose is far from center, they are looking away
            if abs(nose_x - face_center_x) > 0.05:
                is_looking_away = True
                flags.append("LOOKING_AWAY")
                suspicion_score += 0.4

    # --- SCORING LOGIC ---
    if face_count == 0:
        suspicion_score = 1.0
        flags.append("NO_FACE_DETECTED")
    elif face_count > 1:
        suspicion_score = 1.0
        flags.append("MULTIPLE_FACES")

    # Determine Level
    level = "LOW"
    if suspicion_score >= 0.7:
        level = "CRITICAL"
    elif suspicion_score >= 0.3:
        level = "HIGH"

    return {
        "timestamp": str(datetime.now()),
        "face_count": face_count,
        "is_talking": is_talking,
        "is_looking_away": is_looking_away,
        "suspicion_score": min(suspicion_score, 1.0),  # Cap at 1.0
        "level": level,
        "flags": flags,
    }
