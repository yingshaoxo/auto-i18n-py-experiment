from auto_everything import Disk, IO, Terminal
from auto_everything.disk import Store
import re
import json

# import chinese_converter
from pygtrans import Translate

client = Translate(proxies={"https": "http://localhost:7890"})

disk = Disk()
io = IO()
t = Terminal()
store = Store("haitao_translate")


source_folder = "/Users/yingshaoxo/CS/haitao"
target_folder = "/Users/yingshaoxo/CS/haitao_en"


t.run_command(
    f"""
rm -Rf "{target_folder}"

mkdir -p "{target_folder}"

cp -fR {source_folder}/* {target_folder}/
""".strip()
)


files = disk.get_files(
    f"{target_folder}/src", type_limiter=[".ts", ".js", ".vue", ".json"]
)


def get_words(text):
    old_list = list(re.findall(r"[\u2e80-\u9fff]+", text))
    return old_list


def translation(text):
    def convert_func(matchobj):
        word =  matchobj.group(0)
        # return chinese_converter.to_traditional(word)
        return store.get(word, word)

    text =  re.sub(r"[\u2e80-\u9fff]+", convert_func, text)

    return text


words_list = []
for file in files:
    text = io.read(file)
    sub_list = get_words(text)
    words_list = list(set(words_list + sub_list))


words_list_backup = words_list.copy()
new_list = []
for word in words_list_backup:
    value = store.get(word, "")
    if value.strip() == "":
        # print("hi", word)
        new_list.append(word)
words_list = new_list


words_list_translation = client.translate(words_list, source="zh-TW", target="en")
for index, word in enumerate(words_list):
    translated = words_list_translation[index].translatedText
    print(word, translated)
    store.set(word, translated)


for file in files:
    text = io.read(file)
    result = translation(text)

    io.write(file, result)
