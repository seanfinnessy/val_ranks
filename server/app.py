import json
from flask import Flask, jsonify
from requests.api import get
from setup import (region, seasonID, puuid, headers, LobbySetup)
from conversions import map_puuids, number_to_ranks

app = Flask(__name__)


@app.route('/', methods=['GET'])
def get_hello():
    return jsonify({"Hello": "World"})

# TODO: If a new account, need to reinitialize lockfile and stuff
@app.route('/match_details', methods=['GET'])
def get_match_details():
    try:
        # Setup lobby
        lobby = LobbySetup(headers)

        # Get match ID
        match_id = lobby.get_match_id(region, puuid)

        # Get match details to obtain all players, the map, and game mode
        player_dict, map_in_ongoing_match, game_mode_in_ongoing_match = lobby.get_ongoing_match(
            region, match_id)

        # Get map PUUID
        map_puuidin_ongoing_match = map_puuids[map_in_ongoing_match]

        # Get map details
        map_details = lobby.get_map_details(map_puuidin_ongoing_match)

        # New match details obj
        match_details = {
            "GameMode": game_mode_in_ongoing_match,
            "Map": map_details["displayName"],
            "listViewIcon": map_details["listViewIcon"],
            "blue_team_details": [],
            "red_team_details": []
        }

        match_details = LobbySetup.create_player_details(player_dict=player_dict, region=region, seasonID=seasonID, match_details=match_details)
    except:
            return jsonify({"message": 'Not in an active game.'})

    return jsonify(match_details)


def main():
    app.run(debug=True)


if __name__ == "__main__":
    main()
