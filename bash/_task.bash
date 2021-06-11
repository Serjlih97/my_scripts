#!/bin/bash

_my_task()
{
    branch="$(_get_git_current_branch)"

    if [ -z "$branch" ]; then
        return 1
    fi

    task="$([[ $branch =~ ([0-9]+) ]] && echo "${match[1]}")"

    if [ -z "$task" ]; then
        echo "branch must be of the format .*[-_][0-9]+"
        return 1
    fi

    open https://bingoboom.atlassian.net/browse/ONL-$task
}