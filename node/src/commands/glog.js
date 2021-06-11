const BaseCommand = require('./_base');

class Command extends BaseCommand {
    run() {
        console.log(`_BASH git log $(git branch | grep "*" | awk '{print $2}') --not $(git for-each-ref --format='%(refname)' refs/heads/ | grep -v refs/heads/$(git branch | grep "*" | awk '{print $2}')) --graph --pretty=format:'%Cred%h%Creset -%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit`);
    }
}

module.exports = new Command('glog');
