# Space Tracker App

This is the space tracker app for my Advanced Server-side Languages class (WDV442).

## Overview 

Space Tracker WDV is a RESTful API designed to manage and provide information about celestial objects including galaxies, stars, and planets. This API allows users to create, retrieve, update, and delete data regarding these celestial entities and manage relationships between them—such as planets orbiting stars and stars being part of galaxies.

## Features

- Create Celestial Objects: Add new galaxies, stars, and planets to the database.
-  Retrieve Celestial Objects: Query for individual objects by their IDs or retrieve lists of objects, with details on their relationships.
-  Update Celestial Objects: Modify details about galaxies, stars, and planets.
-  Delete Celestial Objects: Remove celestial objects from the database.
-  Manage Relationships: Link planets to stars they orbit and assign stars to galaxies.

## Tech Stack

- Node.js: JavaScript runtime for executing JavaScript on the server.
- Express.js: Web application framework for building web APIs in Node.js.
- Sequelize: ORM for Node.js supporting various SQL databases.
- MySQL: Database system used for storing all celestial data.

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/space-tracker-wdv.git
   cd space-tracker-wdv
   ```
2. Run Docker Container
    ```
   docker-compose up -d
   ```
3. In a new Terminal run 
    ```
   ./bin/node
   ```
   - This will ssh into your node docker container make sure commands for npm are ran through there!
4. Install Dependencies
    ```
    npm install
    ```
   
5. Usage Examples
    * Create a Galaxy:
    ```
   curl -X POST http://localhost:3000/galaxies -H "Content-Type: application/json" -d '{"name": "Milky Way", "size": 100000, "description": "Contains our Solar System."}'
   ```
   * Retrieve Galaxies
    ```
   curl -X GET http://localhost:3000/galaxies
   ```
   * Update a Planet
    ```
   curl -X PUT http://localhost:3000/planets/1 -H "Content-Type: application/json" -d '{"name": "New Earth", "description": "Updated description."}'
   ```
   * Delete a Star
    ```
   curl -X DELETE http://localhost:3000/stars/1
   ```
   
You Should be able to Create, Update, View, Delete etc whether it is new or what is already within the database!

