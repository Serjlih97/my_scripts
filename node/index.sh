#!/bin/bash

cmd=`basename $0`
com_output=$(_$cmd "$@")
exit_code=$?

IFS=$'\n'

for i in $com_output;
do
  check=$(echo "$i" | grep _BASH)

  if [[ -z "$check" ]]; then
    echo -e $i;
  else
    command=$(echo $i | cut -b 7-)
  fi
done

if [[ ! -z "$command" ]]; then
  bash -c "$command"
fi
exit $exit_code;
