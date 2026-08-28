from pathlib import Path


# Root project
BASE_DIR = Path(__file__).resolve().parent.parent

# Data directories
RAW_DATA_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DATA_DIR = BASE_DIR / "data" / "processed"
SAMPLES_DIR = BASE_DIR / "data" / "samples"

# Output
RESULTS_DIR = BASE_DIR / "results"

# Default video
VIDEO_PATH = RAW_DATA_DIR / "gameplay_01.mp4"

# Frame extraction
FRAME_INTERVAL = 60