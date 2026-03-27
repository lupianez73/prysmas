const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Prysmas API',
            version: '1.0.0',
            description: 'REST API for Prysmas'
        },
        servers: [{ url: 'http://localhost:3000/api' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        password: { type: 'string', example: 'Password0' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        msg: { type: 'string', example: 'Login successful' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                SignupRequest: {
                    type: 'object',
                    required: ['user'],
                    properties: {
                        user: {
                            type: 'object',
                            required: ['name', 'email', 'password'],
                            properties: {
                                name: { type: 'string', example: 'Carlos' },
                                email: { type: 'string', format: 'email', example: 'carlos@example.com' },
                                password: { type: 'string', example: 'Password0' }
                            }
                        }
                    }
                },
                TokenResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                UserInfo: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'object',
                            properties: {
                                user: { type: 'object' },
                                status: { type: 'string', example: 'ok' }
                            }
                        },
                        msg: { type: 'string', example: 'success' }
                    }
                },
                Fotone: {
                    type: 'object',
                    properties: {
                        large: { type: 'string', format: 'uri' },
                        thumbnail: { type: 'string', format: 'uri' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        msg: { type: 'string' }
                    }
                }
            }
        },
        paths: {
            '/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login with email and password',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } }
                        },
                        401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/facebook': {
                post: {
                    tags: ['Auth'],
                    summary: 'Authenticate with Facebook',
                    responses: {
                        200: { description: 'Facebook authentication successful' },
                        401: { description: 'Authentication failed' }
                    }
                }
            },
            '/user/signup': {
                post: {
                    tags: ['User'],
                    summary: 'Create a new user account',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SignupRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'User created, returns JWT token',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } }
                        },
                        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/user/verify': {
                get: {
                    tags: ['User'],
                    summary: 'Verify email address',
                    parameters: [
                        { name: 'hash', in: 'query', required: true, schema: { type: 'string' }, description: 'Email confirmation hash' },
                        { name: 'user', in: 'query', required: true, schema: { type: 'string', format: 'email' }, description: 'User email' }
                    ],
                    responses: {
                        200: {
                            description: 'Verification result',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            result: { type: 'object', properties: { verified: { type: 'boolean' } } },
                                            msg: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/user/info/{id}': {
                get: {
                    tags: ['User'],
                    summary: 'Get user info by ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
                    ],
                    responses: {
                        200: {
                            description: 'User info',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInfo' } } }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/user/profile/{id}': {
                post: {
                    tags: ['User'],
                    summary: 'Update user profile and upload avatar',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: { type: 'string', format: 'binary', description: 'Avatar image' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Profile updated', content: { 'application/json': { schema: { type: 'object' } } } },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/user/authentication': {
                get: {
                    tags: ['User'],
                    summary: 'Check JWT authentication status',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Authenticated',
                            content: {
                                'application/json': {
                                    schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/fotones/show/{id}': {
                get: {
                    tags: ['Fotones'],
                    summary: 'Get a fotone by ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Fotone ID' }
                    ],
                    responses: {
                        200: { description: 'Fotone found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Fotone' } } } },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/fotones/show': {
                get: {
                    tags: ['Fotones'],
                    summary: 'Get all fotones with optional filters',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
                        { name: 'imgDominantColor', in: 'query', schema: { type: 'string' }, description: 'Filter by dominant color' },
                        { name: 'imgType', in: 'query', schema: { type: 'string' }, description: 'Filter by image type' }
                    ],
                    responses: {
                        200: {
                            description: 'List of fotones',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            images: { type: 'array', items: { $ref: '#/components/schemas/Fotone' } }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Unauthorized' }
                    }
                }
            },
            '/fotones/images': {
                get: {
                    tags: ['Fotones'],
                    summary: 'Get images to convert',
                    responses: {
                        200: { description: 'Images list' }
                    }
                }
            }
        }
    },
    apis: []
};

module.exports = swaggerJsdoc(options);
