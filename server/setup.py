import os
import requests
import base64
from conversions import number_to_ranks, rank_icons
from requests.api import head

import urllib3  # type: ignore
from werkzeug.wrappers import response

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class GameSetup:
    @staticmethod
    # Arguments needed: none
    def get_lockfile():
        try:
            with open(os.path.join(os.getenv('LOCALAPPDATA'), R'Riot Games\Riot Client\Config\lockfile')) as lockfile:
                data = lockfile.read().split(':')
                keys = ['name', 'PID', 'port', 'password', 'protocol']
                # dict constructor and zip function used to create dict with lockfile data.
                return (dict(zip(keys, data)))
        except FileNotFoundError:
            print("Lockfile not found, you're not not logged into the game!")
            exit(1)

    @staticmethod
    # Arguments needed: none
    def get_current_version():
        response = requests.get(
            "https://valorant-api.com/v1/version", verify=False)
        res_json = response.json()
        client_version = res_json['data']['riotClientVersion']
        return client_version


class LocalSetup:
    def __init__(self, lockfile) -> None:
        self.lockfile = lockfile

    # Arguments needed: lockfile
    def get_region(self):
        local_headers = {'Authorization': 'Basic ' +
                         base64.b64encode(('riot:' + self.lockfile['password']).encode()).decode()}
        response = requests.get(
            f"https://127.0.0.1:{self.lockfile['port']}/product-session/v1/external-sessions", headers=local_headers, verify=False)
        res_json = response.json()
        return list(res_json.values())[0]['launchConfiguration']['arguments'][3].split("=")[1]

    # Arguments needed: lockfile
    def get_headers(self):
        try:
            local_headers = {'Authorization': 'Basic ' +
                             base64.b64encode(('riot:' + self.lockfile['password']).encode()).decode()}
            response = requests.get(
                f"https://127.0.0.1:{self.lockfile['port']}/entitlements/v1/token", headers=local_headers, verify=False)
            entitlements = response.json()
            puuid = entitlements['subject']
            headers = {
                'Authorization': f"Bearer {entitlements['accessToken']}",
                'X-Riot-Entitlements-JWT': entitlements['token'],
                'X-Riot-ClientPlatform': "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                'X-Riot-ClientVersion': GameSetup.get_current_version()
            }
            return headers, puuid
        except ConnectionRefusedError:
            print("You don't seem to be logged in...")
            exit(1)


class LobbySetup:
    def __init__(self, headers):
        self.headers = headers

    # Arguments needed: headers
    def get_match_id(self, region, puuid):
        try:
            response = requests.get(
                f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/players/{puuid}", headers=self.headers, verify=False)
            if response.ok:
                r = response.json()
                match_id = r["MatchID"]
                return match_id
        except requests.exceptions.RequestException as e:
            print('Error retrieving match_id.')
            raise SystemExit(e)

    # Arguments needed: headers, region
    def get_ongoing_match(self, region, match_id):
        try:
            response = requests.get(
                f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/matches/{match_id}", headers=self.headers, verify=False)
            if response.ok:
                r = response.json()
                players = r["Players"]
                # Get all PUUIDs in lobby
                player_dict = {"puuid": [], "agent": [], "team": []}
                for player in players:
                    player_dict["puuid"].append(player["Subject"])
                    player_dict["agent"].append(player["CharacterID"])
                    player_dict["team"].append(player["TeamID"])
                map = str(r["MapID"]).rsplit("/", 1)[1]
                if r["ProvisioningFlow"] == "CustomGame":
                    game_mode_in_ongoing_match = "Custom".upper()
                else:
                    game_mode_in_ongoing_match = str(
                        r["MatchmakingData"]["QueueID"]).upper()
                return player_dict, map, game_mode_in_ongoing_match
            else:
                print("Could not find active game.")
        except requests.exceptions.RequestException as e:
            print('Error retrieving ongoing match.')
            raise SystemExit(e)

    # Arguments needed: none
    @staticmethod
    def get_map_details(mapUuid):
        response = requests.get(f"https://valorant-api.com/v1/maps/{mapUuid}")
        try:
            if response.ok:
                r = response.json()
                return r["data"]
            else:
                print("Could not find map details.")
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)

    @staticmethod
    def create_player_details(player_dict, region, seasonID, match_details, match_uuid):
        list = []
        for playerId, agentId, teamId in zip(player_dict["puuid"], player_dict["agent"], player_dict["team"]):
            # Get player details
            player_details = get_player_name(region, playerId)
            # Get player ranks
            rank, winRatio = get_player_mmr(region, playerId, seasonID)
            rank["WinLossRatio"] = winRatio
            # convert rank number to actual rank
            rank["CurrentRank"] = number_to_ranks[rank["CurrentRank"]]
            # get rank icons
            rank["RankIcon"] = rank_icons[rank["CurrentRank"]]
            # Assign player their rank info
            player_details["RankInfo"] = rank
            # Assign player their agent details
            agent_details = get_agent_details(agentId)
            # Get loadout of player
            vandalType, phantomType = get_loadouts(match_id=match_uuid, region=region, agentUuid=agentId)
            player_details["AgentName"] = agent_details["displayName"]
            player_details["AgentIcon"] = agent_details["displayIcon"]
            player_details["Team"] = teamId
            player_details["VandalType"] = vandalType
            player_details["PhantomType"] = phantomType
            list.append(player_details)

        for player in list:
            if player["Team"] == "Blue":
                match_details["blue_team_details"].append(player)
            else:
                match_details["red_team_details"].append(player)
        return match_details

def get_latest_season_id(region):
    try:
        response = requests.get(
            f"https://shared.{region}.a.pvp.net/content-service/v2/content", headers=headers, verify=False)
        content = response.json()
        for season in content["Seasons"]:
            if season["IsActive"]:
                return season["ID"]
    except:
        NameError("Must be in an active game.")

def get_player_mmr(region, player_id, seasonID):
    response = requests.get(
        f"https://pd.{region}.a.pvp.net/mmr/v1/players/{player_id}", headers=headers, verify=False)
    keys = ['CurrentRank', 'RankRating', 'Leaderboard']
    try:
        if response.ok:
            r = response.json()
            if r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID] or r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["NumberOfWinsWithPlacements"] != 0:
                numberOfWins = r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["NumberOfWinsWithPlacements"]
                numberOfGames = r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["NumberOfGames"]
                winPercent = (int(numberOfWins) / int(numberOfGames)) * 100
            else:  
                winPercent = 0
            rankTIER = r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["CompetitiveTier"]
            if int(rankTIER) >= 21:
                rank = [rankTIER,
                        r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["RankedRating"],
                        r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["LeaderboardRank"],
                        ]
            elif int(rankTIER) not in (0, 1, 2, 3):
                rank = [rankTIER,
                        r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["RankedRating"],
                        0,
                        ]
            else:
                rank = [0, 0, 0]
        else:
            print("failed getting rank")
            rank = [0, 0, 0]
            winPercent = 0
    except TypeError:
        rank = [0, 0, 0]
        winPercent = 0
    except KeyError:
        rank = [0, 0, 0]
        winPercent = 0
    return dict(zip(keys, rank)), winPercent

