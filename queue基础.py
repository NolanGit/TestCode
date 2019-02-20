import queue
print('start')

q = queue.Queue()
q.put({'a':1})
print(q.qsize())
aa=q.get()
print(aa)
