import csv,json,collections,hashlib
from pathlib import Path
root=Path(__file__).parent
rows=list(csv.DictReader((root/'source.csv').read_text(encoding='utf-8-sig').splitlines()))
def minutes(s):
 s=s.strip().zfill(4); h,m=int(s[:2]),int(s[2:]); assert 0<=h<48 and 0<=m<60; return h*60+m
routes={}; rejected=[]
for i,r in enumerate(rows):
 try:
  lat,lng=float(r['緯度']),float(r['經度']); a,b=minutes(r['抵達時間']),minutes(r['離開時間'])
  assert 24.8<lat<25.3 and 121.3<lng<121.8 and b>=a
 except Exception:
  rejected.append(i);continue
 key='|'.join(r[k].strip() for k in ['行政區','局編','車號','路線','車次'])
 route=routes.setdefault(key,{'id':hashlib.sha256(key.encode()).hexdigest()[:12],'district':r['行政區'],'name':r['路線'],'trip':r['車次'],'plate':r['車號'],'stops':[]})
 route['stops'].append({'id':str(i),'address':r['地點'],'lat':lat,'lng':lng,'arrival':a,'departure':b})
for route in routes.values():route['stops'].sort(key=lambda s:s['arrival'])
data={'updated':'2026-09-21','source':'https://data.taipei/dataset/detail?id=6bb3304b-4f46-4bb0-8cd1-60c66dcd1cae','originalCount':len(rows),'omitted':len(rejected),'routes':list(routes.values())}
(root/'dist/data.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print(json.dumps({'routes':len(routes),'stops':sum(len(r['stops']) for r in routes.values()),'omitted':rejected}))
