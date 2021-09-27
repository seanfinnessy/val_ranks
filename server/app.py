import json
from flask import Flask, jsonify
from requests.api import get
from config import (
    get_player_mmr, region, seasonID, get_player_name, number_to_ranks, get_ongoing_match, get_match_id, map_puuids, puuid, get_map_details
)

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def get_hello():
    return jsonify({"Hello":"World"})

@app.route('/match_details', methods=['GET'])
def get_match_details():
    # Get match ID
    match_id = get_match_id(region, puuid)

    # Get match details using match ID
    ongoing_match_details = get_ongoing_match(region, match_id)

    # Get all players in lobby
    players_in_ongoing_match = ongoing_match_details["Players"]

    # Get map of lobby
    map_in_ongoing_match = str(ongoing_match_details["MapID"]).rsplit("/", 1)[1]

    # Get map PUUID
    map_puuidin_ongoing_match = map_puuids[map_in_ongoing_match]

    # Get map details
    map_details = get_map_details(map_puuidin_ongoing_match)

    
    # Check type of game in lobby
    if ongoing_match_details["ProvisioningFlow"] == "CustomGame":
        game_mode_in_ongoing_match = "Custom"
    else:
        game_mode_in_ongoing_match = ongoing_match_details["MatchmakingData"]["QueueID"]

    # Get all PUUIDs in lobby
    puuid_list = []
    for player in players_in_ongoing_match:
        puuid_list.append(player["Subject"]) #TODO: Add in CharacterID to get the agent the user is playing
        
    # New match details obj
    match_details = dict()
    match_details["GameMode"] = game_mode_in_ongoing_match
    match_details["Map"] = map_details["displayName"]
    match_details["listViewIcon"] = map_details["listViewIcon"]

    list = []
    for i in puuid_list:
        player_name = get_player_name(region, i)
        rank = get_player_mmr(region, i, seasonID)
        rank["CurrentRank"] = number_to_ranks[rank["CurrentRank"]]
        player_name["RankInfo"] = rank
        list.append(player_name)

    match_details["player_details"] = list
    return jsonify(match_details)

def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()