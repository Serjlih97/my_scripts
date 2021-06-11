_dir="$(dirname $0)"

function _my_complite {
    local line

    declare -a files

    for file in $_dir/_*.bash
    do
        filename=$(basename -- "$file")
        filename="${filename%.*}"
        filename="$(echo $filename | sed 's/^_//g')"
        files=("${files[@]}" "$filename")
    done

    _arguments -C \
        "1: :(${files[*]})" \
        "*::arg:->args"

    if [ -z "$line[1]" ]; then
        return 1
    fi

    if [ ! -f $_dir/_$line[1].bash ]; then
        return 1
    fi

    if [ ! -z "$(command -v _my_$line[1]_complite)" ]; then
        res="$(_my_$line[1]_complite "${line[@]:1}")"

        while read -r line; do
            _arguments \
                $line;
        done <<<"$res"
    fi
}

compdef _my_complite my