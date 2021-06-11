#!/bin/bash

cmd=`basename $0`
com_output=$(_$cmd "$@")
exit_code=$?

while read i
do
  check=$(echo "$i" | grep _BASH)

  if [[ -z "$check" ]]; then
    echo -e $i;
  else
    command=$(echo $i | cut -b 7-)
  fi
done <<< "${com_output}"

if [[ ! -z "$1" ]]; then
  bash -c "$command"
fi
exit $exit_code;
