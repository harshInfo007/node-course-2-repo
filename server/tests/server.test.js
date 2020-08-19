const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { populateTodos, todos} = require('./seed/seed')


beforeEach(populateTodos)

describe('Post /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app).post('/todos').send({ text }).expect(200).expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((e,resp) => {
            if(e){
                return done(e)
            }

            Todo.find().then((obj) => {
                expect(obj.length).toBe(1);
                expect(obj[0].text).toBe(text)
                done();
            }).catch((e) => done(e));
        })

    })
})