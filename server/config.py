import os
import requests
import base64
from requests.api import head

import urllib3  # type: ignore
from werkzeug.wrappers import response

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class Setup:
    @staticmethod
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
    def get_current_version():
        response = requests.get("https://valorant-api.com/v1/version", verify=False)
        res_json = response.json()
        client_version = res_json['data']['riotClientVersion']
        return client_version


def get_region():
    local_headers = {'Authorization': 'Basic ' +
                     base64.b64encode(('riot:' + lockfile['password']).encode()).decode()}
    response = requests.get(
        f"https://127.0.0.1:{lockfile['port']}/product-session/v1/external-sessions", headers=local_headers, verify=False)
    res_json = response.json()
    return list(res_json.values())[0]['launchConfiguration']['arguments'][3].split("=")[1]


def get_headers():
    global headers
    try:
        if headers == {}:
            global puuid
            local_headers = {'Authorization': 'Basic ' +
                             base64.b64encode(('riot:' + lockfile['password']).encode()).decode()}
            response = requests.get(
                f"https://127.0.0.1:{lockfile['port']}/entitlements/v1/token", headers=local_headers, verify=False)
            entitlements = response.json()
            puuid = entitlements['subject']
            headers = {
                'Authorization': f"Bearer {entitlements['accessToken']}",
                'X-Riot-Entitlements-JWT': entitlements['token'],
                'X-Riot-ClientPlatform': "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                'X-Riot-ClientVersion': Setup.get_current_version()
            }
        return headers
    except ConnectionRefusedError:
        print("You don't seem to be logged in...")
        exit(1)


def get_content(region):
    response = requests.get(
        f"https://shared.{region}.a.pvp.net/content-service/v2/content", headers=headers, verify=False)
    return response.json()


def get_latest_season_id(content):
    for season in content["Seasons"]:
        if season["IsActive"]:
            return season["ID"]


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


def get_match_id(region, puuid):
    response = requests.get(
        f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/players/{puuid}", headers=headers, verify=False)
    try:
        if response.ok:
            r = response.json()
            subject = r["Subject"]
            match_id = r["MatchID"]
            return match_id
        else:
            print("Could not find active game.")
    except requests.exceptions.RequestException as e:
        print('Error retrieving game')
        raise SystemExit(e)


def get_ongoing_match(region, match_id):
    response = requests.get(
        f"https://glz-{region}-1.{region}.a.pvp.net/core-game/v1/matches/{match_id}", headers=headers, verify=False)
    try:
        if response.ok:
            r = response.json()
            return r
        else:
            print("Could not find active game.")
    except requests.exceptions.RequestException as e:
        print('Error retrieving game')
        raise SystemExit(e)


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


number_to_ranks = [
    'Unrated',
    'Unrated',
    'Unrated',
    'Iron 1',
    'Iron 2',
    'Iron 3',
    'Bronze 1',
    'Bronze 2',
    'Bronze 3',
    'Silver 1',
    'Silver 2',
    'Silver 3',
    'Gold 1',
    'Gold 2',
    'Gold 3',
    'Platinum 1',
    'Platinum 2',
    'Platinum 3',
    'Diamond 1',
    'Diamond 2',
    'Diamond 3',
    'Immortal 1',
    'Immortal 2',
    'Immortal 3',
    'Radiant'
]

map_puuids = {
    "Ascent": "7eaecc1b-4337-bbf6-6ab9-04b8f06b3319",
    "Bonsai": "d960549e-485c-e861-8d71-aa9d1aed12a2",
    "Canyon": "b529448b-4d60-346e-e89e-00a4c527a405",
    "Duality": "2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba",
    "Foxtrot": "2fb9a4fd-47b8-4e7d-a969-74b4046ebd53",
    "Port": "e2ad5c54-4114-a870-9641-8ea21279579a",
    "Range": "ee613ee9-28b7-4beb-9666-08db13bb2244",
    "Triad": "2bee0dc9-4ffe-519b-1cbd-7fbe763a6047"
}

puuid = ''
headers = {}
lockfile = Setup.get_lockfile()
headers = get_headers()
region = get_region()
content = get_content(region)
seasonID = get_latest_season_id(content)
player_name = get_player_name(region, puuid)
