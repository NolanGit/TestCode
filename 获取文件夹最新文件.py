import os


def new_report(root_dir):
    lists = os.listdir(root_dir)  # 列出目录的下所有文件和文件夹保存到lists
    lists.sort(key=lambda fn: os.path.getmtime(root_dir + '\\' + fn))  # 按时间排序
    file_new = os.path.join(root_dir, lists[-1])  # 获取最新的文件保存到file_new
    print(file_new)
    return file_new
if __name__ == "__main__":
    root_dir = "C:\\Users\\sunhaoran\\OneDrive\\OneDrive工作\\月工作量统计"  # 目录地址
    print(root_dir)
    new_report(root_dir)
