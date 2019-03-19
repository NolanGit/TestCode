import sys

target_item = ''


def generate_list(i):
    target_list=list(range(i+1))
    target_list.pop(0)
    return target_list


def pop_item(list):
    global target_item

    for x in range(len(list) + 1):
        try:

            if x == 0:
                target_item = target_item + str(list.pop(0))
            else:
                target_item = target_item + ' ' + str(list.pop(0))

            second_item = list.pop(0)
            list = list + [second_item]

        except:
            pass

        x += 1
        
    return target_item


if __name__ == '__main__':
    list = generate_list(int(sys.stdin.readline()))
    target_item = pop_item(list)
    print(target_item)