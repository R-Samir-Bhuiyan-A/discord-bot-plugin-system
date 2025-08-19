# Discord Integration

The Discord Bot Plugin System provides extensive integration capabilities with Discord, allowing plugins to add commands, respond to events, and interact with Discord's API.

## Overview

Plugins can interact with Discord through the core API, which provides methods for registering commands and events. All Discord functionality is managed through the core's DiscordManager, ensuring consistency and security.

## Registering Discord Commands

Plugins can register Discord slash commands using the `core.api.registerCommand()` method.

### Method Signature

```javascript
core.api.registerCommand(name, description, handler)
```

### Parameters

- **name** (string): The command name (must be unique)
- **description** (string): A brief description of what the command does
- **handler** (function): An async function that handles the command interaction

### Command Handler Function

The handler function receives an `interaction` object from the Discord.js library:

```javascript
async function handler(interaction) {
  // Handle the command interaction
}
```

### Basic Command Example

```javascript
// In your plugin's init function
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  core.api.registerCommand('ping', 'Ping the bot', async (interaction) => {
    await interaction.reply('Pong!');
  });
  
  logger.info('Registered ping command');
}
```

### Advanced Command with Options

Commands can include options for user input:

```javascript
async function init(core) {
  core.api.registerCommand('greet', 'Greet a user', async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply(`Hello, ${user.username}! 👋`);
  }, {
    options: [
      {
        name: 'user',
        description: 'The user to greet',
        type: 'USER',
        required: false
      }
    ]
  });
}
```

### Command with Subcommands

Complex commands can use subcommands:

```javascript
async function init(core) {
  core.api.registerCommand('mod', 'Moderation commands', async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'ban':
        // Handle ban
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        // Ban logic here
        await interaction.reply(`Banned ${user.username} for: ${reason}`);
        break;
      case 'kick':
        // Handle kick
        const kickUser = interaction.options.getUser('user');
        const kickReason = interaction.options.getString('reason');
        // Kick logic here
        await interaction.reply(`Kicked ${kickUser.username} for: ${kickReason}`);
        break;
    }
  }, {
    options: [
      {
        name: 'ban',
        description: 'Ban a user',
        type: 'SUBCOMMAND',
        options: [
          {
            name: 'user',
            description: 'The user to ban',
            type: 'USER',
            required: true
          },
          {
            name: 'reason',
            description: 'Reason for banning',
            type: 'STRING',
            required: false
          }
        ]
      },
      {
        name: 'kick',
        description: 'Kick a user',
        type: 'SUBCOMMAND',
        options: [
          {
            name: 'user',
            description: 'The user to kick',
            type: 'USER',
            required: true
          },
          {
            name: 'reason',
            description: 'Reason for kicking',
            type: 'STRING',
            required: false
          }
        ]
      }
    ]
  });
}
```

## Registering Discord Events

Plugins can register handlers for Discord events using the `core.api.registerEvent()` method.

### Method Signature

```javascript
core.api.registerEvent(event, handler)
```

### Parameters

- **event** (string): The Discord event name (e.g., 'messageCreate', 'guildMemberAdd')
- **handler** (function): An async function that handles the event

### Event Handler Function

The handler function receives the relevant Discord.js object for the event:

```javascript
function handler(eventObject) {
  // Handle the event
}
```

### Basic Event Example

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  core.api.registerEvent('messageCreate', (message) => {
    logger.info(`New message from ${message.author.username}: ${message.content}`);
  });
  
  logger.info('Registered messageCreate event handler');
}
```

### Multiple Event Handlers

You can register multiple handlers for the same event:

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Log all messages
  core.api.registerEvent('messageCreate', (message) => {
    logger.debug(`Message: ${message.content}`);
  });
  
  // Respond to specific keywords
  core.api.registerEvent('messageCreate', (message) => {
    if (message.content.toLowerCase().includes('hello bot')) {
      message.reply('Hello there!');
    }
  });
  
  logger.info('Registered multiple messageCreate event handlers');
}
```

### Common Discord Events

