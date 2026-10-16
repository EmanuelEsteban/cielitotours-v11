import csv, json, unicodedata, re
def norm(s): return re.sub(r'\s+',' ',''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')).strip()
latin=re.compile(r"^[A-Za-zÀ-ÿĀ-žḀ-ỿ' .\-()]+$")
# airports
ap=[]
for r in csv.DictReader(open('airports.csv',encoding='utf-8')):
  iata=(r['iata_code'] or '').strip().upper()
  if r['type'] not in ('large_airport','medium_airport','small_airport') or r['type']=='closed': continue
  if not re.fullmatch(r'[A-Z]{3}',iata): continue
  sched=r['scheduled_service']=='yes'
  if r['type']=='small_airport' and not sched: continue
  icao=(r['icao_code'] or '').strip().upper()
  if not re.fullmatch(r'[A-Z]{4}',icao): icao=''
  kw=[k.strip() for k in (r['keywords'] or '').split(',') if k.strip() and latin.match(k.strip()) and len(k.strip())<40][:4]
  rank={'large_airport':0,'medium_airport':1,'small_airport':2}[r['type']]
  ap.append([iata,icao,r['name'].strip(),(r['municipality'] or '').strip(),r['iso_country'],r['iso_region'],1 if sched else 0,rank,'|'.join(kw)])
ap.sort(key=lambda a:(-a[6],a[7],a[0]))
json.dump(ap,open('airports.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
# cities
adm={}
for l in open('admin1CodesASCII.txt',encoding='utf-8'):
  p=l.rstrip('\n').split('\t'); adm[p[0]]=p[1]
ct=[]
for l in open('cities15000.txt',encoding='utf-8'):
  p=l.rstrip('\n').split('\t')
  name=p[1]; base=norm(name); alts=[]; seen={base,norm(p[2])}
  for a in p[3].split(','):
    a=a.strip()
    if not a or len(a)>40 or not latin.match(a): continue
    n=norm(a)
    if n in seen or len(n)<3: continue
    seen.add(n); alts.append(a)
    if len(alts)>=5: break
  ct.append([int(p[0]),name,p[8],adm.get(f"{p[8]}.{p[10]}",''),int(p[14] or 0),'|'.join(alts)])
ct.sort(key=lambda c:-c[4])
json.dump(ct,open('cities.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(ap),sum(a[6] for a in ap),len(ct))
