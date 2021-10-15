import os
import requests
import base64
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
            print("Lockfile not found, you're not in a game!")
            exit(1)

    @staticmethod
    # Arguments needed: none
    def get_current_version():
        response = requests.get("https://valorant-api.com/v1/version", verify=False)
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
            response = requests.get(f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/players/{puuid}", headers=self.headers, verify=False)
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
                    game_mode_in_ongoing_match = "Custom"
                else:
                    game_mode_in_ongoing_match = r["MatchmakingData"]["QueueID"]
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

# Arguments needed: headers
def get_latest_season_id(region):
    response = requests.get(
        f"https://shared.{region}.a.pvp.net/content-service/v2/content", headers=headers, verify=False)
    content = response.json()
    for season in content["Seasons"]:
        if season["IsActive"]:
            return season["ID"]

# Arguments needed: headers
def get_player_mmr(region, player_id, seasonID):
    response = requests.get(
        f"https://pd.{region}.a.pvp.net/mmr/v1/players/{player_id}", headers=headers, verify=False)
    keys = ['CurrentRank', 'RankRating', 'Leaderboard']
    try:
        if response.ok:
            r = response.json()
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
    except TypeError:
        rank = [0, 0, 0]
    except KeyError:
        rank = [0, 0, 0]
    return (dict(zip(keys, rank)))

# Arguments needed: headers
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

lockfile = GameSetup.get_lockfile()
headers, puuid = LocalSetup(lockfile=lockfile).get_headers()
region = LocalSetup(lockfile=lockfile).get_region()
seasonID = get_latest_season_id(region=region)
player_name = get_player_name(region, puuid)
