
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sports Platform API",
    version: "1.0.0",
    description: "API documentation for the Sports Platform",
    contact: {
      email: "info@sportsplatform.com"
    }
  },
  servers: [
    {
      url: "https://qlrnxgyvplzrkzhhjhab.supabase.co/rest/v1",
      description: "Production server"
    }
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "apikey",
        description: "Supabase anonymous key for API access"
      }
    }
  },
  security: [
    {
      apiKey: []
    }
  ],
  paths: {
    "/events": {
      get: {
        summary: "Returns all events",
        description: "Retrieves a list of all sports events",
        operationId: "getEvents",
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to return",
            required: false,
            schema: {
              type: "string",
              example: "*"
            }
          },
          {
            name: "order",
            in: "query",
            description: "Order results by column",
            required: false,
            schema: {
              type: "string",
              example: "event_date.asc"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
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
        }
      }
    },
    "/events/{id}": {
      get: {
        summary: "Returns a single event",
        description: "Retrieves details of a specific event by ID",
        operationId: "getEventById",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Event ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Event"
                }
              }
            }
          }
        }
      }
    },
    "/games": {
      get: {
        summary: "Returns all games/sports",
        description: "Retrieves a list of all available games/sports",
        operationId: "getGames",
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to return",
            required: false,
            schema: {
              type: "string",
              example: "*"
            }
          },
          {
            name: "order",
            in: "query",
            description: "Order results by column",
            required: false,
            schema: {
              type: "string",
              example: "name.asc"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
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
        }
      }
    },
    "/grounds": {
      get: {
        summary: "Returns all grounds",
        description: "Retrieves a list of all sports grounds/venues",
        operationId: "getGrounds",
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to return",
            required: false,
            schema: {
              type: "string",
              example: "*"
            }
          },
          {
            name: "order",
            in: "query",
            description: "Order results by column",
            required: false,
            schema: {
              type: "string",
              example: "name.asc"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
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
        }
      }
    },
    "/grounds/{id}": {
      get: {
        summary: "Returns a single ground",
        description: "Retrieves details of a specific ground by ID",
        operationId: "getGroundById",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Ground ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Ground"
                }
              }
            }
          }
        }
      }
    },
    "/bookings": {
      get: {
        summary: "Returns all bookings",
        description: "Retrieves a list of all bookings",
        operationId: "getBookings",
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to return",
            required: false,
            schema: {
              type: "string",
              example: "*"
            }
          },
          {
            name: "order",
            in: "query",
            description: "Order results by column",
            required: false,
            schema: {
              type: "string",
              example: "date.desc"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
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
        }
      }
    },
    "/sports_professionals": {
      get: {
        summary: "Returns all sports professionals",
        description: "Retrieves a list of all sports professionals",
        operationId: "getSportsProfessionals",
        parameters: [
          {
            name: "select",
            in: "query",
            description: "Fields to return",
            required: false,
            schema: {
              type: "string",
              example: "*"
            }
          },
          {
            name: "order",
            in: "query",
            description: "Order results by column",
            required: false,
            schema: {
              type: "string",
              example: "name.asc"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
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
        }
      }
    }
  },
  components: {
    schemas: {
      Event: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          event_name: {
            type: "string"
          },
          address: {
            type: "string"
          },
          city: {
            type: "string"
          },
          location: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            }
          },
          event_date: {
            type: "string",
            format: "date"
          },
          event_time: {
            type: "string",
            format: "time"
          },
          registration_url: {
            type: "string",
            nullable: true
          },
          sport_id: {
            type: "string",
            format: "uuid",
            nullable: true
          },
          image: {
            type: "string",
            nullable: true
          },
          qr_code: {
            type: "string",
            nullable: true
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          }
        }
      },
      Game: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          name: {
            type: "string"
          }
        }
      },
      Ground: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          name: {
            type: "string"
          },
          description: {
            type: "string",
            nullable: true
          },
          address: {
            type: "string"
          },
          location: {
            type: "object",
            nullable: true,
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            }
          },
          owner_id: {
            type: "string",
            format: "uuid"
          },
          games: {
            type: "array",
            items: { type: "string" },
            nullable: true
          },
          facilities: {
            type: "array",
            items: { type: "string" },
            nullable: true
          },
          images: {
            type: "array",
            items: { type: "string" },
            nullable: true
          },
          rating: {
            type: "number",
            nullable: true
          },
          review_count: {
            type: "integer",
            nullable: true
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          }
        }
      },
      Booking: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          user_id: {
            type: "string",
            format: "uuid"
          },
          ground_id: {
            type: "string",
            format: "uuid"
          },
          date: {
            type: "string"
          },
          total_amount: {
            type: "number"
          },
          booking_status: {
            type: "string"
          },
          payment_status: {
            type: "string"
          },
          sports_area_id: {
            type: "string",
            nullable: true
          },
          game_ids: {
            type: "array",
            items: { type: "string" },
            nullable: true
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          }
        }
      },
      SportsProfessional: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          name: {
            type: "string"
          },
          profession_type: {
            type: "string",
            enum: ["Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"]
          },
          fee: {
            type: "number"
          },
          fee_type: {
            type: "string",
            enum: ["Per Hour", "Per Day", "Per Match"]
          },
          game_id: {
            type: "string",
            format: "uuid"
          },
          address: {
            type: "string"
          },
          city: {
            type: "string"
          },
          contact_number: {
            type: "string"
          },
          comments: {
            type: "string",
            nullable: true
          },
          photo: {
            type: "string",
            nullable: true
          },
          user_id: {
            type: "string",
            format: "uuid",
            nullable: true
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          }
        }
      }
    }
  }
};
