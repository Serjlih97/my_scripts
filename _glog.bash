#!/bin/bash

_my_glog()
{
    git log $(git branch | grep "*" | awk '{print $2}') --not $(git for-each-ref --format='%(refname)' refs/heads/ | grep -v refs/heads/$(git branch | grep "*" | awk '{print $2}')) --graph --pretty=format:'%Cred%h%Creset -%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
}