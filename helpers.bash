#!/bin/bash

_get_git_current_branch() {
    git branch | grep \* | cut -d ' ' -f2
}

_check_in_array() {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

_get_docker_containers() {
    comand='docker ps'

    if [[ -z "$1" ]]; then
        comand+=' -a'
    fi

    if [[ "$1" == 'noRun' ]]; then
        comand+=' --filter status=dead --filter status=paused --filter status=exited'
    fi

    if [[ "$1" == 'run' ]]; then
        comand+=' --filter status=running'
    fi

    comand+=' --format "{{.Names}}"'
    containers="$(bash -c $comand)"
    echo $containers
}

_get_kube_namespaces() {
  tmpFile="$_dir/tmp/namespaces"

  if [[ -f "$tmpFile" ]]; then
      namespaces="$(cat $tmpFile)"
  else
      comand="kubectl get ns --no-headers -o custom-columns=NAME:.metadata.name"
      namespaces="$(bash -c $comand)"
      echo "$namespaces" > $tmpFile
  fi

  echo $namespaces
}

_get_kube_pods() {
  comand="kubectl -n $1 get pods -o=jsonpath=\"{.items[*]['metadata.name']}\""
  pods="$(bash -c $comand)"
  echo $pods
}

_get_kube_apps() {
  comand="kubectl -n $1 get pods -o=jsonpath=\"{.items[*]['metadata.labels.app']}\""
  pods="$(bash -c $comand)"
  echo $pods
}
