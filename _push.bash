#!/bin/bash

_my_push()
{
    branch="$(_get_git_current_branch)"

    if [ -z "$branch" ]; then
        return 1
    fi

    git push origin $branch "$@"
}

_my_push_complite() {
    local params

    subCommands=("--force")

    echo "1: :(${subCommands[*]})"
    echo "*::arg:->args"
}
