from auto_everything import Disk
from auto_everything import IO
import re
import chinese_converter

disk = Disk()
io = IO()

files = disk.get_files('.', )


def translation(text):
  for n in re.findall(r'[\u4e00-\u9fff]+', text):
    new = chinese_converter.to_traditional(n)
    print(new)
    text = text.replace(n, new)
  return text


for file in files:
  text = io.read(file)
  result = translation(text)
  if (file[-2:] == "js" or file[-2:] == "ts" or file[-3:] == "vue" or file[-4:] == "json"):
    #io.write(file, result)
    pass




# from auto_everything import Disk
# from auto_everything import IO
# import re
# from opencc import OpenCC

# disk = Disk()
# io = IO()
# cc = OpenCC('s2t')

# files = disk.get_files('.', )

# _scan_chinese_re = re.compile(r'[\u4e00-\u9fff]+')

# def translator(chinese_text):
#     """My no good translator"""
#     result = ' '.join(cc.convert(old_char) for old_char in chinese_text)
#     # print(result)
#     return result

# def scanner(text):
#     """Scan text string, translate chinese and return copy"""
#     # print('----> text:', text)

#     # list of extents where chinese text is found
#     chinese_inserts = [] # [start, end]

#     # keep scanning text to end
#     index = 0
#     while index < len(text):
#         m = _scan_chinese_re.search(text[index:])
#         if not m:
#             break
#         # get extent from match object and add to list
#         start = index + m.start()
#         end = index + m.end()
#         #print('chinese at index', start, text[start:end])
#         chinese_inserts.append([start, end])
#         index += end

#     # copy string and replace backwards so we don't mess up indexes
#     copy = list(text)
#     while chinese_inserts:
#         start, end = chinese_inserts.pop()
#         copy[start:end] = translator(text[start:end])
#     text = ''.join(copy)
#     # print('final', text)
#     return text


# for file in files:
#   text = io.read(file)
#   result = scanner(text)
#   io.write(file, result)
#   # print(len(text))
#   # print(utf_translated)