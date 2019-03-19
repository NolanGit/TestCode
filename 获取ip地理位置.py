from geolite2 import geolite2
reader = geolite2.reader()
print(reader.get('221.216.189.218'))
geolite2.close()