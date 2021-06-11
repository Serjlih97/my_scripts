# #!/bin/bash

_my_kube() {
    if [ -z "$1" ]; then
        echo 'Wrong params'
        return 1
    fi

    if [ -z "$(command -v _my_kube_$1)" ]; then
        echo "Param '$1' not exist"
        return 1
    fi

    _my_kube_$1 "${@:2}"

    return $?
}

_my_kube_ip() {
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    kubectl -n "$1" describe pods "$2" | grep ^IP: | sed -e 's,^.*: *,,g'
}

_my_kube_info() {
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    kubectl -n "$1" describe pods "$2"
}

_my_kube_go() {
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    open "https://bb-test2-dashboard.bb-online-stage.com/#!/pod/$1/$2?namespace=$1"
}

_my_kube_exec() {
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    kubectl -n "$1" exec "$2" -it bash
}

_my_kube_edit() {
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    kubectl -n "$1" edit "deployments/$2"
}

_my_kube_logs() {
    local params
    if [ -z "$1" ]; then
        echo 'Wrong ns name'
        return 1
    fi

    if [ -z "$2" ]; then
        echo 'Wrong pod name'
        return 1
    fi

    kubectl -n "$1" logs "${@:2}"
}

# # complite

_my_kube_complite() {
    local params

    subCommands=("ip" "info" "go" "exec" "edit" "logs")

    echo "1: :(${subCommands[*]})"
    echo "*::arg:->args"

    if _check_in_array "$1" "${subCommands[@]}"; then
        if [ ! -z "$(command -v _my_kube_$1_complite)" ]; then
            _my_kube_$1_complite "${line[@]:2}"
        else
            _my_kube_ns_pod_complite "${line[@]:2}"
        fi
    fi
}

_my_kube_ns_pod_complite() {
    namespaces=($(_get_kube_namespaces))

    echo "1: :(${namespaces[*]})"

    if _check_in_array "$1" "${namespaces[@]}"; then
        pods=($(_get_kube_pods "$1"))

        echo "2: :(${pods[*]})"
        continue
    fi
}

_my_kube_edit_complite() {
    namespaces=($(_get_kube_namespaces))

    echo "1: :(${namespaces[*]})"

    if _check_in_array "$1" "${namespaces[@]}"; then
        pods=($(_get_kube_apps "$1"))

        echo "2: :(${pods[*]})"
        continue
    fi
}
