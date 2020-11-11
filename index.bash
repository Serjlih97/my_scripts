#!/bin/bash

_dir="$(dirname $0)"

for file in $_dir/*.bash
do
    filename=$(basename -- "$file")
    if [ "$filename" = "index.bash" ] || [ "$filename" = "complite.bash" ]; then
        continue
    fi
    source $file
done

function my()
{
    if [ -z "$1" ]; then
        echo 'Wrong params'
        return 1
    fi

    if [ ! -f $_dir/_$1.bash ]; then
        echo 'Wrong command name'
        return 1
    fi

    _my_$1 "${@:2}"
    return $?
}

source $_dir/complite.bash