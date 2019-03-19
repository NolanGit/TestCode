import sys

if __name__ == "__main__":
    s1 = sys.stdin.readline().strip()
    l = list(map(int, s1.split()))
    print(str(l))
    n, a = l[0], l[1]
    s2 = sys.stdin.readline()
    x = list(map(int, s2.split(' ')))
    print(str(x))
    times = 1
    long = 0
    dic = {}
    while times < n:
        for i in x:
            if a != i:
                cha = abs(a - i)
                dic[i] = cha
        minx = min(dic.values())
        long += minx
        for key, value in dic.items():
            if value == minx:
                a = key
        times += 1
    print(long)