#!/bin/bash

_my_push()
{
    branch="$(_get_git_current_branch)"

    if [ -z "$branch" ]; then
        return 1
    fi

    masterBranches=("master" "cupis_master")

    if _check_in_array "$branch" "${masterBranches[@]}"; then
        git push origin $branch "$@"
    else
        if [ -z "$1" ]; then
            echo 'Wrong tag'
            return 1
        fi

        git push origin $branch -o merge_request.create -o merge_request.label="$1" "${@:2}"
    fi
}

_my_push_complite() {
    local params

    branch="$(_get_git_current_branch)"
    masterBranches=("master" "cupis_master")

    if ! _check_in_array "$branch" "${masterBranches[@]}"; then
        tags=("breaking-changes" "bugfix" "docs" "enhancement" "feature")

        echo "1: :(${tags[*]})"
        echo "*::arg:->args"
    fi

    subCommands=("--force")

    echo "1: :(${subCommands[*]})"
    echo "*::arg:->args"
}
