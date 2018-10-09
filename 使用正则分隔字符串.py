import re


def split_text(text):
    # 按照中英文分号隔开，返回数组
    pattern = r';|；'
    result_list = re.split(pattern, text)
    return result_list
text = 'sdf;dsf;sdf；水电费'
print(split_text(text))
