import queue


q = queue.Queue()
# q.put(None)
result = list()
if q.get() == None:
    print('none')
result.append(q.get())
print('1')
