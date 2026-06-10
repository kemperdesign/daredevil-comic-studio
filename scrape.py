import requests
from bs4 import BeautifulSoup
import json
import re

url = "https://comicbookreadingorders.com/marvel/characters/daredevil-reading-order/"
headers = {'User-Agent': 'Mozilla/5.0'}
r = requests.get(url, headers=headers)
soup = BeautifulSoup(r.text, 'html.parser')

entry = soup.find('div', class_='entry-content')
if not entry:
    print("Could not find entry-content")
    exit(1)

issues = []
for el in entry.find_all(text=True):
    line = el.strip()
    if not line: continue
    # check if it looks like a comic
    if '#' in line or 'Vol.' in line or 'Daredevil' in line:
        line = re.sub(r'Read Order.*', '', line)
        line = re.sub(r'Note:.*', '', line)
        if len(line) > 3 and len(line) < 100:
            if line not in issues:
                issues.append(line)

print(f"Found {len(issues)} potential issues")
with open('raw_list.json', 'w', encoding='utf-8') as f:
    json.dump(issues, f, indent=2)
