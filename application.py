from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity
import requests
import time
from rapidfuzz import process, fuzz
from difflib import get_close_matches

# =========================
# APP SETUP
# =========================
application = Flask(__name__)
app = application
CORS(app)

# =========================
# TMDB CONFIG
# =========================
TMDB_API_KEY = "0001bfc310ed653aa6b9c8c10f39dfba"
TMDB_IMG = "https://image.tmdb.org/t/p/w500"

# =========================
# LOAD DATA
# =========================
df_model = pickle.load(open('notebook/df.pkl', 'rb'))
tfidf_matrix = pickle.load(open('notebook/tfidf_matrix.pkl', 'rb'))
df = pickle.load(open("notebook/df_fixed_posters.pkl", "rb"))

# =========================
# CACHE (IMPORTANT)
# =========================
poster_cache = {}
df["title_lower"] = df["title"].str.lower()

# =========================
# SAFE POSTER FUNCTION
# =========================
import requests



poster_cache = {}



def get_poster_by_title(title):
    title = title.lower()

    # exact match first
    match = df[df["title"] == title]
    if not match.empty:
        return match.iloc[0]["poster_url"]

    # fuzzy match fallback
    titles = df["title"].tolist()
    close = get_close_matches(title, titles, n=1, cutoff=0.6)

    if close:
        return df[df["title"] == close[0]].iloc[0]["poster_url"]

    return "https://via.placeholder.com/300x450?text=No+Image"
# =========================
# RECOMMENDATION ENGINE
# =========================
def recommend(movie_id):

    vector = tfidf_matrix[movie_id]
    distances = cosine_similarity(vector, tfidf_matrix).flatten()

    movie_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:21]   # top 20

    recommended = []

    for i in movie_list:
        movie_index = i[0]   # ⭐ this is dataset index
        movie = df_model.iloc[movie_index].to_dict()

        # ⭐ add index explicitly
        movie["index"] = movie_index

        recommended.append(movie)

    return recommended

# =========================
# HOME ROUTE
# =========================
@app.route('/')
def home():
    movies = df_model.to_dict(orient='records')

    for m in movies[:100]:
        m["poster"] = get_poster_by_title(m.get("title"))

    return jsonify({
        "movies": movies[:100],
        "total": len(movies)
    })

# =========================
# PAGINATION ROUTE
# =========================
@app.route('/movies')
def movies():

    page = int(request.args.get("page", 1))
    limit = 200

    start = (page - 1) * limit
    end = start + limit

    data = df_model.iloc[start:end].copy()
    movies = data.to_dict(orient='records')

    for m in movies:
        m["poster"] = get_poster_by_title(m.get("title"))

    return jsonify({
        "movies": movies,
        "has_more": end < len(df_model)
    })

# =========================
# MOVIE DETAIL + RECOMMENDATION
# =========================
@app.route('/movies/<int:id>')
def get_movie(id):

    movie = df_model.iloc[id].to_dict()
    movie["poster"] = get_poster_by_title(movie.get("title"))

    recommendations = recommend(id)

    for r in recommendations:
        r["poster"] = get_poster_by_title(r.get("title"))

    return jsonify({
        "movie": movie,
        "recommendations": recommendations
    })





@app.route("/search/<string:word>")
def search(word):

    word = word.lower()

    # 1️⃣ exact match
    exact = df[df["title_lower"].str.contains(word, na=False)]

    exact["index"] = exact.index

    if not exact.empty:
        results = exact.head(21).to_dict(orient="records")

    else:
        # 2️⃣ fuzzy match
        titles = df["title_lower"].tolist()
        close = get_close_matches(word, titles, n=21, cutoff=0.5)

        results = df[df["title_lower"].isin(close)].to_dict(orient="records")

    return jsonify({"results": results})

# =========================
# RUN APP
# =========================
if __name__ == '__main__':
    app.run(debug=True)