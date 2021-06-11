#!/bin/bash

_my_pull()
{
    branch="$(_get_git_current_branch)"

    if [ -z "$branch" ]; then
        return 1
    fi

    git pull origin $branch
}