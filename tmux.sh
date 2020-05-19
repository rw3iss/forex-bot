#!/bin/sh 
tmux new-session -d
tmux split-window -h
tmux select-pane -t 0
tmux split-window -v

tmux send-keys -t 0 'cd ~/Sites/forex/server && nodemon dist/main.js' Enter
tmux send-keys -t 1 'cd ~/Sites/forex/server && tsc -w' Enter
tmux send-keys -t 2 'cd ~/Sites/forex/client && ng serve --port 4200' Enter

tmux resize-pane -R 10

tmux -2 attach-session -d