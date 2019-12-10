require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let recipe;
  beforeEach(async() => {
    recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        name: 'salt',
        amount: 2,
        measurement: 'teaspoon'
      }, 
      {
        name: 'flour',
        amount: 1,
        measurement: 'cup'
      },
      {
        name: 'sugar',
        amount: 1,
        measurement: 'cup'
      }
      ]
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{
          name: 'salt',
          amount: 2,
          measurement: 'teaspoon'
        }, 
        {
          name: 'flour',
          amount: 1,
          measurement: 'cup'
        },
        {
          name: 'sugar',
          amount: 1,
          measurement: 'cup'
        }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: expect.any(String),
            name: 'salt',
            amount: 2,
            measurement: 'teaspoon'
          }, 
          {
            _id: expect.any(String),
            name: 'flour',
            amount: 1,
            measurement: 'cup'
          },
          {
            _id: expect.any(String),
            name: 'sugar',
            amount: 1,
            measurement: 'cup'
          }
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });
  it('gets a recipe by id', async() => {
    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          __v: 0,
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: expect.any(String),
            name: 'salt',
            amount: 2,
            measurement: 'teaspoon'
          }, 
          {
            _id: expect.any(String),
            name: 'flour',
            amount: 1,
            measurement: 'cup'
          },
          {
            _id: expect.any(String),
            name: 'sugar',
            amount: 1,
            measurement: 'cup'
          }
          ]
        });
      });
  });
  it('deletes a recipe by id', async() => {
    return request(app)
      .del(`/api/v1/recipes/${recipe._id}`).then(res => expect(res.body._id).toEqual(recipe._id.toString()));
  });

  it('updates a recipe by id', async() => {
    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: expect.any(String),
            name: 'salt',
            amount: 2,
            measurement: 'teaspoon'
          }, 
          {
            _id: expect.any(String),
            name: 'flour',
            amount: 1,
            measurement: 'cup'
          },
          {
            _id: expect.any(String),
            name: 'sugar',
            amount: 1,
            measurement: 'cup'
          }
          ],
          __v: 0
        });
      });
  });
});
