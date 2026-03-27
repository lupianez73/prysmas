'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Prysmas yo API',
            version: '1.0.0',
            description: 'AngularJS full-stack REST API (Express + Mongoose)'
        },
        servers: [{ url: 'http://localhost:9000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token. Can also be passed as ?access_token= query param or token cookie.'
                }
            },
            schemas: {
                Thing: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64a1f2c3e4b5d6789abc1234' },
                        name: { type: 'string', example: 'Example thing' },
                        info: { type: 'string', example: 'Some info about this thing' },
                        active: { type: 'boolean', example: true }
                    }
                },
                ThingInput: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string', example: 'My thing' },
                        info: { type: 'string', example: 'Description' },
                        active: { type: 'boolean', example: true }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64a1f2c3e4b5d6789abc5678' },
                        name: { type: 'string', example: 'Carlos' },
                        email: { type: 'string', format: 'email', example: 'carlos@example.com' },
                        role: { type: 'string', enum: ['guest', 'user', 'admin'], example: 'user' },
                        provider: { type: 'string', example: 'local' }
                    }
                },
                UserInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Carlos' },
                        email: { type: 'string', format: 'email', example: 'carlos@example.com' },
                        password: { type: 'string', example: 'Password0' }
                    }
                },
                TokenResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                LocalLoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'carlos@example.com' },
                        password: { type: 'string', example: 'Password0' }
                    }
                },
                PasswordChangeRequest: {
                    type: 'object',
                    required: ['oldPassword', 'newPassword'],
                    properties: {
                        oldPassword: { type: 'string', example: 'OldPassword0' },
                        newPassword: { type: 'string', example: 'NewPassword1' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        paths: {
            // ─── THINGS ──────────────────────────────────────────────────────
            '/api/things': {
                get: {
                    tags: ['Things'],
                    summary: 'Get all things',
                    responses: {
                        200: {
                            description: 'List of things',
                            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Thing' } } } }
                        }
                    }
                },
                post: {
                    tags: ['Things'],
                    summary: 'Create a new thing',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ThingInput' } } }
                    },
                    responses: {
                        201: {
                            description: 'Thing created',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Thing' } } }
                        }
                    }
                }
            },
            '/api/things/{id}': {
                get: {
                    tags: ['Things'],
                    summary: 'Get a thing by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'Thing found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Thing' } } } },
                        404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                },
                put: {
                    tags: ['Things'],
                    summary: 'Replace a thing (upsert)',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ThingInput' } } }
                    },
                    responses: {
                        200: { description: 'Thing updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Thing' } } } }
                    }
                },
                patch: {
                    tags: ['Things'],
                    summary: 'Partially update a thing (JSON Patch)',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            op: { type: 'string', enum: ['add', 'remove', 'replace', 'move', 'copy', 'test'], example: 'replace' },
                                            path: { type: 'string', example: '/name' },
                                            value: { type: 'string', example: 'New name' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Thing patched', content: { 'application/json': { schema: { $ref: '#/components/schemas/Thing' } } } },
                        404: { description: 'Not found' }
                    }
                },
                delete: {
                    tags: ['Things'],
                    summary: 'Delete a thing',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        204: { description: 'Deleted' },
                        404: { description: 'Not found' }
                    }
                }
            },

            // ─── USERS ───────────────────────────────────────────────────────
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (admin only)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'List of users (password and salt omitted)',
                            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }
                        },
                        403: { description: 'Forbidden — admin role required' }
                    }
                },
                post: {
                    tags: ['Users'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } }
                    },
                    responses: {
                        200: {
                            description: 'User created, returns JWT token (5h expiry)',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } }
                        }
                    }
                }
            },
            '/api/users/me': {
                get: {
                    tags: ['Users'],
                    summary: 'Get the currently authenticated user',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Current user profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/api/users/{id}': {
                get: {
                    tags: ['Users'],
                    summary: 'Get a user by ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Unauthorized' },
                        404: { description: 'Not found' }
                    }
                },
                delete: {
                    tags: ['Users'],
                    summary: 'Delete a user (admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        204: { description: 'Deleted' },
                        403: { description: 'Forbidden — admin role required' }
                    }
                }
            },
            '/api/users/{id}/password': {
                put: {
                    tags: ['Users'],
                    summary: 'Change password',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordChangeRequest' } } }
                    },
                    responses: {
                        204: { description: 'Password changed' },
                        403: { description: 'Wrong old password' },
                        401: { description: 'Unauthorized' }
                    }
                }
            },

            // ─── AUTH ─────────────────────────────────────────────────────────
            '/auth/local': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login with email and password',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/LocalLoginRequest' } } }
                    },
                    responses: {
                        200: {
                            description: 'Login successful, returns JWT token (5h expiry)',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } }
                        },
                        401: { description: 'Invalid credentials' },
                        404: { description: 'User not found' }
                    }
                }
            },
            '/auth/facebook': {
                get: {
                    tags: ['Auth'],
                    summary: 'Initiate Facebook OAuth (redirects to Facebook)',
                    responses: {
                        302: { description: 'Redirect to Facebook consent screen' }
                    }
                }
            },
            '/auth/facebook/callback': {
                get: {
                    tags: ['Auth'],
                    summary: 'Facebook OAuth callback',
                    parameters: [{ name: 'code', in: 'query', schema: { type: 'string' }, description: 'OAuth code from Facebook' }],
                    responses: {
                        302: { description: 'Sets token cookie and redirects to /' }
                    }
                }
            },
            '/auth/google': {
                get: {
                    tags: ['Auth'],
                    summary: 'Initiate Google OAuth (redirects to Google)',
                    responses: {
                        302: { description: 'Redirect to Google consent screen' }
                    }
                }
            },
            '/auth/google/callback': {
                get: {
                    tags: ['Auth'],
                    summary: 'Google OAuth callback',
                    parameters: [{ name: 'code', in: 'query', schema: { type: 'string' }, description: 'OAuth code from Google' }],
                    responses: {
                        302: { description: 'Sets token cookie and redirects to /' }
                    }
                }
            },
            '/auth/twitter': {
                get: {
                    tags: ['Auth'],
                    summary: 'Initiate Twitter OAuth (redirects to Twitter)',
                    responses: {
                        302: { description: 'Redirect to Twitter consent screen' }
                    }
                }
            },
            '/auth/twitter/callback': {
                get: {
                    tags: ['Auth'],
                    summary: 'Twitter OAuth callback',
                    parameters: [
                        { name: 'oauth_token', in: 'query', schema: { type: 'string' } },
                        { name: 'oauth_verifier', in: 'query', schema: { type: 'string' } }
                    ],
                    responses: {
                        302: { description: 'Sets token cookie and redirects to /' }
                    }
                }
            }
        }
    },
    apis: []
};

module.exports = swaggerJsdoc(options);
