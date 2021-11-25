import { Client, Intents, MessageEmbed } from "discord.js";
import { prefix } from "./params.json";

import * as dotenv from "dotenv";
import { embedBuilder, embedBuilderQueue } from "./actions";
import DisTube, { Queue, Song } from "distube";
dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const distube = new DisTube(client, {
  searchSongs: 1,
  emitNewSongOnly: false,
});

// LISTENERS

client.on("ready", () => {
  console.log("The bot is ready!");
});
client.on("reconnecting", () => {
  console.log("The bot is reconnecting!");
});
client.on("disconnect", () => {
  console.log("The bot is disconnected!");
});

client.on("messageCreate", async (message) => {
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith(prefix)
  )
    return;

  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift()?.toLowerCase();
  let channel = message.member.voice.channel;
  if (!channel) {
    embedBuilder(
      client,
      message,
      "RED",
      "Erro ao utilizar o comando!",
      "Você precisa estar em um canal para tocar uma musica."
    );
    return;
  }
  if (cmd === "p") {
    let search = args.join(" ");

    if (!search) {
      embedBuilder(
        client,
        message,
        "RED",
        "Erro ao utilizar o comando!",
        "Digite o nome ou o link da musica!"
      );
      return;
    }
    embedBuilder(
      client,
      message,
      "YELLOW",
      "DJ Titico está pesquisando...",
      search
    );
    return distube.play(message, search);
  }

  if (cmd === "skip") {
    embedBuilder(client, message, "YELLOW", "DJ Titico pulou essa musica!");
    distube.skip(message);
    return;
  }

  if (cmd === "stop") {
    embedBuilder(
      client,
      message,
      "RED",
      "Mandaram o DJ Titico parar!",
      "Vishkk \nFui expulso"
    );
    distube.stop(message);
    return;
  }

  if (cmd === "queue") {
    let queue = distube.getQueue(message);
    let currentQueue;
    if (queue) {
      currentQueue = queue.songs
        .map(
          (song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n");
    }

    embedBuilder(client, message, "GREEN", "Fila de musicas", currentQueue);
    return;
  }

  if (cmd === "jump") {
    let queue = distube.getQueue(message);
    if (queue) {
      if (0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length) {
        embedBuilder(
          client,
          message,
          "YELLOW",
          "DJ Titico adiantou o show!",
          `Pulei ${parseInt(args[0]) - 1} musicas!`
        );
        distube
          .jump(message, parseInt(args[0]) - 1)
          .catch((err) => message.channel.send("Número da musica invalido"));
      } else {
        embedBuilder(
          client,
          message,
          "RED",
          "DJ Titico nao conseguiu adiantar o show!",
          `Solicite um numero entre **0** and **${queue.songs.length}**`
        );
      }
    }
  }
});

//distube
distube
  .on("playSong", (queue: Queue, song: Song) => {
    embedBuilderQueue(
      client,
      queue.textChannel,
      "GREEN",
      "DJ Titico esta tocando!",
      `${song.name}\  -  \`${song.formattedDuration}\` \n\npor ${song.user}`,
      song.thumbnail
    );
  })
  .on("addSong", (queue: Queue, song: Song) => {
    embedBuilderQueue(
      client,
      queue.textChannel,
      "GREEN",
      "DJ Titico adicionou uma musica!",
      `${song.name}  -  \`${song.formattedDuration}\` \n\npor ${song.user}`,
      song.thumbnail
    );
  });

client.login(process.env.TOKEN);
