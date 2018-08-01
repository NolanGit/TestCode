import random
a = [random.randint(0, 100) for x in range(10)]
print(a)
for i in range(len(a) - 1):
    for j in range(len(a) - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
        else:
            pass
print(a)