Here are some commonly used Discord events:

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // When the bot joins a new guild
  core.api.registerEvent('guildCreate', (guild) => {
    logger.info(`Joined new guild: ${guild.name}`);
  });
  
  // When a user joins a guild
  core.api.registerEvent('guildMemberAdd', (member) => {
    logger.info(`New member joined: ${member.user.username}`);
  });
  
  // When a message is updated
  core.api.registerEvent('messageUpdate', (oldMessage, newMessage) => {
    logger.debug(`Message updated: "${oldMessage.content}" -> "${newMessage.content}"`);
  });
  
  // When a reaction is added to a message
  core.api.registerEvent('messageReactionAdd', (reaction, user) => {
    logger.debug(`Reaction added: ${reaction.emoji.name} by ${user.username}`);
  });
}
```

## Command and Event Best Practices

### 1. Error Handling

Always handle errors in your command and event handlers:

```javascript
core.api.registerCommand('error-prone', 'A command that might fail', async (interaction) => {
  try {
    // Potentially failing operation
    const result = await riskyOperation();
    await interaction.reply(`Success: ${result}`);
  } catch (error) {
    const logger = core.api.getLogger('my-plugin');
    logger.error('Command failed:', error);
    
    // Send user-friendly error message
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
});
```

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimiter = new Map();

core.api.registerCommand('expensive-command', 'An expensive command', async (interaction) => {
  const userId = interaction.user.id;
  const now = Date.now();
  
  // Check if user is rate limited
  const lastUsed = rateLimiter.get(userId) || 0;
  if (now - lastUsed < 60000) { // 1 minute cooldown
    await interaction.reply({ 
      content: 'Please wait before using this command again', 
      ephemeral: true 
    });
    return;
  }
  
  // Update rate limiter
  rateLimiter.set(userId, now);
  
  try {
    // Execute expensive operation
    const result = await expensiveOperation();
    await interaction.reply(result);
  } catch (error) {
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
});
```

### 3. Input Validation

Validate all user inputs:

```javascript
core.api.registerCommand('echo', 'Echo a message', async (interaction) => {
  const message = interaction.options.getString('message');
  
  // Validate input
  if (!message || message.length > 1000) {
    await interaction.reply({ 
      content: 'Message must be between 1 and 1000 characters', 
      ephemeral: true 
    });
    return;
  }
  
  await interaction.reply(message);
}, {
  options: [
    {
      name: 'message',
      description: 'The message to echo',
      type: 'STRING',
      required: true
    }
  ]
});
```

### 4. Permission Checking

Check user permissions when needed:

```javascript
core.api.registerCommand('admin-only', 'Admin-only command', async (interaction) => {
  // Check if user has admin permissions
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    await interaction.reply({ 
      content: 'You do not have permission to use this command', 
      ephemeral: true 
    });
    return;
  }
  
  // Admin-only functionality
  await interaction.reply('Admin command executed successfully');
});
```

### 5. Logging

Use the logging system appropriately:

```javascript
core.api.registerEvent('messageCreate', (message) => {
  const logger = core.api.getLogger('my-plugin');
  
  // Log important events
  if (message.content.startsWith('!')) {
    logger.info(`Command detected from ${message.author.username}: ${message.content}`);
  }
  
  // Debug logging for development
  logger.debug(`Message in ${message.channel.name}: ${message.content}`);
});
```

## Advanced Discord Integration

### 1. Sending Messages

Plugins can send messages to channels:

```javascript
async function sendMessageToChannel(core, channelId, content) {
  try {
    const channel = await core.discord.client.channels.fetch(channelId);
    if (channel) {
      await channel.send(content);
    }
  } catch (error) {
    const logger = core.api.getLogger('my-plugin');
    logger.error('Failed to send message:', error);
  }
}
```

### 2. Managing Roles

Plugins can manage user roles:

```javascript
core.api.registerCommand('assign-role', 'Assign a role to a user', async (interaction) => {
  const user = interaction.options.getUser('user');
  const roleName = interaction.options.getString('role');
  
  try {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      await interaction.reply({ content: `Role "${roleName}" not found`, ephemeral: true });
      return;
    }
    
    const member = await interaction.guild.members.fetch(user.id);
    await member.roles.add(role);
    
    await interaction.reply(`Assigned role "${roleName}" to ${user.username}`);
  } catch (error) {
    const logger = core.api.getLogger('my-plugin');
    logger.error('Failed to assign role:', error);
    await interaction.reply({ content: 'Failed to assign role', ephemeral: true });
  }
}, {
  options: [
    {
      name: 'user',
      description: 'The user to assign the role to',
      type: 'USER',
      required: true
    },
    {
      name: 'role',
      description: 'The name of the role to assign',
      type: 'STRING',
      required: true
    }
  ]
});
```

### 3. Working with Embeds

Create rich embed messages:

```javascript
const { EmbedBuilder } = require('discord.js');

core.api.registerCommand('embed-example', 'Show an embed example', async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('Embed Example')
    .setDescription('This is an example of a rich embed')
    .setColor('#0099ff')
    .addFields(
      { name: 'Field 1', value: 'Value 1', inline: true },
      { name: 'Field 2', value: 'Value 2', inline: true }
    )
    .setFooter({ text: 'Footer text' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
});
```

## Plugin-Specific Commands

Plugins can also register commands that are specific to their functionality:

```javascript
// Register a plugin-specific command
core.api.registerPluginCommand('my-plugin', 'plugin-command', 'A command specific to my plugin', async (interaction) => {
  await interaction.reply('This is a plugin-specific command');
});
```

## Best Practices Summary

1. **Always validate inputs** to prevent errors and abuse
2. **Handle errors gracefully** with user-friendly messages
3. **Implement rate limiting** for resource-intensive commands
4. **Check permissions** when commands require special privileges
5. **Use logging** to track plugin activity and debug issues
6. **Keep command responses quick** to maintain good user experience
7. **Provide helpful descriptions** for commands and options
8. **Test thoroughly** with different input scenarios
9. **Follow Discord's guidelines** for bot behavior and commands
10. **Respect user privacy** and handle sensitive data appropriately

By following these guidelines, your plugin will provide a robust and user-friendly Discord experience while integrating seamlessly with the Discord Bot Plugin System.