
#!/bin/bash


##script para checa se o repositorio teve alteração (git log --since="1 minute ago"), caso sim faz o pull, caso não encerra o script. 
changes=$(git log --since="1 minute ago")

if [ -n "$changes" ]; then
    echo "Uma alteração foi feita"

    git pull
    PID=${$(pgrep -f "npm start")}
    if [ -n "$PID" ]; then
        kill -9 $PID
        echo "processo npm encerrado"
    fi
    nohup npm start &
else
    echo "Nenhuma alteração foi feita"
    exit 0
fi
#script do pull abaixo
# Caminho para o repositório


#Mata o processo do npm capturando o processo e matando PID=$(pgrep -f "npm start") && kill-9 $PI D 
#depois executa o nohup npm start & 

