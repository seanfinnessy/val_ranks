import time
import json
from flask import Flask, jsonify
from flask_sock import Sock #type: ignore
from requests.api import get, head
from setup import LobbySetup, GameSetup, LocalSetup, get_latest_season_id, get_player_name
from conversions import map_puuids

app = Flask(__name__)
sock = Sock(app)

lockfile: dict = {'name': '', 'PID': '', 'port': '', 'password': '', 'protocol': ''}
headers: dict = {}
puuid: str = ""
region: str = ""
seasonID: str = ""
last_game_state: str = ""

#TODO: When loggin in and out, cannot retrieve loadouts.
def setup_lobby():
    try:
        # Setup lobby
        lobby = LobbySetup(headers)

        # Get match ID
        match_id = lobby.get_match_id(region, puuid)

        # Get match details to obtain all players, the map, and game mode.
        (
            player_dict,
            map_in_ongoing_match,
            game_mode_in_ongoing_match,
        ) = lobby.get_ongoing_match(region, match_id)

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
            "red_team_details": [],
        }

        return LobbySetup.create_player_details(
            player_dict=player_dict,
            region=region,
            seasonID=seasonID,
            match_details=match_details,
            match_uuid=match_id
        )
    except:
        return {'message': 'Cannot set up lobby if you are not in an active game.'}

@sock.route("/lobby", methods=["GET"])
def get_hello(ws):
    global last_game_state
    global headers
    global puuid
    global region
    global seasonID

    print("called lobby endpoint")

    lockfile = GameSetup.get_lockfile()
    headers, puuid = LocalSetup(lockfile).get_headers()
    region = LocalSetup(lockfile).get_region()
    seasonID = get_latest_season_id(region=region)
    game_state, game_name, game_tag = LocalSetup(lockfile).get_presence(puuid)

    while True:
        time.sleep(5)
        print("waiting 5 seconds and calling presence...")
        try:
            game_state, game_name, game_tag = LocalSetup(lockfile).get_presence(puuid)
        except TypeError:
            raise Exception("Game has not started yet!")
        if game_state != last_game_state:
            last_game_state = game_state

            if last_game_state == "INGAME":
                match_details = setup_lobby()
                ws.send(json.dumps({'game_state': game_state, 'game_name': game_name, 'game_tag': game_tag, 'match_details': match_details}))
                continue

            ws.send(json.dumps({'game_state': game_state, 'game_name': game_name, 'game_tag': game_tag}))

# @sock.route("/current_user", methods=["GET"])
# def get_logged_in_user(ws):
#     global lockfile
#     global headers
#     global puuid
#     global region
#     while True:
#         time.sleep(5)
#         new_lockfile = GameSetup.get_lockfile()
#         if lockfile["PID"] == new_lockfile["PID"]:
#             print("Using same lockfile")
#             lockfile = new_lockfile
#             player = get_player_name(region, puuid)
#             return ws.send({'current_user_name': player["GameName"], 'current_user_tag': player["TagLine"]})
#         else:
#             try:
#                 print("Creating new lockfile")
#                 lockfile = GameSetup.get_lockfile()
#                 headers, puuid = LocalSetup(lockfile).get_headers()
#                 region = LocalSetup(lockfile).get_region()
#                 player = get_player_name(region, puuid)
#                 return jsonify({'current_user_name': player["GameName"], 'current_user_tag': player["TagLine"]})
#             except:
#                 return jsonify({'current_user_name': 'N/A', 'current_user_tag': 'N/A'})

# # Add a function that returns the logged in player?
# @app.route("/match_details", methods=["GET"])
# def get_match_details():
    # global lockfile
    # global headers
    # global puuid
    # global region
    # global seasonID
    # new_lockfile = GameSetup.get_lockfile()
    # if lockfile['PID'] == new_lockfile['PID']:
    #     match_details = setup_lobby()
    #     return jsonify(match_details)
    # else:
    #     try:
    #         lockfile = GameSetup.get_lockfile()
    #         headers, puuid = LocalSetup(lockfile=lockfile).get_headers()
    #         region = LocalSetup(lockfile=lockfile).get_region()
    #         seasonID = get_latest_season_id(region=region)
    #         match_details = setup_lobby()
    #         return jsonify(match_details)
    #     except:
    #         return jsonify(
    #             {"message": "Could not create credentials, are you in an active game?"}
    #         )


def main():
    app.run(debug=True)


if __name__ == "__main__":
    main()
