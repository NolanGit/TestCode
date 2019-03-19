def func(my_data):
    my_data.strip()
    test_point=int(my_data[:1])
    data=[]
    data_count=0
    last_data_count=0
    for x in range(test_point):
        data_count=int(my_data[(1+x+x*data_count*4):(2+x+x*data_count*4)])
        if last_data_count==0:
            last_data_count=data_count
        data.append(my_data[(2+x+x*last_data_count*4):(2+x+(x+1)*last_data_count*4)])
        last_data_count=data_count
    final_data=[]
    for x in range(len(data)):
        final_data=[]
        for y in range(int(len(data[x])/4)):
            final_data.append(data[x][4*y:4*(y+1)])
        get_result(final_data)

def positive_number(x):
    x= int(x)
    if x<0:
        return (0-x)
    else:
        return x

def get_result(my_dict):
    times=(int(len(my_dict)))
    s=0
    for x in(range(times-1)):
        for y in (range(times-x-1)):
            x0=int(my_dict[x][0:1])
            x1=int(my_dict[x][1:2])
            y0=int(my_dict[x][2:3])
            y1=int(my_dict[x][3:4])
            x01=int(my_dict[x+1+y][0:1])
            x11=int(my_dict[x+1+y][1:2])
            y01=int(my_dict[x+1+y][2:3])
            y11=int(my_dict[x+1+y][3:4])
            if x01>x1 and x01<x11 and y01>y0 and y11>y01:
                l1=positive_number(x1-x0)
                l2=positive_number(y1-y0)
                l3=positive_number(x11-x01)
                l4=positive_number(y11-y01)
                s=s+l1*l2+l3*l4
    print(s)
func('2400221143244725363001111221021')