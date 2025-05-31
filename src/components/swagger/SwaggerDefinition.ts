
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sports Platform API",
    version: "1.0.0",
    description: "API documentation for the Sports Platform"
  },
  servers: [
    {
      url: "https://qlrnxgyvplzrkzhhjhab.supabase.co/rest/v1",
      description: "Production API Server"
    }
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        name: "apikey",
        in: "header"
      }
    },
    schemas: {
      Event: {
        type: "object",
        properties: {
          id: { type: "string" },
          event_name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          event_date: { type: "string", format: "date" },
          event_time: { type: "string" },
          registration_url: { type: "string" },
          sport_id: { type: "string" },
          image: { type: "string" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      Game: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          icon: { type: "string" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      Ground: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          description: { type: "string" },
          owner_id: { type: "string" },
          featured: { type: "boolean" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "string" },
          ground_id: { type: "string" },
          user_id: { type: "string" },
          date: { type: "string", format: "date" },
          start_time: { type: "string" },
          end_time: { type: "string" },
          status: { type: "string", enum: ["confirmed", "pending", "cancelled"] },
          created_at: { type: "string", format: "date-time" }
        }
      },
      SportsProfessional: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          profession_type: { type: "string" },
          game_id: { type: "string" },
          fee: { type: "number" },
          fee_type: { type: "string" },
          city: { type: "string" },
          contact_number: { type: "string" },
          created_at: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    "/events": {
      get: {
        summary: "Get all events",
        tags: ["Events"],
        parameters: [
          {
            name: "select",
            in: "query",
            schema: {
              type: "string"
            },
            description: "Fields to select (e.g., *)"
          }
        ],
        responses: {
          "200": {
            description: "List of all events",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Event"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            apiKey: []
          }
        ]
      }
    },
    "/games": {
      get: {
        summary: "Get all games/sports",
        tags: ["Games"],
        parameters: [
          {
            name: "select",
            in: "query",
            schema: {
              type: "string"
            },
            description: "Fields to select (e.g., *)"
          }
        ],
        responses: {
          "200": {
            description: "List of all games/sports",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Game"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            apiKey: []
          }
        ]
      }
    },
    "/grounds": {
      get: {
        summary: "Get all grounds",
        tags: ["Grounds"],
        parameters: [
          {
            name: "select",
            in: "query",
            schema: {
              type: "string"
            },
            description: "Fields to select (e.g., *)"
          }
        ],
        responses: {
          "200": {
            description: "List of all grounds",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Ground"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            apiKey: []
          }
        ]
      }
    },
    "/bookings": {
      get: {
        summary: "Get all bookings",
        tags: ["Bookings"],
        parameters: [
          {
            name: "select",
            in: "query",
            schema: {
              type: "string"
            },
            description: "Fields to select (e.g., *)"
          }
        ],
        responses: {
          "200": {
            description: "List of all bookings",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Booking"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            apiKey: []
          }
        ]
      }
    },
    "/sports_professionals": {
      get: {
        summary: "Get all sports professionals",
        tags: ["Sports Professionals"],
        parameters: [
          {
            name: "select",
            in: "query",
            schema: {
              type: "string"
            },
            description: "Fields to select (e.g., *)"
          }
        ],
        responses: {
          "200": {
            description: "List of all sports professionals",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/SportsProfessional"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            apiKey: []
          }
        ]
      }
    }
  }
};
