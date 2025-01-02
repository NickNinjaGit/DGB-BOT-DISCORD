#!/bin/bash


##script para checa se o repositorio teve alteração (git log --since="1 minute ago"), caso sim faz o pull, caso não encerra o script. 

#script do pull abaixo
# Caminho para o repositório
REPO_DIR="/home/nicolas/DISCORD_GACHA_BATTLE_BOT/DGB-BOT-DISCORD/"

# Muda para o diretório do repositório
cd "$REPO_DIR" || exit 1

/usr/bin/git pull origin master

#Mata o processo do npm capturando o processo e matando PID=$(pgrep -f "npm start") && kill-9 $PI D 
#depois executa o nohup npm stat & 
