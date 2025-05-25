// @ts-ignore
import { MBaseController } from '@controller/MBaseController';

const baseRoutes = {
  "/Pbase": {
    "post": {
      "functions": [MBaseController.createMBase], // controllerMethods
      "summary": "base route summery", // Adjust for relevant route
      "tags": ["base"],      
      "security": [],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "base successfully",
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "message": { "type": "string" },
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "error": { "type": "string" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    "get": {
      "functions": [MBaseController.getMBases], // controllerMethods
      "summary": "base route summery", // Adjust for relevant route
      "tags": ["base"],      
      "security": [],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "base successfully",
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "message": { "type": "string" },
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "error": { "type": "string" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  "/Pbase/:id": {
    "get": {
      "functions": [MBaseController.getMBase], // controllerMethods
      "summary": "base route summery", // Adjust for relevant route
      "tags": ["base"],      
      "security": [],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "base successfully",
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "message": { "type": "string" },
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "error": { "type": "string" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    "put": {
      "functions": [MBaseController.updateMBase], // controllerMethods
      "summary": "base route summery", // Adjust for relevant route
      "tags": ["base"],
      "security": [],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "base successfully",
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "message": { "type": "string" },
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "error": { "type": "string" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    "delete": {
      "functions": [MBaseController.deleteMBase], // controllerMethods
      "summary": "base route summery", // Adjust for relevant route
      "tags": ["base"],
      "security": [],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "base successfully",
          "content": {
            "application/json": {
              "schema": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "message": { "type": "string" },
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "success": { "type": "boolean" },
                      "error": { "type": "string" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
};

module.exports = baseRoutes;
