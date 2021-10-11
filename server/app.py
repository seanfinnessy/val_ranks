import json
from flask import Flask, jsonify
from requests.api import get
from config import (
    get_player_mmr, region, seasonID, get_player_name, number_to_ranks, get_ongoing_match, get_match_id, map_puuids, puuid, get_map_details, get_agent_details
)

app = Flask(__name__)


@app.route('/', methods=['GET'])
def get_hello():
    return jsonify({"Hello": "World"})


@app.route('/match_details', methods=['GET'])
def get_match_details():
    # Get match ID
    match_id = get_match_id(region, puuid)

    # Get match details using match ID
    ongoing_match_details = get_ongoing_match(region, match_id)

    # Get all players in lobby
    players_in_ongoing_match = ongoing_match_details["Players"]

    # Get map of lobby
    map_in_ongoing_match = str(
        ongoing_match_details["MapID"]).rsplit("/", 1)[1]

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
    player_dict = {"puuid": [], "agent": [], "team": []}
    for player in players_in_ongoing_match:
        player_dict["puuid"].append(player["Subject"])
        player_dict["agent"].append(player["CharacterID"])
        player_dict["team"].append(player["TeamID"])
    print(player_dict)

    # New match details obj
    match_details = {
        "GameMode": game_mode_in_ongoing_match,
        "Map": map_details["displayName"],
        "listViewIcon": map_details["listViewIcon"],
        "blue_team_details": [],
        "red_team_details": []
    }

    list = []
    for playerId, agentId, teamId in zip(player_dict["puuid"], player_dict["agent"], player_dict["team"]):
        # Get player details
        player_details = get_player_name(region, playerId)
        # Get player ranks
        rank = get_player_mmr(region, playerId, seasonID)
        # convert rank number to actual rank
        rank["CurrentRank"] = number_to_ranks[rank["CurrentRank"]]
        # Assign player their rank info
        player_details["RankInfo"] = rank
        # Assign player their agent details
        agent_details = get_agent_details(agentId)
        player_details["AgentName"] = agent_details["displayName"]
        player_details["AgentIcon"] = agent_details["displayIcon"]
        player_details["Team"] = teamId
        list.append(player_details)

    for player in list:
        if player["Team"] == "Blue":
            match_details["blue_team_details"].append(player)
        else:
            match_details["red_team_details"].append(player)
    return jsonify(match_details)


def main():
    app.run(debug=True)


if __name__ == "__main__":
    main()
