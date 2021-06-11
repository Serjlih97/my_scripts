#!/bin/bash

_my_docker() {
    if [ -z "$1" ]; then
        echo 'Wrong params'
        return 1
    fi

    if [ -z "$(command -v _my_docker_$1)" ]; then
        echo "Param '$1' not exist"
        return 1
    fi

    _my_docker_$1 "${@:2}"

    return $?
}

_my_docker_status() {
    containers=($(_get_docker_containers run))

    for container in $containers
    do
        echo -e "\e[92m$container\e[0m"
    done

    containers=($(_get_docker_containers noRun))

    for container in $containers
    do
        echo $container
    done
}

_my_docker_start() {
    docker start "$@"
}

_my_docker_stop() {
    docker stop "$@"
}

_my_docker_exec() {
    docker exec -it $1 bash
}

_my_docker_restart() {
    docker restart "$@"
}

_my_docker_logs() {
    if [ -z "$1" ]; then
        echo 'Wrong container name'
        return 1
    fi

    docker logs "$@"
}

# complite

_my_docker_complite() {
    local params

    subCommands=("status" "start" "stop" "exec" "restart" "logs")

    echo "1: :(${subCommands[*]})"
    echo "*::arg:->args"

    if _check_in_array "$1" "${subCommands[@]}"; then
        if [ ! -z "$(command -v _my_docker_$1_complite)" ]; then
            _my_docker_$1_complite "${line[@]:2}"
        fi
    fi
}

_my_docker_start_complite() {
    declare -a containers

    args=( "${@}" )

    unset 'args[-1]'

    for container in $(_get_docker_containers noRun)
    do
        if _check_in_array "$container" "${args[@]}"; then
            continue
        fi

        containers=("${containers[@]}" "$container")
    done

    for (( i=1; i<=$(( $# )); i++ ))
    do
        echo "$i: :(${containers[*]})"
    done
}

_my_docker_stop_complite() {
    declare -a containers

    args=( "${@}" )

    unset 'args[-1]'

    for container in $(_get_docker_containers run)
    do
        if _check_in_array "$container" "${args[@]}"; then
            continue
        fi

        containers=("${containers[@]}" "$container")
    done

    for (( i=1; i<=$(( $# )); i++ ))
    do
        echo "$i: :(${containers[*]})"
    done
}

_my_docker_restart_complite() {
    declare -a containers

    args=( "${@}" )

    unset 'args[-1]'

    for container in $(_get_docker_containers run)
    do
        if _check_in_array "$container" "${args[@]}"; then
            continue
        fi

        containers=("${containers[@]}" "$container")
    done

    for (( i=1; i<=$(( $# )); i++ ))
    do
        echo "$i: :(${containers[*]})"
    done
}

_my_docker_exec_complite() {
    containers=($(_get_docker_containers run))

    echo "1: :(${containers[*]})"
}

_my_docker_logs_complite() {
    containers=($(_get_docker_containers))

    echo "1: :(${containers[*]})"
}
