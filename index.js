import express from 'express';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import config from './config/config.js';
const { port, clientID, clientSecret } = config;

const authProvider = new ClientCredentialsAuthProvider(clientID, clientSecret);

const apiClient = new ApiClient({
  authProvider,
});

const app = express();

app.get('/:name', async (req, res) => {
  try {
    const user = await apiClient.users.getUserByName(req.params.name);

    const follows = (
      await apiClient.users
        .getFollowsPaginated({
          user,
        })
        .getAll()
    ).map(({ followedUserName }) => followedUserName);

    res.json({ follows });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred.',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Invalid endpoint.',
  });
});

app.listen(port);
