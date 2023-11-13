PATH_TO_JAVY="bin"
if [[ ! -f "$PATH_TO_JAVY/javy" ]]; then
    TMPGZ=$(mktemp)
    #VERSION_MAJOR="19"
    #VERSION_MINOR="0"
    if [[ "$(uname -s)" == "Darwin" ]]; then
        wget -O javy https://github.com/Jacarte/javy/releases/download/node-red-0.9.12/javy-x86_64-macos-node-red-0.9.12
         
    else
        wget -O javy https://github.com/Jacarte/javy/releases/download/node-red-0.9.12/javy-x86_64-linux-node-red-0.9.12
    fi
    mkdir -p $PATH_TO_JAVY
    if [[ -f "javy" ]]
    then
        mv javy bin/javy    
        chmod +x ./bin/javy
    fi
fi
