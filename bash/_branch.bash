#!/bin/bash

_my_branch()
{
    branch="$(_get_git_current_branch)"

    if [ -z "$branch" ]; then
        return 1
    fi

    origin="$(git config --get remote.origin.url)"
    user="$(echo $origin | grep @ | cut -d@ -f1)"
    hostport="$(echo ${origin/$user@/} | cut -d/ -f1)"
    host="$(echo $hostport | sed -e 's,:.*,,g')"
    project="$(echo $hostport | sed -e 's,^.*:,,g')"
    repo="$(echo $origin | grep / | cut -d/ -f2-)"
    repo="${repo%.*}"

    open https://$host/$project/$repo/commits/$branch
}