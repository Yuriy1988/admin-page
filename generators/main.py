import subprocess
import json
import sys


def run_process(exe):
    p = subprocess.Popen(exe, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while True:
        ret_code = p.poll()  # returns None while subprocess is running
        line = p.stdout.readline().decode()
        yield line
        if ret_code is not None:
            break


def try_parse(json_string):
    try:
        return json.loads(json_string)
    except json.JSONDecodeError:
        return None


def get_objects(exe):
    lines = run_process(exe.split())
    return list(filter(lambda item: item is not None, map(try_parse, lines)))

print(get_objects("node index.js"))