def get_player_name(region, player_id):
    response = requests.put(
        f"https://pd.{region}.a.pvp.net/name-service/v2/players", headers=headers, json=[player_id], verify=False)
    try:
        if response.ok:
            r = response.json()
            game_name = [r[0]['GameName'], r[0]['TagLine']]
            return (dict(zip(['GameName', 'TagLine'], game_name)))
    except requests.exceptions.RequestException as e:
        print('Could not find a user with this player id.')
        raise SystemExit(e)

# Arguments needed: none


def get_agent_details(agentUuid):
    try:
        response = requests.get(
            f"https://valorant-api.com/v1/agents/{agentUuid}")
        if response.ok:
            r = response.json()
            return r["data"]
        else:
            print("Could not get agent details")
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

def get_loadouts(match_id, region, agentUuid):
    try:
        response = requests.get(f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/matches/{match_id}/loadouts", headers=headers, verify=False)
        if response.ok:
            r = response.json()
            agentLoadout = next(filter(lambda x: x["CharacterID"] == agentUuid, r["Loadouts"]), None)
            # Vandal: "9c82e19d-4575-0200-1a81-3eacf00cf872"
            # Phantom: "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a"
            # Skin type socket: "bcef87d6-209b-46c6-8b19-fbe40bd95abc"
            # ID returns the skin uuid
            vandalSkinUuid = agentLoadout["Loadout"]["Items"]["9c82e19d-4575-0200-1a81-3eacf00cf872"]["Sockets"]["bcef87d6-209b-46c6-8b19-fbe40bd95abc"]["Item"]["ID"]
            phantomSkinUuid = agentLoadout["Loadout"]["Items"]["ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a"]["Sockets"]["bcef87d6-209b-46c6-8b19-fbe40bd95abc"]["Item"]["ID"]
        else:
            print("Could not get loadout details.")
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    try:
        vandalResponse = requests.get(f"https://valorant-api.com/v1/weapons/skins/{vandalSkinUuid}")
        phantomResponse = requests.get(f"https://valorant-api.com/v1/weapons/skins/{phantomSkinUuid}")
        if vandalResponse.ok and phantomResponse.ok:
            rV = vandalResponse.json()
            rP = phantomResponse.json()
            vandalRenderUrl = rV["data"]["chromas"][0]["fullRender"]
            phantomRenderUrl = rP["data"]["chromas"][0]["fullRender"]
            return vandalRenderUrl, phantomRenderUrl
        else:
            # If cannot retrieve skin, send default skins instead.
            return "https://media.valorant-api.com/weaponskinchromas/19629ae1-4996-ae98-7742-24a240d41f99/fullrender.png", "https://media.valorant-api.com/weaponskinchromas/52221ba2-4e4c-ec76-8c81-3483506d5242/fullrender.png"
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)


lockfile = GameSetup.get_lockfile()
headers, puuid = LocalSetup(lockfile=lockfile).get_headers()
region = LocalSetup(lockfile=lockfile).get_region()
seasonID = get_latest_season_id(region=region)
player_name = get_player_name(region, puuid)
