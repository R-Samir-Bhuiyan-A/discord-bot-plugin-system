# Bot Status API Reference

The Bot Status API provides methods for monitoring and managing the Discord bot's status and connection.

## Table of Contents

1. [Overview](#overview)
2. [Getting Bot Status](#getting-bot-status)
3. [Bot Connection Management](#bot-connection-management)
4. [Guild and User Information](#guild-and-user-information)
5. [Performance Metrics](#performance-metrics)
6. [Best Practices](#best-practices)

## Overview

The Bot Status API allows plugins to monitor the bot's connection status, retrieve information about connected guilds and users, and access performance metrics. This information is useful for creating status dashboards, monitoring tools, and plugins that need to react to connection changes.

## Getting Bot Status

### getBotStatus()

Gets the current status of the Discord bot.

**Returns:**
- Promise resolving to a status object with the following properties:
  - `status` (string): Current connection status ('online', 'connecting', 'disconnected')
  - `username` (string): Bot's username
  - `discriminator` (string): Bot's discriminator
  - `guildCount` (number): Number of guilds the bot is connected to
  - `userCount` (number): Total number of users the bot can see
  - `uptime` (number): Bot uptime in milliseconds
  - `ping` (number): Current WebSocket ping to Discord

**Example:**
```javascript
async function init(core) {
  const status = await core.api.getBotStatus();
  
  console.log(`Bot Status: ${status.status}`);
  console.log(`Username: ${status.username}`);
  console.log(`Guilds: ${status.guildCount}`);
  console.log(`Users: ${status.userCount}`);
  console.log(`Uptime: ${Math.floor(status.uptime / 1000)} seconds`);
  console.log(`Ping: ${status.ping}ms`);
}
```

### isBotOnline()

Checks if the bot is currently connected to Discord.

**Returns:**
- Promise resolving to a boolean indicating if the bot is online

**Example:**
```javascript
async function init(core) {
  const isOnline = await core.api.isBotOnline();
  
  if (isOnline) {
    console.log('Bot is connected to Discord');
  } else {
    console.log('Bot is not connected to Discord');
  }
}
```

## Bot Connection Management

### reconnectBot()

Attempts to reconnect the bot to Discord.

**Returns:**
- Promise that resolves when the reconnection process starts

**Example:**
```javascript
core.api.registerCommand('reconnect', 'Reconnect the bot to Discord', async (interaction) => {
  try {
    await core.api.reconnectBot();
    await interaction.reply('Reconnection initiated. Please wait a few moments.');
  } catch (error) {
    await interaction.reply({ 
      content: `Failed to initiate reconnection: ${error.message}`, 
      ephemeral: true 
    });
  }
});
```

### disconnectBot()

Disconnects the bot from Discord.

**Returns:**
- Promise that resolves when the bot is disconnected

**Example:**
```javascript
core.api.registerCommand('disconnect', 'Disconnect the bot from Discord', async (interaction) => {
  try {
    await core.api.disconnectBot();
    await interaction.reply('Bot has been disconnected from Discord.');
  } catch (error) {
    await interaction.reply({ 
      content: `Failed to disconnect bot: ${error.message}`, 
      ephemeral: true 
    });
  }
});
```

## Guild and User Information

### getGuilds()

Gets information about all guilds the bot is connected to.

**Returns:**
- Promise resolving to an array of guild objects with the following properties:
  - `id` (string): Guild ID
  - `name` (string): Guild name
  - `memberCount` (number): Number of members in the guild
  - `ownerId` (string): Guild owner's user ID
  - `createdAt` (Date): When the guild was created

**Example:**
```javascript
async function init(core) {
  try {
    const guilds = await core.api.getGuilds();
    
    console.log(`Bot is in ${guilds.length} guilds:`);
    guilds.forEach(guild => {
      console.log(`- ${guild.name} (${guild.memberCount} members)`);
    });
  } catch (error) {
    console.error('Failed to fetch guilds:', error);
  }
}
```

### getGuild(guildId)

Gets detailed information about a specific guild.

**Parameters:**
- `guildId` (string): The ID of the guild

**Returns:**
- Promise resolving to a guild object or null if not found

**Example:**
```javascript
async function init(core) {
  const guilds = await core.api.getGuilds();
  
  if (guilds.length > 0) {
    const firstGuild = await core.api.getGuild(guilds[0].id);
    
    if (firstGuild) {
      console.log(`Guild: ${firstGuild.name}`);
      console.log(`Members: ${firstGuild.memberCount}`);
      console.log(`Owner: ${firstGuild.ownerId}`);
      console.log(`Created: ${firstGuild.createdAt}`);
    }
  }
}
```

### getUsers()

Gets information about all users the bot can see.

**Returns:**
- Promise resolving to an array of user objects with the following properties:
  - `id` (string): User ID
  - `username` (string): User's username
  - `discriminator` (string): User's discriminator
  - `bot` (boolean): Whether the user is a bot
  - `createdAt` (Date): When the user account was created

**Example:**
```javascript
async function init(core) {
  try {
    const users = await core.api.getUsers();
    const humanUsers = users.filter(user => !user.bot);
    const botUsers = users.filter(user => user.bot);
    
    console.log(`Total users: ${users.length}`);
    console.log(`Human users: ${humanUsers.length}`);
    console.log(`Bot users: ${botUsers.length}`);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}
```

## Performance Metrics

### getPerformanceMetrics()

Gets performance metrics for the bot.

**Returns:**
- Promise resolving to a metrics object with the following properties:
  - `memoryUsage` (object): Memory usage information
    - `rss` (number): Resident Set Size
    - `heapTotal` (number): Total heap size
    - `heapUsed` (number): Used heap size
    - `external` (number): External memory usage
  - `cpuUsage` (object): CPU usage information
    - `user` (number): CPU time spent in user mode
    - `system` (number): CPU time spent in system mode
  - `eventLoopDelay` (number): Average event loop delay in milliseconds
  - `activeHandles` (number): Number of active handles
  - `activeRequests` (number): Number of active requests

**Example:**
```javascript
async function init(core) {
  const metrics = await core.api.getPerformanceMetrics();
  
  console.log('Performance Metrics:');
  console.log(`Memory Usage: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)} MB`);
  console.log(`Event Loop Delay: ${metrics.eventLoopDelay.toFixed(2)} ms`);
  console.log(`Active Handles: ${metrics.activeHandles}`);
}
```

### getCommandStats()

Gets statistics about command usage.

**Returns:**
- Promise resolving to a stats object with command usage information

**Example:**
```javascript
async function init(core) {
  const stats = await core.api.getCommandStats();
  
  console.log('Command Usage Statistics:');
  Object.entries(stats).forEach(([command, count]) => {
    console.log(`- ${command}: ${count} uses`);
  });
}
```

## Best Practices

### 1. Monitor Bot Status for Reliability

Create monitoring systems that react to bot status changes:

```javascript
async function init(core) {
  // Check bot status periodically
  setInterval(async () => {
    const status = await core.api.getBotStatus();
    
    if (status.status !== 'online') {
      console.warn(`Bot is not online. Current status: ${status.status}`);
      
      // Notify administrators or attempt reconnection
      if (status.status === 'disconnected') {
        await core.api.reconnectBot();
      }
    }
  }, 60000); // Check every minute
}
```

### 2. Create Status Dashboard Commands

Provide users with easy access to bot status information:

```javascript
core.api.registerCommand('status', 'Get bot status information', async (interaction) => {
  try {
    const status = await core.api.getBotStatus();
    const guilds = await core.api.getGuilds();
    
    const embed = new EmbedBuilder()
      .setTitle('Bot Status')
      .setColor('#0099ff')
      .addFields(
        { name: 'Status', value: status.status, inline: true },
        { name: 'Username', value: status.username, inline: true },
        { name: 'Ping', value: `${status.ping}ms`, inline: true },
        { name: 'Guilds', value: status.guildCount.toString(), inline: true },
        { name: 'Users', value: status.userCount.toString(), inline: true },
        { name: 'Uptime', value: formatUptime(status.uptime), inline: true }
      )
      .setFooter({ text: `Last updated: ${new Date().toLocaleString()}` });
    
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({ 
      content: `Failed to fetch status: ${error.message}`, 
      ephemeral: true 
    });
  }
});

function formatUptime(uptimeMs) {
  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
```

### 3. Handle Connection Issues Gracefully

Implement error handling for connection-related operations:

```javascript
async function init(core) {
  core.api.registerEvent('bot:disconnected', async (data) => {
    console.warn('Bot disconnected from Discord:', data.reason);
    
    // Attempt to reconnect after a delay
    setTimeout(async () => {
      try {
        await core.api.reconnectBot();
        console.log('Reconnection attempt initiated');
      } catch (error) {
        console.error('Failed to initiate reconnection:', error);
      }
    }, 5000); // Wait 5 seconds before reconnecting
  });
}
```

### 4. Provide Performance Monitoring

Monitor and report on bot performance:

```javascript
async function init(core) {
  // Log performance metrics periodically
  setInterval(async () => {
    try {
      const metrics = await core.api.getPerformanceMetrics();
      const memoryMB = Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024);
      
      if (memoryMB > 500) { // Alert if memory usage exceeds 500MB
        console.warn(`High memory usage detected: ${memoryMB} MB`);
      }
      
      const status = await core.api.getBotStatus();
      if (status.ping > 200) { // Alert if ping exceeds 200ms
        console.warn(`High ping detected: ${status.ping}ms`);
      }
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    }
  }, 300000); // Check every 5 minutes
}
```

By following these best practices and using the Bot Status API effectively, you can create plugins that provide valuable monitoring and management capabilities for Discord bots.