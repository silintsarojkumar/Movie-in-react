import pandas as pd
import pickle
import requests
import sys
import time

API_KEY = "0001bfc310ed653aa6b9c8c10f39dfba"
BASE_IMG = "https://image.tmdb.org/t/p/w500"
FALLBACK = "https://via.placeholder.com/300x450?text=No+Image"

# =========================
# LOAD DATASET
# =========================
df = pickle.load(open("df.pkl", "rb"))

total = len(df)
success = 0
failed = 0
processed = 0


# =========================
# GET POSTER (WITH RETRY)
# =========================
def fetch_poster(title):
    global success, failed

    url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={title}"

    for attempt in range(2):  # 🔥 retry 2 times (initial + 1 retry)
        try:
            res = requests.get(url, timeout=5).json()

            if res.get("results"):
                poster = res["results"][0].get("poster_path")

                if poster:
                    success += 1
                    return BASE_IMG + poster

            break  # if response came but no poster, no retry needed

        except:
            time.sleep(0.5)  # small wait before retry
            continue

    failed += 1
    return FALLBACK


# =========================
# PROCESS WITH LIVE COUNTER
# =========================
posters = []

for i, title in enumerate(df["title"]):

    poster_url = fetch_poster(title)
    posters.append(poster_url)

    processed += 1

    # LIVE TERMINAL OUTPUT
    sys.stdout.write(
        f"\rProcessed: {processed}/{total} | Success: {success} | Failed: {failed}"
    )
    sys.stdout.flush()


# =========================
# SAVE INTO DATAFRAME
# =========================
df["poster_url"] = posters

# Optional: save only needed columns
df[["title", "poster_url"]].to_csv("movies_with_posters.csv", index=False)

# or pickle version
pickle.dump(df, open("df_with_posters.pkl", "wb"))


# =========================
# FINAL OUTPUT
# =========================
print("\n\n===== DONE =====")
print(f"Total Movies   : {total}")
print(f"Poster Found   : {success}")
print(f"Poster Failed  : {failed}")
print("================\n")