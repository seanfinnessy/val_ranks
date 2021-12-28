import time
import json
from flask import Flask, jsonify
from flask_sock import Sock #type: ignore
from requests.api import get, head
from setup import LobbySetup, GameSetup, LocalSetup, get_latest_season_id, get_player_name, get_player_mmr
from conversions import map_puuids, number_to_ranks, rank_icons

app = Flask(__name__)
sock = Sock(app)

lockfile: dict = {'name': '', 'PID': '', 'port': '', 'password': '', 'protocol': ''}
headers: dict = {}
puuid: str = ""
region: str = ""
seasonID: str = ""
last_game_state: str = ""

#TODO: When loggin in and out, cannot retrieve loadouts.
def setup_lobby(game_state, party):
    try:
        if (game_state == "MENUS"):
            print("Getting party info in menus")
            new_party = []
            for member in party:
                # Get rank info
                rank, winRatio = get_player_mmr(region, member["PlayerID"], seasonID)
                # Assign rank info
                member["WinLossRatio"] = winRatio
                member["CurrentRank"] = number_to_ranks[rank["CurrentRank"]]
                member["RankIcon"] = rank_icons[member["CurrentRank"]]
                new_party.append(member)
            return new_party

        elif (game_state == "INGAME"):
            print("Getting party info ingame")
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
    # Create lockfile
    lockfile = GameSetup.get_lockfile()

    # Create headers and PUUID
    headers, puuid = LocalSetup(lockfile).get_headers()

    # Get region
    region = LocalSetup(lockfile).get_region()

    # Get current season ID
    seasonID = get_latest_season_id(region=region)

    # Get presences (party info)
    game_state, game_name, game_tag, current_party = LocalSetup(lockfile).get_presence(puuid)

    print("The last game state: " + last_game_state)
    # While loop for game state.
    while True:
        time.sleep(5)
        # Check presence every 5 seconds. If user logs out of game, exit loop.
        try:
            game_state, game_name, game_tag, current_party = LocalSetup(lockfile).get_presence(puuid)
        except TypeError:
            raise Exception("Game has not started yet!")
        except UnboundLocalError:
            print("Looks like you logged out of your game.")
            # Set game state to LOGGED_OUT
            last_game_state = "LOGGED_OUT"
            break

        # Check game state and if you previously logged out.
        if game_state != last_game_state:
            last_game_state = game_state

            # Get presences for menus
            if last_game_state == "MENUS":
                party_details = setup_lobby(game_state, current_party)
                ws.send(json.dumps({'game_state': game_state, 'game_name': game_name, 'game_tag': game_tag, 'party_details': party_details}))
                continue
            
            # Get presences for ingame
            if last_game_state == "INGAME":
                match_details = setup_lobby(game_state, current_party)
                ws.send(json.dumps({'game_state': game_state, 'game_name': game_name, 'game_tag': game_tag, 'match_details': match_details}))
                continue
            
            # Send info to client
            ws.send(json.dumps({'game_state': game_state, 'game_name': game_name, 'game_tag': game_tag}))

def main():
    app.run(debug=True)


if __name__ == "__main__":
    main()
