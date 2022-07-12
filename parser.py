import re


def parse_vue_content(text: str):
    print("h2h")
    return re.match(r"<template>(.|\s)*?<\/template>", text, re.MULTILINE)
