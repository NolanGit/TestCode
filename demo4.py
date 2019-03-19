import sys

def get_number(n, m):
    white_temp = (n / 2) * (m / 2) / 2
    black_temp = (n / 2) * (m / 2) / 2
    if n % 2 == 1 and m % 2 == 0:
        white_temp2 = m / 2
        black_temp2 = m / 2
    if n % 2 == 0 and m % 2 == 1:
        white_temp2 = n / 2
        black_temp2 = n / 2
    if n % 2 == 1 and m % 2 == 1:
        white_temp2 = m / 2 + n / 2 + 1
        black_temp2 = m / 2 + n / 2
    return(white_temp+white_temp2,black_temp+black_temp2)

def draw_white(x0,y0,x1,y1):
    white_blocks=(x1-x0)*(y1-y0)
    return abs(white_blocks)

def draw_black(x0,y0,x1,y1):
    black_blocks=(x1-x0)*(y1-y0)
    return abs(black_blocks)

if __name__ == '__main__':
    s = sys.stdin.readline().strip()
    s=int(s)
    for s in range(s):
        s = sys.stdin.readline().strip()
        l = list(map(int, s.split()))
        n, m = l[0], l[1]
        white,black = get_number(n,m)

        s = sys.stdin.readline().strip()
        l = list(map(int, s.split()))
        x0,y0,x1,y1 = l[0], l[1],l[2], l[3]
        

        s = sys.stdin.readline().strip()
        l = list(map(int, s.split()))
        x2,y2,x3,y3 = l[0], l[1],l[2], l[3]
        duplicate_area=0
        if (((x1-x2)>0) and ((y1-y2)>0) and ((x3-x1)>0) and ((y3-y1)>0) and ((x2-x0)>0) and ((y2-y0)>0))or(((x1-x2)<0) and ((y1-y2)<0) and ((x3-x1)<0) and ((y3-y1)<0) and ((x2-x0)<0) and ((y2-y0)<0)):
            duplicate_area=abs((x1-x2)*(y1-y2))
        
        white_blocks = draw_white(x0,y0,x1,y1)-duplicate_area
        black_blocks = draw_black(x2,y2,x3,y3)

        white=white+white_blocks
        black=black+white_blocks
        print(str(white)+' '+str(black))