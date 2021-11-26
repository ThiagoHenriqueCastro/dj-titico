import {
  Client,
  ColorResolvable,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";

export function embedBuilder(
  client,
  message,
  color,
  title = null,
  description = null,
  thumbnail = null
) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);

  return message.channel.send({ embeds: [embed] });
}
