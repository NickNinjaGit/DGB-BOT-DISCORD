#!/bin/bash


# Caminho para o repositório
REPO_DIR="/home/nicolas/DISCORD_GACHA_BATTLE_BOT/DGB-BOT-DISCORD/"

# Muda para o diretório do repositório
cd "$REPO_DIR" || exit 1

/usr/bin/git pull origin master
