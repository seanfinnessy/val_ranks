import os
import requests
import base64
import pprint
import logging
from requests.api import head

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def get_region():
    local_headers = {'Authorization': 'Basic ' +
                     base64.b64encode(('riot:' + lockfile['password']).encode()).decode()}
    response = requests.get(
        f"https://127.0.0.1:{lockfile['port']}/product-session/v1/external-sessions", headers=local_headers, verify=False)
    res_json = response.json()
    return list(res_json.values())[0]['launchConfiguration']['arguments'][3].split("=")[1]


# When the game is running, the lockfile is located at %LocalAppData%\Riot Games\Riot Client\Config\lockfile.
# Lockfile contains the info needed to connect to the local api.
# It's a text file with a single line where the data is seperated by colons. The format is name:pid:port:password:protocol.
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


def get_current_version():
    response = requests.get(
        "https://valorant-api.com/v1/version", verify=False)
    res_json = response.json()
    client_version = res_json['data']['riotClientVersion']
    return client_version


def get_headers():
    global headers
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
            'X-Riot-ClientVersion': get_current_version()
        }
    return headers


def get_content(region):
    response = requests.get(
        f"https://shared.{region}.a.pvp.net/content-service/v2/content", headers=headers, verify=False)
    return response.json()


def get_latest_season_id(content):
    for season in content["Seasons"]:
        if season["IsActive"]:
            return season["ID"]


def get_store():
    response = requests.get(
        f"https://pd.{region}.a.pvp.net/store/v2/storefront/{puuid}", headers=headers, verify=False)
    store_info = response.json()
    # returns skin levels uuid. use https://valorant-api.com/v1/weapons/skinlevels/uuid for more info
    single_item_offers = store_info['SkinsPanelLayout']['SingleItemOffers']


def get_player_mmr(region, player_id, seasonID):
    response = requests.get(
        f"https://pd.{region}.a.pvp.net/mmr/v1/players/{player_id}", headers=headers, verify=False)
    try:
        if response.ok:
            print("Rank gotten successfully.")
            r = response.json()
            rankTIER = r["QueueSkills"]["competitive"]["SeasonalInfoBySeasonID"][seasonID]["CompetitiveTier"]
            print(rankTIER)
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
    return [rank]

puuid = ''
headers = {}
lockfile = get_lockfile()
get_headers()
region = get_region()
get_store()
content = get_content(region)
seasonID = get_latest_season_id(content)
rank = get_player_mmr(region, puuid, seasonID)
print(rank)