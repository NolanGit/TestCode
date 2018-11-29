'''

import sys, time

for i in range(5):
    sys.stdout.write('{0}/5\r'.format(i + 1))
    sys.stdout.flush()
    time.sleep(1)
print("="*10)
a=[[1,2],3,[4,5]]
print(a[0])
print(a[1])


import time
import sys
 
for i in range(5):
    sys.stdout.write(str(i))
    #sys.stdout.flush()
    time.sleep(1)

'''
import sys, time

for i in range(10):
    sys.stdout.write('{0}{1}{2}\r'.format('[','▇'*i,' '*(9-i)+'  ]'))
    sys.stdout.flush()
    time.sleep(1)
