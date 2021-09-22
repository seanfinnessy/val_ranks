import json
from flask import Flask, jsonify
from requests.api import get
from config import (
    get_player_mmr, region, puuuid_list, seasonID, get_lockfile, get_headers, get_region, get_content, get_latest_season_id, 
    get_player_name, number_to_ranks, map_in_ongoing_match, game_mode_in_ongoing_match
)

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def get_hello():
    return jsonify({"Hello":"World"})
    
@app.route('/rank', methods=['GET'])
def get_match_details():
    list = []
    list.append({"GameMode": game_mode_in_ongoing_match, "Map": map_in_ongoing_match})
    for i in puuuid_list:
        player_name = get_player_name(region, i)
        rank = get_player_mmr(region, i, seasonID)
        rank["Current Rank"] = number_to_ranks[rank["Current Rank"]]
        player_name["RankInfo"] = rank
        list.append(player_name)
    return jsonify(list)

def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()