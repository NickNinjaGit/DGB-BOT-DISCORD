                                                                                
#!/bin/bash


##ALTERANDO COMENTÁRIO NO DEPLOY.SH TESTANDO TESTE.SH MAIS UM TESTE.SH

cd /home/nicolas/DISCORD_GACHA_BATTLE_BOT/DGB-BOT-DISCORD || exit 1

changes=$(git log --since="35 minutes ago")

if [ -n "$changes" ]; then
    echo "Uma alteração foi feita"

git pull
PID=$(pgrep -f "npm start")
    if [ -n "$PID" ]; then
        kill -9 $PID
        echo "processo npm encerrado"
    fi
nohup /home/nicolas/.nvm/versions/node/v22.12.0/bin/npm start &
else
    echo "Nenhuma alteração foi feita"
    exit 0
fi
#script do pull abaixo
# Caminho para o repositório


#Mata o processo do npm capturando o processo e matando PID=$(pgrep -f "npm start") && kill-9 $PI D
#depois executa o nohup npm start &


