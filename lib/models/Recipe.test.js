const mongoose = require('mongoose');
const Recipe = require('./Recipe');

describe('Recipe model', () => {
  it('has a required name', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name, directions and ingredients field', () => {
    const recipe = new Recipe({
      name: 'Cookies',
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
    console.log(recipe.toJSON());
    expect(recipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        _id: expect.any(mongoose.Types.ObjectId),
        name: 'salt',
        amount: 2,
        measurement: 'teaspoon'
      }, 
      {
        _id: expect.any(mongoose.Types.ObjectId),
        name: 'flour',
        amount: 1,
        measurement: 'cup'
      },
      {
        _id: expect.any(mongoose.Types.ObjectId),
        name: 'sugar',
        amount: 1,
        measurement: 'cup'
      }
      ]
    });
  });
});
