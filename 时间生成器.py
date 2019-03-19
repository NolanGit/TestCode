import time
import datetime
ymd = time.strftime('%Y%m%d', time.localtime(time.time()))
print(ymd)

log_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
print(datetime.datetime.now())