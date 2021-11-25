import {
  Client,
  ColorResolvable,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";

export function embedBuilder(
  client: Client,
  message: Message,
  color: ColorResolvable,
  title: string = null,
  description: string = null,
  thumbnail: string = null
) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);

  return message.channel.send({ embeds: [embed] });
}

export function embedBuilderQueue(
  client: Client,
  message: TextChannel,
  color: ColorResolvable,
  title: string,
  description: string,
  thumbnail: string = null
) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);

  return message.send({ embeds: [embed] });
}
