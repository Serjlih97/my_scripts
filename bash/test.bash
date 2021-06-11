#!/bin/bash


# _dir="$(dirname $0)"
# tmpFile="$_dir/tmp/namespaces"
# if [[ -f "$tmpFile" ]]; then
#     echo 'tmp'
#     namespaces="$(cat $tmpFile)"
# else
#     comand="kubectl get ns --no-headers -o custom-columns=NAME:.metadata.name"
#     namespaces="$(bash -c $comand)"
#     echo "$namespaces" > $tmpFile
# fi
# namespaces="$(cat $_dir/tmp/namespaces)"
# comand="kubectl get ns --no-headers -o custom-columns=NAME:.metadata.name"
# namespaces="$(bash -c $comand)"
# echo "$namespaces" > $_dir/tmp/namespaces
# echo $namespaces
# source $_dir/helpers.bash
# data=( "auth-service" "panel" "db_betserk" "db_stories" "pgmigrate" "mysql" "crm" "kz_site" "db_rand" "kz_db_game" "rabbit" "clickhouse" "digitain_cupis" "redis" "db_crm" )
# unset 'data[${#data[@]}-1]'
# echo "${data[@]}"
# args=( "${@}" );
# for container in ${data[*]}
# do
#     if _check_in_array "$container" "${args[@]::${#args[@]}-1}"; then
#     # if _check_in_array "$container" "${[@]::${#[@]}-1}"; then
#         continue
#     fi

#     containers=("${containers[@]}" "$container")
# done

# for (( i=1; i<=$(( $# )); i++ ))
# do
#     echo "$i: :(${containers[*]})"
# done
