from src.gameplay_analyzer import GameplayAnalyzer


analyzer = GameplayAnalyzer()

analyzer.add_feature("movement", 80)
analyzer.add_feature("positioning", 90)
analyzer.add_feature("rotation", 75)

print(analyzer.get_features())

from src.config import (
    VIDEO_PATH,
    SAMPLES_DIR,
    FRAME_INTERVAL
)

from src.preprocessing.video_processor import VideoProcessor


def main():

    print("=" * 50)
    print("GAMEPLAY ANALYSIS FRAMEWORK")
    print("=" * 50)

    print("\n[1] Membuka video...")

    processor = VideoProcessor(VIDEO_PATH)

    processor.open()

    print("Video berhasil dibuka.")

    print("\n[2] Membaca informasi video...")

    info = processor.get_video_info()

    print(f"Resolution : {info['width']} x {info['height']}")
    print(f"FPS        : {info['fps']:.2f}")
    print(f"Frames     : {info['frame_count']}")
    print(f"Duration   : {info['duration_seconds']:.2f} detik")

    print("\n[3] Mengambil sample frame...")

    saved_frames = processor.extract_frames(
        SAMPLES_DIR,
        interval=FRAME_INTERVAL
    )

    print(f"Frame tersimpan : {saved_frames}")

    processor.close()

    print("\n[4] Selesai.")
    print("=" * 50)


if __name__ == "__main__":
    main()