// core/discord/index.js
const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require('discord.js');
require('dotenv').config();

class DiscordManager {
  constructor(core) {
    this.core = core;
    this.client = null;
    this.rest = null;
    this.registeredCommands = new Map(); // Track commands registered by plugins
  }

  async init() {
    try {
      // Initialize Discord client
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
        ]
      });

      // Initialize REST client for command registration
      this.rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

      // Register event handlers
      this.client.once('ready', () => {
        console.log(`Logged in as ${this.client.user.tag}`);
      });

      // Handle command interactions
      this.client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = this.core.api.commands.get(interaction.commandName);
        if (!command) return;

        try {
          await command.handler(interaction);
        } catch (error) {
          console.error(`Error executing command ${interaction.commandName}:`, error);
          await interaction.reply({ 
            content: 'There was an error executing this command!', 
            ephemeral: true 
          });
        }
      });

      // Handle message events
      this.client.on(Events.MessageCreate, (message) => {
        // Trigger plugin event handlers
        const handlers = this.core.api.events.get('messageCreate');
        if (handlers) {
          handlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              console.error('Error in messageCreate event handler:', error);
            }
          });
        }
      });

      // Login to Discord
      const token = process.env.DISCORD_TOKEN;
      if (!token) {
        console.warn('DISCORD_TOKEN not found in environment variables. Discord bot will not be connected.');
        return;
      }

      await this.client.login(token);
    } catch (error) {
      console.error('Failed to initialize Discord manager:', error);
      throw error;
    }
  }

  async registerCommands() {
    try {
      // Wait for client to be ready
      if (!this.client || !this.client.application) {
        console.warn('Client not ready, cannot register commands');
        return;
      }

      // Convert our commands to Discord's format
      const commands = [];
      for (const [name, command] of this.core.api.commands) {
        commands.push({
          name: name,
          description: command.description,
          options: []
        });
      }

      // Register commands globally (this can take up to 1 hour to propagate)
      // In production, you might want to register per guild for immediate availability
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      const data = await this.rest.put(
        Routes.applicationCommands(this.client.application.id),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  }

  async destroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }
  
  // Get bot status information
  getBotStatus() {
    if (!this.client) {
      return {
        status: 'disconnected',
        message: 'Discord client not initialized'
      };
    }
    
    return {
      status: this.client.readyAt ? 'online' : 'connecting',
      username: this.client.user ? this.client.user.tag : null,
      guildCount: this.client.guilds ? this.client.guilds.cache.size : 0,
      userCount: this.client.users ? this.client.users.cache.size : 0,
      uptime: this.client.uptime ? this.client.uptime : 0
    };
  }
  
  // Register a command from a plugin
  registerPluginCommand(pluginName, commandName, description, handler) {
    // Store the command with plugin association
    this.registeredCommands.set(commandName, pluginName);
    
    // Register with the core API
    this.core.api.registerCommand(commandName, description, handler);
    
    // Re-register all commands with Discord
    this.registerCommands();
  }
  
  // Unregister all commands associated with a plugin
  unregisterPluginCommands(pluginName) {
    // Find and remove commands associated with this plugin
    const commandsToRemove = [];
    for (const [commandName, associatedPlugin] of this.registeredCommands) {
      if (associatedPlugin === pluginName) {
        commandsToRemove.push(commandName);
      }
    }
    
    // Remove the commands from tracking
    for (const commandName of commandsToRemove) {
      this.registeredCommands.delete(commandName);
      this.core.api.commands.delete(commandName);
    }
    
    // Re-register remaining commands with Discord
    this.registerCommands();
  }
}

module.exports = DiscordManager;