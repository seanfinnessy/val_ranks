import json
from flask import Flask, jsonify
from requests.api import get
from config import get_player_mmr, region, puuid, seasonID, get_lockfile, get_headers, get_region, get_content, get_latest_season_id, get_player_name

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def get_hello():
    return jsonify({"Hello":"World"})
    
@app.route('/rank', methods=['GET'])
def get_rank_of_user():
    list = []
    list_of_puuid_in_lobby = [puuid]
    for i in list_of_puuid_in_lobby:
        player_name = get_player_name(region, i)
        rank = get_player_mmr(region, i, seasonID)
        player_name["RankInfo"] = rank
        list.append(player_name)
    return jsonify(list)

def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()

{
    "Current Rank": 22,
    "GameName": "2FACED",
    "RankInfo": {
        "Leaderboard": 4609,
    "Rank Rating": 99,
    "TagLine": "s4ke"
    }
}