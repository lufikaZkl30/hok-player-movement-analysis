import cv2
from pathlib import Path


class VideoProcessor:

    def __init__(self, video_path):
        self.video_path = Path(video_path)
        self.capture = None

    def open(self):
        self.capture = cv2.VideoCapture(str(self.video_path))

        if not self.capture.isOpened():
            raise ValueError(
                f"Video tidak dapat dibuka: {self.video_path}"
            )

    def get_video_info(self):
        if self.capture is None:
            self.open()

        fps = self.capture.get(cv2.CAP_PROP_FPS)
        frame_count = int(
            self.capture.get(cv2.CAP_PROP_FRAME_COUNT)
        )

        width = int(
            self.capture.get(cv2.CAP_PROP_FRAME_WIDTH)
        )

        height = int(
            self.capture.get(cv2.CAP_PROP_FRAME_HEIGHT)
        )

        duration = frame_count / fps if fps > 0 else 0

        return {
            "fps": fps,
            "frame_count": frame_count,
            "width": width,
            "height": height,
            "duration_seconds": duration
        }

    def extract_frames(self, output_dir, interval=60):

        if self.capture is None:
            self.open()

        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        frame_number = 0
        saved_frames = 0

        while True:

            success, frame = self.capture.read()

            if not success:
                break

            if frame_number % interval == 0:

                output_path = (
                    output_dir /
                    f"frame_{frame_number:06d}.jpg"
                )

                cv2.imwrite(
                    str(output_path),
                    frame
                )

                saved_frames += 1

            frame_number += 1

        return saved_frames

    def close(self):

        if self.capture is not None:
            self.capture.release()